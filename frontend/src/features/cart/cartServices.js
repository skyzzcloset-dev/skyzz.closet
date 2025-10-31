import axios from "axios";

const API_URL = "https://skyzzcloset-production.up.railway.app/api/cart/";

const api = axios.create({
  baseURL: API_URL,
});

const addCartItems = async (cartData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("items", cartData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getCartItems = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("getItems", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateCart = async (id, cartData) => {
  const token = localStorage.getItem("token");
  const res = await api.patch(`items/${id}`, cartData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(res.data);
  
  return res.data;
};

const deleteCart = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default { addCartItems, getCartItems, updateCart, deleteCart };
