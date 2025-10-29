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
  const {id} = req.params;
  const {qty} = req.body;
  const user = req.user;
  const cart = await cartModel.findOne({user: user.id});

  console.log(cart);

  if (!cart) {
    return res.status(404).json({message: "Cart not found"});
  }
  const index = cart.items.findIndex((item) => item._id.toString() === id);

  if (index < 0) {
    return res.status(404).json({message: "Item not found"});
  }
  cart.items[index].quantity = qty;
  await cart.save();
  res.status(200).json({message: "Item updated", cart});
}

// ================= DELETE CART ITEM =================
async function deleteCart(req, res) {
  try {
    const {id} = req.params;
    const cart = await cartModel.findOne({user: req.user.id});

    console.log(cart);
    console.log("REQ.USER:", req.user);
    console.log("AUTH HEADER:", req.headers.authorization);

    if (!cart) return res.status(404).json({message: "Cart not found"});

    const index = cart.items.findIndex((item) => item._id.toString() === id);

    console.log(index);

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
