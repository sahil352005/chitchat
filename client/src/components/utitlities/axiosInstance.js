import axios from "axios";

const DB_URL = import.meta.env.VITE_DB_URL;

export const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Add request interceptor to handle token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (token) {
      config.headers.Authorization = `Bearer ${token.split("=")[1]}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);