import axios from "axios";

const API_URL = "https://skyzz-closet.onrender.com/api/product/";

const addProduct = async (productData, token) => {
  const res = await axios.post(API_URL + "add", productData, {
    headers: {Authorization: `Bearer ${token}`},
    withCredentials: true,
  });
  return res.data;
};

const getProduct = () => {};

const getAllProduct = async (token) => {
  const res = await axios.get(API_URL + "getAll", {
    headers: {Authorization: `Bearer ${token}`},
    withCredentials: true,
  });
  return res.data;
};

const updateProduct = () => {};
const deleteProduct = () => {};

const productsService = {
  addProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};

export default productsService;
