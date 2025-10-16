const express = require("express");
const { createAuthMiddleware } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
  countOrders,
  getAllOrders
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/create", createAuthMiddleware(["customer"]), createOrder);
router.get("/me", createAuthMiddleware(["customer"]), getMyOrders);
router.get("/getAllOrders", createAuthMiddleware(["admin"]), getAllOrders); // ✅ Move above :id
router.get("/orderCount", createAuthMiddleware(["customer"]), countOrders);
router.get("/:id", createAuthMiddleware(["customer"]), getOrderById);
router.post("/cancel/:id", createAuthMiddleware(["customer"]), cancelOrderById);
router.patch("/address/:id", createAuthMiddleware(["customer"]), updateOrderAddress);

module.exports = router;
