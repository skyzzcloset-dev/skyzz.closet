// src/features/auth/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

// login user
const login = async (userData) => {
  const res = await axios.post(API_URL + "login", userData, {
    withCredentials: true,
  });

  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }

  return res.data;
};

// register user
const register = async (userData) => {
  const res = await axios.post(API_URL + "register", userData, {
    withCredentials: true,
  });

  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }

  return res.data;
};

// logout
const logout = async () => {
  await axios.post(API_URL + "logout", {}, {withCredentials: true});
  localStorage.removeItem("user");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
