
import axios from "axios";
import BASE_URL from "./BaseUrls";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Save Token
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Get Token
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }

  return null;
};

// Save User
export const saveUser = (user: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Get User
export const getUser = () => {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  return null;
};

// Remove Authentication
export const removeAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      removeAuth();

      if (window.location.pathname !== "/login") {
        window.location.replace("/auth/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
