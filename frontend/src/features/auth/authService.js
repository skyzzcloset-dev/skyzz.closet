// src/features/auth/authService.js
import axios from "axios";


const API_URL = "https://auth-production-547e.up.railway.app/api/auth";

if (!API_URL) console.error("VITE_AUTH_API is not defined. Check your .env file.");

// Helper to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Login user
const login = async (userData) => {
  if (!API_URL) throw new Error("VITE_AUTH_API is not defined");
  const res = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// Register user
const register = async (userData) => {
  if (!API_URL) throw new Error("VITE_AUTH_API is not defined");
  const res = await axios.post(`${API_URL}/register`, userData, { withCredentials: true });

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

// Get all users (optional filters)
const getAllUsers = async (filters = {}) => {
  if (!API_URL) throw new Error("VITE_AUTH_API is not defined");
  const query = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_URL}/getAllUsers?${query}`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return res.data;
};

const authService = { login, register, logout, getAllUsers };
export default authService;
