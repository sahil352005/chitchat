import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL || "http://localhost:5000/api/v1";

export const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 5000
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and token management
axiosInstance.interceptors.response.use(
  (response) => {
    // If login/register response contains token, save it
    if (response.data?.token) {
      sessionStorage.setItem("token", response.data.token);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Clear token on authentication error
      sessionStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);