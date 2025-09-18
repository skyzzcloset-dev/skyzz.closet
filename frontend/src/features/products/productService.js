import axios from "axios";

const API_URL = "https://skyzz-closet.onrender.com/api/product/";

// Add product
const addProduct = async (productData, token) => {
  const res = await axios.post(API_URL + "add", productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get all products
const getAllProduct = async (token) => {
  const res = await axios.get(API_URL + "getAll", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getProduct = async (id, token) => {
  const res = await axios.get(API_URL + "get/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateProduct = async (id, productData, token) => {
  const res = await axios.put(API_URL + "update/" + id, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteProduct = async (id, token) => {
  const res = await axios.delete(API_URL + "delete/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const productService = {
  addProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
