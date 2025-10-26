import axios from "axios";

const API_URL = "https://skyzzcloset-production.up.railway.app/api/cart/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies and accept set-cookie from server
});

const addCartItems = async (cartData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("items", cartData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getCartItems = async (cartData) => {
  const res = await api.get("getItems", cartData);
  return res.data;
};

const updateCart = async (id, cartData, token) => {
  const res = await api.patch(`items/${id}`, cartData);
  return res.data;
};

const deleteCart = async (id, token) => {
  const res = await api.delete(`items/${id}`);
  return res.data;
};

const cartService = {addCartItems, getCartItems, updateCart, deleteCart};
export default cartService;
