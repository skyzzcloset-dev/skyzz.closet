const orderModel = require("../models/order.model");
const axios = require("axios");

// ✅ Create Order
async function createOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    if (
      !shippingAddress?.firstName ||
      !shippingAddress?.lastName ||
      !shippingAddress?.phone ||
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.zip ||
      !shippingAddress?.country
    ) {
      throw new Error("Complete shipping address is required");
    }

    // ✅ Fetch user cart from DB
    const cart = await cartModel.findOne({ user: userId }).populate("items.productId");
    if (!cart || !cart.items.length) throw new Error("Cart is empty");

    let totalAmount = 0;
    const orderItems = [];

    // ✅ Loop through cart and verify stock + price
    for (const item of cart.items) {
      const product = item.productId;

      if (!product) throw new Error("Product not found");
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // ✅ Deduct stock immediately
      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: { amount: itemTotal, currency: "INR" },
      });
    }

    // ✅ Add delivery charge dynamically
    const deliveryCharge = shippingAddress.state === "Delhi" ? 60 : 80;
    totalAmount += deliveryCharge;

    // ✅ Create order
    const order = await orderModel.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount: {
            price: totalAmount,
            delivery: deliveryCharge,
            currency: "INR",
          },
          shippingAddress,
          status: "PENDING",
        },
      ],
      { session }
    );

    // ✅ Clear cart
    await cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: order[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get My Orders (with pagination)
async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel.find({user: userId}).skip(skip).limit(limit),
      orderModel.countDocuments({user: userId}),
    ]);

    res.status(200).json({orders, meta: {total, page, limit}});
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal server error", error: error.message});
  }
}

// ✅ Get Order by ID
async function getOrderById(req, res) {
  try {
    const userId = req.user.id;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.user.toString() !== userId)
      return res.status(403).json({message: "Forbidden"});

    res.status(200).json({order});
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal server error", error: error.message});
  }
}

// ✅ Get All Orders (Admin)
async function getAllOrders(req, res) {
  try {
    const {
      firstName,
      lastName,
      phone,
      street,
      apartment,
      city,
      state,
      zip,
      createdAt,
      productId,
      minTotal,
      maxTotal,
      skip = 0,
      limit = 20,
    } = req.query;

    const filter = {};

    if (firstName)
      filter["shippingAddress.firstName"] = {$regex: firstName, $options: "i"};
    if (lastName)
      filter["shippingAddress.lastName"] = {$regex: lastName, $options: "i"};
    if (phone) filter["shippingAddress.phone"] = phone;
    if (street)
      filter["shippingAddress.street"] = {$regex: street, $options: "i"};
    if (apartment)
      filter["shippingAddress.apartment"] = {$regex: apartment, $options: "i"};
    if (city) filter["shippingAddress.city"] = {$regex: city, $options: "i"};
    if (state) filter["shippingAddress.state"] = {$regex: state, $options: "i"};
    if (zip) filter["shippingAddress.zip"] = zip;
    if (createdAt) filter.createdAt = new Date(createdAt);
    if (productId) filter["items.productId"] = productId;
    if (minTotal || maxTotal) {
      filter["totalAmount.price"] = {};
      if (minTotal) filter["totalAmount.price"].$gte = parseFloat(minTotal);
      if (maxTotal) filter["totalAmount.price"].$lte = parseFloat(maxTotal);
    }

    const orders = await orderModel
      .find(filter)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const orderIds = orders.map((order) => order._id);

    return res.status(200).json({success: true, orders, orderIds});
  } catch (error) {
    return res
      .status(500)
      .json({success: false, message: "Server error", details: error.message});
  }
}

// ✅ Cancel Order
async function cancelOrderById(req, res) {
  try {
    const userId = req.user.id;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.user.toString() !== userId)
      return res.status(403).json({message: "Forbidden"});
    if (order.status !== "PENDING")
      return res.status(409).json({message: "Cannot cancel at this stage"});

    order.status = "CANCELLED";
    await order.save();
    res.status(200).json({order});
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal server error", error: error.message});
  }
}

// ✅ Update Shipping Address
async function updateOrderAddress(req, res) {
  try {
    const userId = req.user.id;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.user.toString() !== userId)
      return res.status(403).json({message: "Forbidden"});
    if (order.status !== "PENDING")
      return res.status(409).json({message: "Cannot update at this stage"});

    order.shippingAddress = {
      ...order.shippingAddress,
      ...req.body.shippingAddress,
    };

    await order.save();
    res.status(200).json({order});
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal server error", error: error.message});
  }
}

// ✅ Count Orders
async function countOrders(req, res) {
  try {
    const count = await orderModel.countDocuments();

    res.status(200).json({message: "Orders fetched successfully", count});
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal server error", error: error.message});
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
  countOrders,
  getAllOrders,
};
