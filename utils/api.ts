import axios from "axios";

const API = axios.create({
  // নিশ্চিত হোন আপনার ব্যাকেন্ডে /api/v1 আছে কি না
  baseURL: "http://localhost:5000/api/v1", 
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // এখানে token এবং accessToken দুটোই চেক করা হচ্ছে
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;