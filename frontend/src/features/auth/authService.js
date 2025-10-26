import axios from "axios";

const API_URL = "https://auth-production-547e.up.railway.app/api/auth/"



// login user
const login = async (userData) => {
  const res = await axios.post(API_URL + "login", userData);

  if (res.data?.token) {
    // store token + user separately
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// register user
const register = async (userData) => {
  const res = await axios.post(API_URL + "register", userData);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// logout
const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
