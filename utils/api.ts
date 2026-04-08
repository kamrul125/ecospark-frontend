import axios from "axios";

const API = axios.create({
  // ✅ আপনার ভেরসেল ব্যাকএন্ড ইউআরএল (নিশ্চিত হোন শুরুতে https আছে)
  baseURL: "https://backend-eco-sp.vercel.app/api/v1", 
  timeout: 20000, // কানেকশন স্লো হলে ২০ সেকেন্ড পর্যন্ত অপেক্ষা করবে
  withCredentials: true, // ✅ প্রোডাকশনে কুকি এবং অথরাইজেশনের জন্য এটি ১০০% জরুরি
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ✅ ১. রিকোয়েস্ট ইন্টারসেপ্টর: প্রতিবার রিকোয়েস্ট পাঠানোর আগে টোকেন চেক করবে
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // লোকাল স্টোরেজ থেকে টোকেন চেক করা হচ্ছে
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

// ✅ ২. রেসপন্স ইন্টারসেপ্টর: সার্ভার থেকে আসা এররগুলো সুন্দর করে হ্যান্ডেল করবে
API.interceptors.response.use(
  (response) => {
    // যদি রেসপন্স সাকসেসফুল হয় (Status 2xx)
    return response;
  },
  (error) => {
    if (error.response) {
      // সার্ভার থেকে রেসপন্স এসেছে কিন্তু সেটা এরর (যেমন: 400, 401, 403, 500)
      console.error("Server Error Response:", error.response.data);
      
      if (error.response.status === 401) {
        // টোকেন এক্সপায়ার হলে ইউজারকে লগআউট করানোর লজিক এখানে রাখতে পারেন
        console.warn("Unauthorized access - logic for logout can go here.");
      }
    } else if (error.request) {
      // রিকোয়েস্ট পাঠানো হয়েছে কিন্তু সার্ভার থেকে কোনো উত্তর আসেনি (Network Error)
      console.error("Network Error: Backend is not responding. Check CORS or Server Status.");
    } else {
      // অন্য কোনো অজানা এরর
      console.error("Error Message:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;