import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

// Use relative path in production, but allow override with env variable for development
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: false,
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("helpdesk_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response) {
      const { status, data } = error.response;
      const isLoginRequest = error.config?.url?.includes('/auth/login');

      // Handle authentication errors
      if (status === 401) {
        if (isLoginRequest) {
          toast.error("Invalid username or password");
        } else {
          if (typeof window !== "undefined") {
            localStorage.removeItem("helpdesk_token");
            localStorage.removeItem("helpdesk_user");
            window.location.href = "/login";
          }
          toast.error("Session expired. Please login again.");
        }
      }

      // Handle forbidden errors
      if (status === 403) {
        toast.error("You don't have permission to perform this action.");
      }

      // Handle not found errors
      if (status === 404) {
        const message = data?.message || data?.error || "Resource not found";
        toast.error(message);
      }

      // Handle validation/bad request errors
      if (status === 400) {
        const message = data?.message || data?.error || "Invalid request";
        toast.error(message);
      }

      // Handle server errors
      if (status >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection and ensure the backend is running on http://localhost:8080");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
