// src/features/payment/paymentService.js
import axios from "axios";

const API_URL = "https://payment-production-42a1.up.railway.app/api/payment/";

// Helper to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Create a payment
const createPayment = async (paymentData, id) => {
  const res = await axios.post(`${API_URL}create/${id}`, paymentData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

// Verify a payment
const verifyPayment = async (paymentData) => {
  const res = await axios.post(`${API_URL}verify`, paymentData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const paymentService = {
  createPayment,
  verifyPayment,
};

export default paymentService;
