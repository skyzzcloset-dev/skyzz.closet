const cartModel = require("../models/cart.model");

async function addToCart(req, res) {
  try {
    const cartItem = await cartModel.create({ ...req.body, user: req.user._id });
    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCart(req, res) {
  try {
    const cart = await cartModel.find({ user: req.user._id }).populate("product");
    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCartItem(req, res) {
  try {
    const updated = await cartModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Cart item not found" });
    res.status(200).json({ message: "Cart item updated", cartItem: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeCartItem(req, res) {
  try {
    const deleted = await cartModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Cart item not found" });
    res.status(200).json({ message: "Cart item removed", cartItemId: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addToCart, getCart, updateCartItem, removeCartItem };
