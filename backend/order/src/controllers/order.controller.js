const orderModel = require("../models/order.model");
const axios = require("axios");

// ✅ Create Order
async function createOrder(req, res) {
  try {
    const user = req.user;
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(401).json({success: false, message: "Unauthorized"});

    // ✅ 1. Validate Shipping Address FIRST
    const shipping = req.body.shippingAddress;
    if (
      !shipping ||
      !shipping.firstName ||
      !shipping.lastName ||
      !shipping.phone ||
      !shipping.street ||
      !shipping.city ||
      !shipping.state ||
      !shipping.zip ||
      !shipping.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // ✅ 2. Fetch Cart
    const {data: cartData} = await axios.get(
      "https://skyzzcloset-production.up.railway.app/api/cart/getItems",
      {headers: {Authorization: `Bearer ${token}`}}
    );

    const items = cartData?.cart?.items || [];
    if (!items.length)
      return res.status(400).json({success: false, message: "Cart is empty"});

    // ✅ 3. Fetch Products
    const products = await Promise.all(
      items.map(async (item) => {
        try {
          const response = await axios.get(
            `https://product-production-4bd9.up.railway.app/api/product/get/${item.productId}`,
            {headers: {Authorization: `Bearer ${token}`}}
          );
          return response.data.product;
        } catch (err) {
          console.error(
            "Product fetch failed for:",
            item.productId,
            err.response?.data || err.message
          );
          return null;
        }
      })
    );

    // ✅ 4. Calculate Total Amount
    let totalAmountValue = 0;
    const orderItems = items.map((item) => {
      const product = products.find(
        (p) => p && p._id.toString() === item.productId.toString()
      );
      if (!product) throw new Error(`Product not found`);
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      const itemTotal = product.price * item.quantity;
      totalAmountValue += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: {amount: itemTotal, currency: "INR"},
      };
    });

    // ✅ 5. Add Delivery Charge ONCE
    const deliveryCharges = shipping.state === "Delhi" ? 60 : 80;
    totalAmountValue += deliveryCharges;

    // ✅ 6. Create Order
    const order = await orderModel.create({
      user: user.id,
      items: orderItems,
      status: "PENDING",
      totalAmount: {
        price: totalAmountValue,
        delivery: deliveryCharges,
        currency: "INR",
      },
      shippingAddress: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        phone: shipping.phone,
        street: shipping.street,
        apartment: shipping.apartment || "",
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        country: shipping.country,
      },
    });

    return res
      .status(201)
      .json({success: true, message: "Order created", order});
  } catch (error) {
    console.error("Order error:", error.response?.data || error.message);
    return res.status(500).json({success: false, message: error.message});
  }
}

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
