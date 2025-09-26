const paymentModel = require("../models/payment.model");
const axios = require("axios");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPayment(req, res) {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  try {
    const orderId = req.params.orderId;

    // Fetch order from your order service
    const orderResponse = await axios.get(
      `http://localhost:3003/api/order/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const totalAmount = orderResponse.data.order.totalAmount;

    // Prepare Razorpay order options
    const options = {
      amount: totalAmount.price * 100, // convert to paise
      currency: totalAmount.currency,
      receipt: orderId,
      payment_capture: 1,
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Save payment record in DB
    const payment = await paymentModel.create({
      order: orderId,
      razorpayOrderId: order.id,
      user: req.user.id,
      price: {
        amount: totalAmount.price,
        currency: totalAmount.currency,
      },
    });

    return res
      .status(201)
      .json({ message: "Payment initiated", payment });
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyPayment(req, res) {
  const { razorpayOrderId, paymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
   const { validatePaymentVerification, } = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const isValid = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: paymentId },
      signature,
      secret
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await paymentModel.findOne({
      razorpayOrderId,
      status: "PENDING",
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = "COMPLETED";

    await payment.save();

    res.status(200).json({ message: "Payment verified successfully", payment });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}




module.exports = {createPayment, verifyPayment};
