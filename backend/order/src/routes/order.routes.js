const express = require("express");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress,
} = require("../controllers/order.controller");
const {
  cancelOrderValidations,
  createOrderValidations,
  getMyOrdersValidations,
  getOrderByIdValidations,
  updateOrderAddressValidations,
} = require("../middlewares/validate.middleware");
const router = express.Router();

router.post(
  "/",
  createOrderValidations,
  createAuthMiddleware(["customer"]),
  createOrder
);

router.get(
  "/me",
  getMyOrdersValidations,
  createAuthMiddleware(["customer"]),
  getMyOrders
);

router.post(
  "/cancel/:id",
  cancelOrderValidations,
  createAuthMiddleware(["customer"]),
  cancelOrderById
);

router.patch(
  "/address/:id",
  updateOrderAddressValidations,
  createAuthMiddleware(["customer"]),
  updateOrderAddress
);

router.get(
  "/:id",
  getOrderByIdValidations,
  createAuthMiddleware(["admin", "customer"]),
  getOrderById
);

module.exports = router;
