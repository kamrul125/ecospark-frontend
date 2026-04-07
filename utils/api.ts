import axios from "axios";

const API = axios.create({
  // আপনার ভেরসেল ব্যাকএন্ড ইউআরএল এখানে আপডেট করা হয়েছে
  baseURL: "https://backend-eco-sp.vercel.app/api/v1", 
  timeout: 15000, // কানেকশন স্লো হলে ১৫ সেকেন্ড পর্যন্ত অপেক্ষা করবে
  headers: {
    "Content-Type": "application/json",
  },
});

// রিকোয়েস্ট পাঠানোর আগে টোকেন চেক করার ইন্টারসেপ্টর
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // লোকাল স্টোরেজ থেকে টোকেন নেওয়া হচ্ছে
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

// রেসপন্স এরর হ্যান্ডেল করার জন্য আরেকটি ইন্টারসেপ্টর (ঐচ্ছিক কিন্তু দরকারি)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // টোকেন ইনভ্যালিড হলে ইউজারকে লগআউট করানো বা মেসেজ দেওয়ার লজিক এখানে রাখতে পারেন
      console.error("Unauthorized! Logging out...");
    }
    return Promise.reject(error);
  }
);

export default API;