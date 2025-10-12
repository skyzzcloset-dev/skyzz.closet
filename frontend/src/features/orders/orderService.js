import axios from "axios";

const API_URL = "https://order-production-044d.up.railway.app/api/order/";

const getAuthHeader = (token) => ({Authorization: `Bearer ${token}`});

export const createOrder = async (data, token) =>
  (
    await axios.post(API_URL + "create", data, {
      headers: getAuthHeader(token),
      withCredentials: true,
    })
  ).data;

export const getOrders = async (params, token) =>
  (
    await axios.get(API_URL + "me", {
      headers: getAuthHeader(token),
      withCredentials: true,
      params,
    })
  ).data;

const orderService = {createOrder, getOrders};
export default orderService;
