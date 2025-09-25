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

    // Correct axios.get call
    const response = await axios.get(
      "http://localhost:3001/api/cart/getItems",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("Cart response:", response.data);

    return res
      .status(201)
      .json({ success: true, message: "Order created", cart: response.data });
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}


module.exports = { createOrder };
