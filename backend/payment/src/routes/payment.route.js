const express = require("express")
const {createAuthMiddleware} = require("../middlewares/auth.middleware")
const {createPayment , verifyPayment} = require("../controllers/payment.controller")

const router = express.Router()

router.post("/create/:orderId" , createAuthMiddleware(["customer"]) , createPayment)
router.post("/verify" , createAuthMiddleware(["customer"]) , verifyPayment)


module.exports = router