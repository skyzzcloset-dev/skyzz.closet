const mongoose = require("mongoose");
const cartModel = require("../models/cart.model");

// ================= GET CART =================
async function getCart(req, res) {
  try {
    const user = req.user;
    if (!user)
      return res.status(403).json({success: false, message: "Unauthorized"});

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
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({success: false, message: error.message});
  }
}

// ================= ADD ITEM =================
async function addItemToCart(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({message: "Unauthorized"});

    let items = [];

    if (Array.isArray(req.body.items)) items = req.body.items;
    else if (req.body.productId && req.body.quantity) {
      items.push({
        productId: req.body.productId,
        quantity: Number(req.body.quantity),
        sizes: req.body.sizes || [],
        colors: req.body.colors || [],
      });
    } else
      return res.status(400).json({message: "Invalid product or quantity"});

    let cart = await cartModel.findOne({user: user.id});
    if (!cart) cart = new cartModel({user: user.id, items: []});

    for (const item of items) {
      const existing = cart.items.findIndex(
        (i) => i.productId.toString() === item.productId
      );
      if (existing !== -1) {
        cart.items[existing].quantity += item.quantity;
        if (item.sizes?.length) cart.items[existing].sizes = item.sizes;
        if (item.colors?.length) cart.items[existing].colors = item.colors;
      } else {
        cart.items.push(item);
      }
    }

    await cart.save();
    return res.status(201).json({message: "Item(s) added to cart", cart});
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({message: error.message});
  }
}

// ================= UPDATE CART ITEM =================
async function updateCart(req, res) {
  try {
    const user = req.user;
    console.log(user);
    
    const cart = await cartModel.findOne({ user: user.id });
    console.log(cart);
    
   console.log(cart.items);
   
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 🟢 Case 1: Bulk update with items array
    if (cart.items && Array.isArray(cart.items)) {
      cart.items.forEach((updateItem) => {
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
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      }

      if (!quantity || quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be greater than 0" });
      }

      const idx = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );
      if (idx < 0) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart.items[idx].quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// ================= DELETE CART ITEM =================
async function deleteCart(req, res) {
  try {
    const {id} = req.params;
    const cart = await cartModel.findOne({user: req.user.id});

    if (!cart) return res.status(404).json({message: "Cart not found"});

    const index = cart.items.findIndex((item) => item._id.toString() === id);

    if (index < 0)
      return res.status(404).json({message: "Item not found in cart"});

    cart.items.splice(index, 1);
    await cart.save();

    return res.status(200).json({message: "Item removed", cart});
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({message: error.message});
  }
}

module.exports = {getCart, addItemToCart, updateCart, deleteCart};
