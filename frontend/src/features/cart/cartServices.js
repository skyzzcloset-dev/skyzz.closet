import axios from "axios";

const API_URL = "https://cart-fm4h.onrender.com/api/cart/";

const getAuthHeader = (token) => ({ Authorization: `Bearer ${token}` });

const addCartItems = async (cartData, token) => {
  const res = await axios.post(API_URL + "items", cartData, {
    headers: getAuthHeader(token),
    withCredentials: true,
  });
  return res.data;
};

const getCartItems = async (token) => {
  const res = await axios.get(API_URL + "getItems", {
    headers: getAuthHeader(token),
    withCredentials: true,
  });
  return res.data;
};

const updateCart = async (id, cartData, token) => {
  const res = await axios.patch(API_URL + `items/${id}`, cartData, {
    headers: getAuthHeader(token),
    withCredentials: true,
  });
  return res.data;
};

const deleteCart = async (id, token) => {
  const res = await axios.delete(API_URL + `items/${id}` , {
    headers: getAuthHeader(token),
    withCredentials: true,
  });
  return res.data;
};

const cartService = { addCartItems, getCartItems, updateCart, deleteCart };
export default cartService;
