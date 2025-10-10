const express = require("express");
const { createShippingOrder, trackShipment } = require("../controllers/delivery.controller");
const { createAuthMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create/:orderId", createAuthMiddleware(["customer"]), createShippingOrder);
router.get("/track/:shippingId", createAuthMiddleware(["customer"]), trackShipment);

module.exports = router;
