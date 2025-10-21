const express = require("express");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
  countOrders,
  getAllOrders,
} = require("../controllers/order.controller");

const router = express.Router();

// ✅ Static & specific routes FIRST
router.post("/create", createAuthMiddleware(["customer"]), createOrder);
router.post("/cancel/:id", createAuthMiddleware(["customer"]), cancelOrderById);

router.get("/me", createAuthMiddleware(["customer"]), getMyOrders);
router.get("/getAllOrders", createAuthMiddleware(["admin"]), getAllOrders);
router.get("/orderCount", createAuthMiddleware(["admin"]), countOrders);

// ✅ Address update before dynamic :id
router.patch(
  "/address/:id",
  createAuthMiddleware(["customer"]),
  updateOrderAddress
);

// ✅ Dynamic route LAST (or with regex)
router.get("/:id", createAuthMiddleware(["customer"]), getOrderById);

module.exports = router;
