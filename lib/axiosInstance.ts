import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 30000, // Increased timeout to 30 seconds for AI processing
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
