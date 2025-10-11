const express = require("express");
const {
  checkServiceability,
  createShippingOrder,
  trackShipment,
  generateAwbCode,
  generateManifest,
} = require("../controllers/delivery.controller");
const {createAuthMiddleware} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/check-serviceability",
  createAuthMiddleware(["customer"]),
  checkServiceability
);

// ---------------- Create Shipping Order ----------------
router.post(
  "/create/:orderId",
  createAuthMiddleware(["customer"]),
  createShippingOrder
);

// ---------------- Generate AWB ----------------
router.post(
  "/generate-awb/:shipment_id",
  createAuthMiddleware(["customer"]),
  generateAwbCode
);

// ---------------- Track Shipment ----------------
router.get(
  "/track/:awb_code",
  createAuthMiddleware(["customer"]),
  trackShipment
);

// ---------------- Generate Manifest (Optional) ----------------
router.post(
  "/generate-manifest",
  createAuthMiddleware(["customer"]),
  generateManifest
);

module.exports = router;
