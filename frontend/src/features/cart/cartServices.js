import axios from "axios";

const API_URL = "https://skyzzcloset-production.up.railway.app/api/cart/";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {Authorization: `Bearer ${token}`};
};

const addCartItems = async (cartData) => {
  const res = await axios.post(API_URL + "items", cartData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const getCartItems = async (cartData) => {
  const res = await axios.get(API_URL + "getItems", cartData ,  {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const updateCart = async (id, cartData) => {
  const res = await axios.patch(API_URL + `items/${id}`, cartData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const deleteCart = async (id, token) => {
  const res = await axios.delete(API_URL + `items/${id}` , {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const cartService = { addCartItems, getCartItems, updateCart, deleteCart };
export default cartService;
