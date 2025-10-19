const express = require("express");
const router = express.Router();
const {
  checkServiceability,
  createShippingOrder,
  generateAwbCode,
  trackShipment,
  generateManifest,
} = require("../controllers/delivery.controller");

router.get("/pincode/:pincode", checkServiceability);
router.post("/create/:orderId", createShippingOrder);
router.post("/awb/:shipment_id", generateAwbCode);
router.get("/track/:awb_code", trackShipment);
router.post("/manifest", generateManifest);

module.exports = router;
