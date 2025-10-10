const axios = require("axios");
const deliveryModel = require("../models/delivery.model");

let SHIPROCKET_TOKEN = null;

// Login to ShipRocket
async function shipRocketLogin() {
  const { data } = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );
  SHIPROCKET_TOKEN = data.token;
  console.log("ShipRocket login successful");

  console.log("Using Shiprocket Token:", SHIPROCKET_TOKEN);
}

console.log("Using Shiprocket Token:", SHIPROCKET_TOKEN);

// Create Shipping Order
async function createShippingOrder(req, res) {
  try {
    const { shippingAddress, items } = req.body;
    const user = req.user;
    if (!shippingAddress || !items || !items.length) {
      return res.status(400).json({ message: "Shipping address and items are required" });
    }

    const { firstName, lastName, phone, street, apartment, city, state, zip, country } = shippingAddress;
    if (!firstName || !lastName || !phone || !street || !city || !state || !zip || !country) {
      return res.status(400).json({ message: "All shipping address fields are required" });
    }

    await shipRocketLogin(); // ✅ always refresh token before order

    const payload = {
      order_id: user._id,
      order_date: new Date(),
      pickup_location: "sanju", //process.env.PICKUP_LOCATION,

      comment: "Order shipped via ShipRocket",

      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: street,
      billing_address_2: apartment,
      billing_city: city,
      billing_pincode: zip,
      billing_state: state,
      billing_country: country,
      billing_phone: phone,

      shipping_is_billing: true,

      order_items: items.map((item) => ({
        name: item.name || item.productId,
        sku: item.sku || item.productId,
        units: item.quantity,
        selling_price: item.price.amount,
      })),

      payment_method: "Prepaid",
      sub_total: items.reduce(
        (acc, item) => acc + item.price.amount * item.quantity,
        0
      ),

      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    const result = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    );

    const delivery = await deliveryModel.create({
      user: user._id,
      order: req.params.orderId,
      shippingAddress,
      items,
      trackingId: result.data.shipment_id,
      awbCode: result.data.awb_code,
    });

    res.status(200).json({ message: "Shipping order created", data: result.data });
  } catch (error) {
    if (error.response) {
      console.error("ShipRocket API error:", error.response.status, error.response.data);
      return res.status(error.response.status).json({ error: error.response.data });
    }
    console.error("Error creating shipping order:", error.message);
    res.status(500).json({ error: "Failed to create shipping order" });
  }
}

// Track Shipment
async function trackShipment(req, res) {
  try {
    const { shippingId } = req.params;
    if (!shippingId) return res.status(400).json({ message: "Shipment ID required" });

    await shipRocketLogin();

    const { data } = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shippingId}`,
      { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    );

    res.status(200).json({ tracking: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createShippingOrder, trackShipment };
