import axios from "axios";

const API_URL =import.meta.env.VITE_DELIVER_API;

const getAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

// ✅ Create Shipping Order
const createShippingOrder = async (id, deliveryData, token) => {
  const res = await axios.post(API_URL + "create/" + id, deliveryData, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ✅ Check Serviceability
const checkServiceability = async (pincode, token) => {
  const res = await axios.get(API_URL + "pincode/" + pincode, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

const deliveryService = {
  createShippingOrder,
  checkServiceability,
};

export default deliveryService;
