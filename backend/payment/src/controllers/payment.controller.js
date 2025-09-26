const paymenytModel = require("../models/payment.model");
const axios = require("axios");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPayment(req, res) {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    const orderId = req.params.orderId;

    const orderResponse = await axios.get(
      "http://localhost:3003/api/order/" + orderId,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const price = orderResponse.data.order.totalPrice;
    const order = await razorpay.orders.create(price);

    const payment = await paymenytModel.create({
      order: orderId,
      razorpayOrderId: order.id,
      user: req.user.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
    });
    return res.status(201).json({message: "Payment initiated", payment});
  } catch (error) {
    console.log(err);
    return res.status(500).json({message: "Internal Server Error"});
  }
}

async function verifyPayment(req, res) {
  const {razorpayOrderId, paymentId, signature} = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const isValid = validatePaymentVerification(
      {
        order_id: razorpayOrderId,
        payment_id: paymentId,
      },
      signature,
      secret
    );

    if (!isValid) {
      return res.status(400).json({message: "Invalid signature"});
    }

    const payment = await paymenytModel.findOne({
      razorpayOrderId,
      status: "PENDING",
    });

    if (!payment) {
      return res.status(404).json({message: "Payment not found"});
    }

    (payment.paymentId = paymentId),
      (payment.signature = signature),
      (payment.status = "COMPLETED");

    await payment.save();

    res.status(200).json({message: "Payment verified successfully", payment});
  } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {createPayment , verifyPayment};
