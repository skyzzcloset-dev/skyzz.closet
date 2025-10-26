const mongoose = require("mongoose");
const cartModel = require("../models/cart.model");

// ================= GET CART =================
async function getCart(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    let cart = await cartModel.findOne({user: user.id});

    if (!cart) {
      cart = new cartModel({user: user.id, items: []});
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart found",
      cart,
      totals: {
        itemsCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        colors: cart.colors,
        sizes: cart.sizes,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function addItemToCart(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({message: "Unauthorized: No user found"});
    }

    let items = [];

    // Handle both formats
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
        sizes: req.body.sizes || [],
        colors: req.body.colors || [],
      });
    } else {
      return res.status(400).json({message: "Invalid product or quantity"});
    }

    // Validate
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

    // Add/update items
    for (const item of items) {
      const existingIndex = cart.items.findIndex(
        (i) => i.productId.toString() === item.productId
      );

      if (existingIndex !== -1) {
        // If already in cart → update
        cart.items[existingIndex].quantity += item.quantity;

        if (item.sizes?.length > 0) {
          cart.items[existingIndex].sizes = item.sizes;
        }
        if (item.colors?.length > 0) {
          cart.items[existingIndex].colors = item.colors;
        }
      } else {
        // New item
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
          sizes: item.sizes || [],
          colors: item.colors || [],
        });
      }
    }

    await cart.save();

    await cartModel.create({
      user,
      cart,
      totals: {
        itemsCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        colors: cart.colors,
        sizes: cart.sizes,
      },
    });

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
    const user = req.user;
    const cart = await cartModel.findOne({user: user.id});

    if (!cart) {
      return res.status(404).json({message: "Cart not found"});
    }

    // 🟢 Case 1: Bulk update with items array
    if (req.body.items && Array.isArray(req.body.items)) {
      req.body.items.forEach((updateItem) => {
        const idx = cart.items.findIndex(
          (i) => i.productId.toString() === updateItem.productId
        );
        if (idx >= 0) {
          if (!updateItem.quantity || updateItem.quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
          }
          cart.items[idx].quantity = updateItem.quantity;
        }
      });
    } else {
      // 🟢 Case 2: Single update with productId param + quantity in body
      const {productId} = req.params;
      const {quantity} = req.body;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({message: "Invalid Product ID"});
      }

      if (!quantity || quantity <= 0) {
        return res
          .status(400)
          .json({message: "Quantity must be greater than 0"});
      }

      const idx = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );
      if (idx < 0) {
        return res.status(404).json({message: "Item not found in cart"});
      }

      cart.items[idx].quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({message: "Cart updated", cart});
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

    const cart = await cartModel.findOne({user: req.user.id});
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
