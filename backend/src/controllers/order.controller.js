const orderModel = require("../models/order.model");

async function createOrder(req, res) {
  try {
    const order = await orderModel.create({ ...req.body, user: req.user._id });
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await orderModel.find({ user: req.user._id }).populate("products.product");
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderModel.findById(req.params.id).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateOrder(req, res) {
  try {
    const updated = await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createOrder, getOrders, getOrderById, updateOrder };
