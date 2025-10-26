const express = require("express");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {
  addItemToCart,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart.controller");

const router = express.Router();

// Only customers can add, update, get, or delete their own cart
router.post("/items", createAuthMiddleware(), addItemToCart);
router.get("/getItems", createAuthMiddleware(["customer"]), getCart);

router.patch(
  "/items/:productId",
  createAuthMiddleware(["customer"]),
  updateCart
);

router.delete(
  "/items/:productId",
  createAuthMiddleware(["customer"]),
  deleteCart
);

module.exports = router;
