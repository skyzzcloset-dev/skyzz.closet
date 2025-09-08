const paymentModel = require("../models/payment.model");

async function createPayment(req, res) {
  try {
    const payment = await paymentModel.create({ ...req.body, user: req.user._id });
    res.status(201).json({ message: "Payment created", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPayments(req, res) {
  try {
    const payments = await paymentModel.find({ user: req.user._id });
    res.status(200).json({ message: "Payments fetched", payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPayment, getPayments };
