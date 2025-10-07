import axios from "axios";

const API_URL = "https://product-kquj.onrender.com/api/product/";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {Authorization: `Bearer ${token}`};
};

// Add product
const addProduct = async (formData) => {
  const res = await axios.post(API_URL + "add", formData, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

// Get all products
// features/products/productService.js
const getAllProduct = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_URL}getAll?${query}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

const getProduct = async (id) => {
  const res = await axios.get(API_URL + "get/" + id, {
    headers: getAuthHeader(),
  });
  return res.data;
};

const updateProduct = async (id, productData) => {
  const res = await axios.put(API_URL + "update/" + id, productData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

const deleteProduct = async (id) => {
  const res = await axios.delete(API_URL + "delete/" + id, {
    headers: getAuthHeader(),
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
