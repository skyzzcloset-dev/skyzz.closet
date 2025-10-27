// ✅ cartServices.js
import axios from "axios";

const API_URL = "https://skyzzcloset-production.up.railway.app/api/cart/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 🛒 Add item
const addCartItems = async (cartData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("items", cartData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 📥 Get items
const getCartItems = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("getItems", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✏ Update
const updateCart = async (id, cartData) => {
  const token = localStorage.getItem("token");
  const res = await api.patch(`items/${id}`, cartData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🗑 Delete
const deleteCart = async (productId) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`items/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


const cartService = { addCartItems, getCartItems, updateCart, deleteCart };
export default cartService;
