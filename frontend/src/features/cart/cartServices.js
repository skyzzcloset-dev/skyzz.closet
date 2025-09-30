// cartServices.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/cart/";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const addCartItems = async (cartData) => {
  const res = await axios.post(API_URL + "items", cartData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const cartService = { addCartItems };
export default cartService;
