const paymentModel = require("../models/payment.model");
const Razorpay = require("razorpay");
const axios = require("axios");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
async function createPayment(req, res) {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({message: "Unauthorized"});

    const orderId = req.params.orderId;

    // Fetch your order from backend
    const orderResponse = await axios.get(
      `https://order-pvnb.onrender.com/api/order/${orderId}`,
      {headers: {Authorization: `Bearer ${token}`}}
    );
    const totalAmount = orderResponse.data.order.totalAmount;

    // Razorpay order options
    const options = {
      amount: totalAmount.price * 100, // in paise
      currency: totalAmount.currency || "INR",
      receipt: orderId,
      payment_capture: 1,
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment record
    const payment = await paymentModel.create({
      order: orderId,
      razorpayOrderId: razorpayOrder.id,
      user: req.user.id,
      price: {
        amount: totalAmount.price,
        currency: totalAmount.currency || "INR",
      },
    });

    res.status(201).json({
      message: "Payment order created",
      razorpayOrderId: razorpayOrder.id,
      payment,
    });
  } catch (error) {
    console.error(
      "Payment creation error:",
      error.response?.data || error.message
    );
    res.status(500).json({message: "Internal Server Error"});
  }
}

// Verify Razorpay payment
async function verifyPayment(req, res) {
  const {razorpayOrderId, paymentId, signature} = req.body;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({message: "Invalid signature"});
    }

    // Find the payment in DB
    const payment = await paymentModel.findOne({
      razorpayOrderId,
      status: "PENDING",
    });

    if (!payment) {
      return res.status(404).json({message: "Payment not found"});
    }

    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = "COMPLETED";

    await payment.save();

    res.status(200).json({message: "Payment verified successfully", payment});
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

async function getPayment(req, res) {
  const { user, order, status, razorpayOrderId, skip = 0, limit = 20 } = req.query;

  try {
    const filter = {};

    if (user) filter.user = user;
    if (order) filter.order = order;
    if (status) filter.status = status;
    if (razorpayOrderId) filter.razorpayOrderId = razorpayOrderId;

    const payments = await paymentModel
      .find(filter)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    return res.status(200).json({ message: "Payments found", payments });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
}


module.exports = {createPayment, verifyPayment, getPayment};
