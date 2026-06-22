import axios from "axios";
const API = axios.create({
  // baseURL: "https://construction-erp-9izp.onrender.com",
    baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
// Add JWT Token
API.interceptors.request.use(
  (config) => {                               
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;