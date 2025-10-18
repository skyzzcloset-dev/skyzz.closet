const express = require("express");
const { createAuthMiddleware } = require("../middlewares/auth.middleware");
const { createPayment, verifyPayment } = require("../controllers/payment.controller");

const router = express.Router();

// Only logged-in customers can create/verify payment
router.post("/create/:orderId", createAuthMiddleware(["customer" , "admin"]), createPayment);
router.post("/verify", createAuthMiddleware(["customer" , "admin"]), verifyPayment);

module.exports = router;
