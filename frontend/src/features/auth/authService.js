import axios from "axios";

// Use correct Vite env variable and trim trailing slash
const API_URL = import.meta.env.VITE_AUTH_API?.replace(/\/$/, "");

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Login user
const login = async (userData) => {
  if (!API_URL) throw new Error("VITE_AUTH_API is not defined");

  const res = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true,
  });

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// Register user
const register = async (userData) => {
  if (!API_URL) throw new Error("VITE_AUTH_API is not defined");

  const res = await axios.post(`${API_URL}/register`, userData, {
    withCredentials: true,
  });

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get all users with optional filters
const getAllUsers = async (filters = {}) => {
  if (!API_URL) throw new Error("VITE_AUTH_API is not defined");

  const query = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_URL}/getAllUsers?${query}`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

export default { login, register, logout, getAllUsers };
