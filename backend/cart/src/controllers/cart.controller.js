const cartModel = require("../models/cart.model");

async function addItemToCart(req, res) {
  try {
    const { productId, qty } = req.body;
    const user = req.user;

    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    let cart = await cartModel.findOne({ user: user._id });

    if (!cart) {
      cart = new cartModel({ user: user._id, items: [] });
    }

    const existingCartIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingCartIndex !== -1) {
      cart.items[existingCartIndex].quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}




module.exports = { addItemToCart };
