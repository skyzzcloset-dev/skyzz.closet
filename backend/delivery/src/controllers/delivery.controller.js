const express = require("express");
const axios = require("axios");
const deliveryModel = require("../models/delivery.model");

// ---------------- ShipRocket Token ----------------
let SHIPROCKET_TOKEN = null;

async function getToken(force = false) {
  if (SHIPROCKET_TOKEN && !force) return SHIPROCKET_TOKEN;

  try {
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );
    SHIPROCKET_TOKEN = data.token;
    console.log("✅ ShipRocket login successful");
    return SHIPROCKET_TOKEN;
  } catch (error) {
    console.error("❌ ShipRocket login failed:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with ShipRocket");
  }
}

// ---------------- Check Serviceability ----------------
async function checkServiceability(req, res) {
  try {
    const { pincode } = req.body;
    if (!pincode) return res.status(400).json({ message: "Pincode is required" });

    const token = await getToken();
    const { data } = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      { params: { pincode }, headers: { Authorization: `Bearer ${token}` } }
    );

    res.status(200).json({ message: "Serviceability checked", data });
  } catch (error) {
    console.error("❌ Error checking serviceability:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to check serviceability",
    });
  }
}

// ---------------- Create Shipping Order WITHOUT AWB ----------------
async function createShippingOrder(req, res) {
  try {
    const { shippingAddress, items } = req.body;
    const orderId = req.params.orderId;

    if (!orderId) return res.status(400).json({ message: "Order ID required" });
    if (!shippingAddress || !items?.length)
      return res.status(400).json({ message: "Shipping address and items are required" });

    const { firstName, lastName, phone, street, apartment, city, state, zip, country } = shippingAddress;
    if (!firstName || !lastName || !phone || !street || !city || !state || !zip || !country)
      return res.status(400).json({ message: "All shipping address fields are required" });

    const token = await getToken();

    // Fetch product info
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const { data } = await axios.get(`http://localhost:8000/api/product/get/${item.productId}`);
        if (!data.product) throw new Error(`Product not found: ${item.productId}`);
        return {
          name: data.product.name,
          sku: data.product.sku || data.product._id,
          units: item.quantity,
          selling_price: item.price.amount,
          discount: 0,
          tax: 0,
        };
      })
    );

    // Create order in ShipRocket
    const payload = {
      order_id: orderId,
      channel_id: 8370840, // Replace with your actual channel ID
      order_date: new Date().toISOString(),
      pickup_location: "sanju" || "Default",
      comment: "Reseller: Skyzz Closet",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: street,
      billing_address_2: apartment || "",
      billing_city: city,
      billing_pincode: zip,
      billing_state: state,
      billing_country: country,
      billing_phone: phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: items.reduce((acc, item) => acc + item.price.amount * item.quantity, 0),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    const { data: shipData } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(shipData);
    
    
    

    // Save order in DB WITHOUT AWB
    const orderInDB = await deliveryModel.create({
      order: orderId,
      shippingAddress,
      items,
      trackingId: shipData.shipment_id,
      awbCode: null, // AWB can be generated later
      deliveryStatus: "New",
    });

    res.status(200).json({
      message: "Shipping order created. AWB can be generated later.",
      data: orderInDB,
    });
  } catch (error) {
    console.error("❌ Error creating shipping order:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create shipping order" });
  }
}

// ---------------- Generate AWB Separately ----------------
async function generateAwbCode(req, res) {
  try {
    const { shipment_id } = req.params;
    if (!shipment_id) return res.status(400).json({ message: "Shipment ID required" });

    const order = await deliveryModel.findOne({ trackingId: shipment_id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.deliveryStatus === "Cancelled") return res.status(400).json({ message: "Cannot generate AWB for cancelled order" });
    if (order.awbCode) return res.status(400).json({ message: "AWB already generated" });

    const token = await getToken();
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
      { shipment_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    order.awbCode = data.awb_code;
    await order.save();

    res.status(200).json({ message: "AWB code generated", data });
  } catch (error) {
    console.error("❌ Error generating AWB code:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate AWB code" });
  }
}

// ---------------- Track Shipment ----------------
async function trackShipment(req, res) {
  try {
    const { awb_code } = req.params;
    if (!awb_code) return res.status(400).json({ message: "AWB code required" });

    const token = await getToken();
    const { data } = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb_code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.status(200).json({ tracking: data });
  } catch (error) {
    console.error("❌ Error tracking shipment:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to track shipment" });
  }
}

// ---------------- Generate Manifest ----------------
async function generateManifest(req, res) {
  try {
    const { shipment_id } = req.body;
    if (!shipment_id) return res.status(400).json({ message: "Shipment ID required" });

    const token = await getToken();
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/generate/manifest",
      { shipment_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.status(200).json({ message: "Manifest generated", data });
  } catch (error) {
    console.error("❌ Error generating manifest:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate manifest" });
  }
}

module.exports = {
  checkServiceability,
  createShippingOrder,
  generateAwbCode,
  trackShipment,
  generateManifest,
};
