import axios from "axios";

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-api-domain.com/api"
      : "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default apiClient;
