import axios from "axios";

const API_URL = "http://localhost:3001/api/cart/";

const getAuthHeader = (token) => ({ Authorization: `Bearer ${token}` });

const addCartItems = async (cartData, token) => {
  const res = await axios.post(API_URL + "items", cartData, {
    headers: getAuthHeader(token),
    withCredentials: true,
  });
  return res.data; // MUST return
};

const getCartItems = async (token) => {
  const res = await axios.get(API_URL + "getItems", {
    headers: getAuthHeader(token),
    withCredentials: true,
  });
  return res.data; // MUST return
};

export default { addCartItems, getCartItems };
