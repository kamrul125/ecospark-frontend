import axios from "axios";

const API = axios.create({
  // ✅ আপনার নতুন ভেরসেল ব্যাকএন্ড ইউআরএল আপডেট করা হয়েছে
  baseURL: "https://backend-eco-spark1.vercel.app/api/v1", 
  timeout: 20000, 
  withCredentials: true, // প্রোডাকশনে কুকি এবং অথরাইজেশনের জন্য জরুরি
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ✅ ১. রিকোয়েস্ট ইন্টারসেপ্টর: প্রতিবার রিকোয়েস্ট পাঠানোর আগে টোকেন চেক করবে
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ ২. রেসপন্স ইন্টারসেপ্টর: সার্ভার থেকে আসা এররগুলো হ্যান্ডেল করবে
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // সার্ভার থেকে আসা এরর মেসেজ
      console.error("Server Error Response:", error.response.data);
      
      if (error.response.status === 401) {
        console.warn("Unauthorized! Logging out...");
      }
    } else if (error.request) {
      // নেটওয়ার্ক বা কানেকশন এরর
      console.error("Network Error: Backend is not responding at https://backend-eco-spark1.vercel.app/");
    } else {
      console.error("Error Message:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;