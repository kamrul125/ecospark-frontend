import axios from "axios";

const API = axios.create({
  // আপনার ব্যাকএন্ড যদি অন্য পোর্টে চলে (যেমন ৩০০০ বা ৮০০০), তবে সেটি এখানে দিন
  baseURL: "http://localhost:5000/api/v1", 
});

API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;