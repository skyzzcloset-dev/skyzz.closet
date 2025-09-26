const orderModel = require("../models/order.model");
const axios = require("axios");

async function createOrder(req, res) {
  try {
    const user = req.user;

    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    // ✅ Fetch cart
    const response = await axios.get(
      "http://localhost:3001/api/cart/getItems",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Cart response:", response.data);

    // ✅ Fetch product details
    const products = await Promise.all(
      response.data.cart.items.map(async (item) => {
        const { data } = await axios.get(
          `http://localhost:8000/api/product/get/${item.productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return data.data;
      })
    );

    let priceAmount = 0;

    // ✅ Build order items
    const orderItems = response.data.cart.items.map((item) => {
      const product = products.find((p) => p._id === item.productId);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.title} is out of stock or insufficient stock`,
        });
      }

      const itemTotal = product.price.amount * item.quantity;
      priceAmount += itemTotal;

      return {
        product: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price.currency,
        },
      };
    });

    // ✅ Create order
    const order = await orderModel.create({
      user: user._id,
      items: orderItems,
      status: "PENDING",
      totalPrice: {
        amount: priceAmount,
        currency: "INR",
      },
      shippingAddress: {
        street: req.body.shippingAddress.street,
        city: req.body.shippingAddress.city,
        state: req.body.shippingAddress.state,
        zip: req.body.shippingAddress.pincode,
        country: req.body.shippingAddress.country,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order created",
      cart: response.data,
      order,
    });
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  const user = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await orderModel
      .find({ user: user.id })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalOrders = await orderModel.countDocuments({ user: user.id });

    res.status(200).json({
      orders,
      meta: {
        total: totalOrders,
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function cancelOrderById(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this order",
      });
    }

    if (order.status !== "PENDING") {
      return res.status(409).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function updateOrderAddress(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this order",
      });
    }

    if (order.status !== "PENDING") {
      return res.status(409).json({
        message: "Order address cannot be updated at this stage",
      });
    }

    order.shippingAddress = {
      street: req.body.shippingAddress.street,
      city: req.body.shippingAddress.city,
      state: req.body.shippingAddress.state,
      zip: req.body.shippingAddress.zip,
      country: req.body.shippingAddress.country,
    };

    await order.save();
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getOrderById(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not Found" });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this order",
      });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  cancelOrderById,
  updateOrderAddress,
  getOrderById,
};
