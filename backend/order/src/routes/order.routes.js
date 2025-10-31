const express = require("express");
const { createAuthMiddleware } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
  countOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const router = express.Router();

// ✅ Customer routes
router.post("/create", createAuthMiddleware(["customer"]), createOrder);
router.post("/cancel/:id", createAuthMiddleware(["customer"]), cancelOrderById);
router.get("/me", createAuthMiddleware(["customer"]), getMyOrders);
router.patch(
  "/address/:id",
  createAuthMiddleware(["customer"]),
  updateOrderAddress
);

// ✅ Admin routes
router.get("/getAllOrders", createAuthMiddleware(["admin"]), getAllOrders);
router.get("/orderCount", createAuthMiddleware(["admin"]), countOrders);
router.patch(
  "/updateStatus/:id",
  createAuthMiddleware(["admin"]),
  updateOrderStatus
);

// ✅ Dynamic route (must be last)
router.get("/:id", createAuthMiddleware(["customer", "admin"]), getOrderById);


module.exports = router;
