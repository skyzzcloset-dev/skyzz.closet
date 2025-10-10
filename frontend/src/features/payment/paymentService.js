// src/features/payment/paymentService.js
import axios from "axios";

const API_URL = "http://localhost:3004/api/payment/";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const createPayment = async (paymentData, id) => {
  const res = await axios.post(API_URL + "create/" + id, paymentData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const verifyPayment = async (paymentData) => {
  const res = await axios.post(API_URL + "verify", paymentData, {
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
