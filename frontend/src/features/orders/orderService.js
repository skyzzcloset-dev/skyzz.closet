import axios from "axios";

const API_URL = "http://localhost:3003/api/order/"

const getAuthHeader = (token) => ({ Authorization: `Bearer ${token}` });

const