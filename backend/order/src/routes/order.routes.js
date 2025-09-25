const express = require("express");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");
const {createOrder} = require("../controllers/order.controller")

const router = express.Router();


router.post("/", createAuthMiddleware(["admin"]) , createOrder)


module.exports = router