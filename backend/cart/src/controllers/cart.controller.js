const mongoose = require("mongoose");
const cartModel = require("../models/cart.model");

// ================= GET CART =================
async function getCart(req, res) {
  try {
    const user = req.user;

    let cart = await cartModel.findOne({user: user.id});

    if (!cart) {
      cart = new cartModel({user: user.id, items: []});
      await cart.save();
    }

    return res.status(200).json({
      message: "Cart Found",
      cart,
      totals: {
        itemsCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res
      .status(500)
      .json({message: "Server Error", error: error.message});
  }
}

async function addItemToCart(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({message: "Unauthorized: No user found"});
    }

    let items = [];

    // Handle both formats: { productId, quantity } OR { items: [{ productId, quantity }, ...] }
    if (
      req.body.items &&
      Array.isArray(req.body.items) &&
      req.body.items.length > 0
    ) {
      items = req.body.items;
    } else if (req.body.productId && req.body.quantity) {
      items.push({
        productId: req.body.productId,
        quantity: Number(req.body.quantity),
      });
    } else {
      return res.status(400).json({message: "Invalid product or quantity"});
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res
          .status(400)
          .json({message: "Invalid product or quantity in items"});
      }
    }

    // Find or create cart
    let cart = await cartModel.findOne({user: user.id});
    if (!cart) {
      cart = new cartModel({user: user.id, items: []});
    }

    // Add/update items in cart
    for (const item of items) {
      const existingIndex = cart.items.findIndex(
        (i) => i.productId.toString() === item.productId
      );

      if (existingIndex !== -1) {
        cart.items[existingIndex].quantity += item.quantity;
      } else {
        cart.items.push({productId: item.productId, quantity: item.quantity});
      }
    }

    await cart.save();

    return res.status(201).json({message: "Item(s) added to cart", cart});
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res
      .status(500)
      .json({message: "Server error", error: error.message});
  }
}

// ================= UPDATE CART ITEM =================
async function updateCart(req, res) {
  try {
    const {productId} = req.params;
    const {quantity} = req.body; // <- changed from qty

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({message: "Invalid Product ID"});
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({message: "Quantity must be greater than 0"});
    }

    const user = req.user;
    const cart = await cartModel.findOne({user: user._id});

    if (!cart) return res.status(404).json({message: "Cart not found"});

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingIndex < 0)
      return res.status(404).json({message: "Item not found in cart"});

    cart.items[existingIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({message: "Item updated", cart});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({message: "Server error", error: error.message});
  }
}

// ================= DELETE CART ITEM =================
async function deleteCart(req, res) {
  try {
    const {productId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({message: "Invalid Product ID"});
    }

    const cart = await cartModel.findOne({user: req.user._id});
    if (!cart) {
      return res.status(404).json({message: "Cart not found"});
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({message: "Product not found in cart"});
    }

    cart.items.splice(itemIndex, 1); // remove product
    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res
      .status(500)
      .json({message: "Server error", error: error.message});
  }
}

module.exports = {getCart, addItemToCart, updateCart, deleteCart};
