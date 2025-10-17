// src/features/cart/cartService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_CART_API;

// Helper to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Add cart items
const addCartItems = async (cartData) => {
  const res = await axios.post(`${API_URL}items`, cartData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

// Get cart items
const getCartItems = async () => {
  const res = await axios.get(`${API_URL}getItems`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

// Update cart item
const updateCart = async (id, cartData) => {
  const res = await axios.patch(`${API_URL}items/${id}`, cartData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

// Delete cart item
const deleteCart = async (id) => {
  const res = await axios.delete(`${API_URL}items/${id}`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const cartService = { addCartItems, getCartItems, updateCart, deleteCart };
export default cartService;
