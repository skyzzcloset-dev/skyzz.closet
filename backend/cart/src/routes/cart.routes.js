// backend/src/routes/cart.routes.js
const express = require("express");
const { createAuthMiddleware } = require("../middlewares/auth.middleware");
const {
  addItemToCart,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.post("/items", createAuthMiddleware(["customer"]), addItemToCart);
router.get("/getItems", createAuthMiddleware(["customer"]), getCart);
router.patch("/items/:productId", createAuthMiddleware(["customer"]), updateCart);
router.delete("/items/:productId", createAuthMiddleware(["customer"]), deleteCart);

module.exports = router;
