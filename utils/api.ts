import axios from "axios";

// ✅ Base URL (production + local support)
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-eco-spark1.vercel.app/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor (Attach Token)
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (Better Error Handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Server responded with error
    if (error.response) {
      const { status, data } = error.response;

      console.error("❌ Server Error:", data?.message || data);

      // 🔐 Unauthorized
      if (status === 401) {
        console.warn("⚠️ Unauthorized! Clearing session...");

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          // optional redirect
          // window.location.href = "/login";
        }
      }
    }

    // 🔴 No response (Network / backend crash)
    else if (error.request) {
      console.error(
        "❌ Network Error: Backend not responding or crashed"
      );
    }

    // 🔴 Other error
    else {
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;