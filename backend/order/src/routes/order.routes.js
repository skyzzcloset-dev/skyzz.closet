const express = require("express");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {createOrder , getMyOrders , getOrderById , cancelOrderById , updateOrderAddress} = require("../controllers/order.controller")
const {cancelOrderValidations , createOrderValidations , getMyOrdersValidations , getOrderByIdValidations , updateOrderAddressValidations} = require("../middlewares/validate.middleware")
const router = express.Router();


router.post("/", createOrderValidations ,createAuthMiddleware(["admin" , "customer"]) , createOrder)

router.get("/me" , getMyOrdersValidations ,createAuthMiddleware(["admin" , "customer"]) , getMyOrders)

router.post("/cancel/:id" , cancelOrderValidations , createAuthMiddleware(["admin" , "customer"]) , cancelOrderById)

router.patch("/address/:id" , updateOrderAddressValidations , createAuthMiddleware(["admin" , "customer"]) , updateOrderAddress)

router.get("/:id" , getOrderByIdValidations , createAuthMiddleware(["admin" , "customer"]) , getOrderById)


module.exports = router