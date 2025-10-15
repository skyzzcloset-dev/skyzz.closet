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

    // Fetch Cart
    const {data: cartData} = await axios.get(
      "http://cart-production-72ab.up.railway.app/api/cart/getItems",
      {headers: {Authorization: `Bearer ${token}`}}
    );
    console.log(cartData?.cart?.items);

    const items = cartData?.cart?.items || [];
    if (!items.length)
      return res.status(400).json({success: false, message: "Cart is empty"});

    // Fetch Products
    const products = await Promise.all(
      items.map(async (item) => {
        try {
          const res = await axios.get(
            `https://product-production-4bd9.up.railway.app/api/product/get/${item.productId}`,
            {headers: {Authorization: `Bearer ${token}`}}
          );
          return res.data.product;
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

    console.log(
      items.map((item) => item.productId),
      products
    );

    // Build Order Items
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

    // Shipping Validation
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

    // Create Order
    const order = await orderModel.create({
      user: user.id,
      items: orderItems,
      status: "PENDING",
      totalAmount: {price: totalAmountValue, currency: "INR"},
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

async function getMyOrders(req, res) {
  try {
    const {id} = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel.find({user: id}).skip(skip).limit(limit),
      orderModel.countDocuments({user: id}),
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
    const {id} = req.user;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.user.toString() !== id)
      return res.status(403).json({message: "Forbidden"});
    res.status(200).json({order});
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal server error", error: error.message});
  }
}

// ✅ Cancel Order
async function cancelOrderById(req, res) {
  try {
    const {id} = req.user;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.user.toString() !== id)
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
    const {id} = req.user;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.user.toString() !== id)
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

async function countOrders(req, res) {
  try {
    const res = await orderModel.countDocuments();
    if (!res) {
      return res.status(400).json({message: "Orders not Fetched"});
    }

    return res
      .status(200)
      .json({message: "Orders Fetched Successfully", count: res});
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
  countOrders
};
