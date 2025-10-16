const express = require("express");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
  countOrders
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/create", createAuthMiddleware(["customer"]), createOrder);
router.get("/me", createAuthMiddleware(["admin" , "customer"]), getMyOrders);
router.get("/:id", createAuthMiddleware(["customer"]), getOrderById);
router.get("/orderCount" , createAuthMiddleware(["customer"]) , countOrders )
router.post("/cancel/:id", createAuthMiddleware(["customer"]), cancelOrderById);
router.patch(
  "/address/:id",
  createAuthMiddleware(["customer"]),
  updateOrderAddress
);


module.exports = router;
