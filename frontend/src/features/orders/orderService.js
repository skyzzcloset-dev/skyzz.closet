// src/features/order/orderService.js
import axios from "axios";

const API_URL = "/api/order/";

// Helper to get auth headers
const getAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Create a new order
export const createOrder = async (data, token) => {
  const res = await axios.post(`${API_URL}create`, data, {
    headers: getAuthHeader(token),
   
  });
  return res.data;
};

// Get all orders for the logged-in user
export const getOrders = async (params, token) => {
  const res = await axios.get(`${API_URL}me`, {
    headers: getAuthHeader(token),
    withCredentials: true,
    params,
  });
  return res.data;
};

const orderService = { createOrder, getOrders };
export default orderService;
