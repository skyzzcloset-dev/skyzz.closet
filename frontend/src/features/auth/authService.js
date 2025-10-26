import axios from "axios";

const API_URL =  "https://auth-production-547e.up.railway.app/api/auth";

// Create axios instance to set defaults once
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies and accept set-cookie from server
});

const login = async (userData) => {
  const res = await api.post("/login", userData);
  return res.data;
};

const register = async (userData) => {
  const res = await api.post("/register", userData);
  return res.data;
};

const logout = async () => {
  const res = await api.post("/logout", {});
  return res.data;
};

const getAllUsers = async (filters = {}) => {
  const res = await api.get(`/getAllUsers`, { params: filters });
  return res.data;
};

const authService = { login, register, logout, getAllUsers };
export default authService;
