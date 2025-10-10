const axios = require("axios");
const deliveryModel = require("../models/delivery.model");

let SHIPROCKET_TOKEN = null;

// ---------------- ShipRocket Auth ----------------
async function shipRocketLogin() {
  if (SHIPROCKET_TOKEN) return SHIPROCKET_TOKEN;

  try {
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );
    SHIPROCKET_TOKEN = data.token;
    console.log("ShipRocket login successful");
    return SHIPROCKET_TOKEN;
  } catch (error) {
    console.error("ShipRocket login failed:", error.message);
    throw new Error("Failed to login to ShipRocket");
  }
}

// ---------------- Generate AWB Code ----------------
async function generateAwbCode(shipmentId) {
  try {
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
      { shipment_id: shipmentId },
      { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    );
    console.log("AWB code generated:", data);
    return data;
  } catch (error) {
    console.error("Error generating AWB code:", error.message);
    throw new Error("Failed to generate AWB code");
  }
}

// ---------------- Generate Manifest ----------------
async function generateManifest(shipmentId) {
  try {
    const { data } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/manifests/generate",
      { shipment_id: shipmentId },
      { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    );
    console.log("Manifest generated:", data);
    return data;
  } catch (error) {
    console.error("Error generating manifest:", error.response?.data || error.message);
    return null; // don't throw, so it won't break order creation
  }
}


// ---------------- Create Shipping Order ----------------
async function createShippingOrder(req, res) {
  try {
    const { shippingAddress, items } = req.body;
    const orderId = req.params.orderId;

    if (!orderId)
      return res.status(400).json({ message: "Order ID required" });
    if (!shippingAddress || !items?.length)
      return res
        .status(400)
        .json({ message: "Shipping address and items are required" });

    const { firstName, lastName, phone, street, apartment, city, state, zip, country } =
      shippingAddress;

    if (!firstName || !lastName || !phone || !street || !city || !state || !zip || !country) {
      return res.status(400).json({ message: "All shipping address fields are required" });
    }

    await shipRocketLogin();

    // Transform items into ShipRocket expected format
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const productResponse = await axios.get(`http://localhost:8000/api/product/get/${item.productId}`);
        const product = productResponse.data.product;

        return {
          name: product.name,
          sku: product.sku || product._id, // use SKU if exists, fallback to _id
          units: item.quantity,
          selling_price: item.price.amount,
          discount: 0,
          tax: 0,
        };
      })
    );

    const payload = {
      order_id: orderId,
      order_date: new Date().toISOString(),
      pickup_location: process.env.PICKUP_LOCATION || "sanju",
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
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: items.reduce((acc, item) => acc + item.price.amount * item.quantity, 0),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };



    
    const { data: result } = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    );

    await deliveryModel.create({
      order: orderId,
      shippingAddress,
      items,
      trackingId: result.shipment_id,
      awbCode: result.awb_code,
    });

    res.status(200).json({ message: "Shipping order created", data: result });

    // Optional: Generate manifest automatically
    await generateManifest(result.shipment_id);
    
  } catch (error) {
    if (error.response) {
      console.error(
        "ShipRocket API error:",
        error.response.status,
        error.response.data
      );
      return res.status(error.response.status).json({ error: error.response.data });
    }
    console.error("Error creating shipping order:", error.stack);
    res.status(500).json({ error: "Failed to create shipping order" });
  }
}

// ---------------- Track Shipment ----------------
async function trackShipment(req, res) {
  try {
    const { awb_code } = req.params;
    if (!awb_code) return res.status(400).json({ message: "AWB code required" });

    await shipRocketLogin();

    const { data } = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb_code}`,
      { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    );

    res.status(200).json({ tracking: data });
    console.log("Shipment tracked:", data);
  } catch (error) {
    console.error("Error tracking shipment:", error.stack);
    res.status(500).json({ error: error.message });
  }
}

// ---------------- Check Serviceability ----------------
async function checkServiceability(req, res) {
  try {
    const { pincode } = req.body;
    if (!pincode) return res.status(400).json({ message: "Pincode is required" });

    await shipRocketLogin();

    const { data } = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      {
        params: { pincode },
        headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` },
      }
    );

    res.status(200).json({ message: "Serviceability checked", data });
  } catch (error) {
    if (error.response) {
      console.error(
        "ShipRocket API error:",
        error.response.status,
        error.response.data
      );
      return res.status(error.response.status).json({ error: error.response.data });
    }
    console.error("Error checking serviceability:", error.stack);
    res.status(500).json({ error: "Failed to check serviceability" });
  }
}

module.exports = {
  createShippingOrder,
  trackShipment,
  checkServiceability,
  shipRocketLogin,
  generateAwbCode,
  generateManifest,
};
