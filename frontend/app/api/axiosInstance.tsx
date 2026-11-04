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

  // Bearer token authentication ke liye
  withCredentials: false,
});

// Token save
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// User save
export const saveUser = (user: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Token get
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }

  return null;
};

// User get
export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  }

  return null;
};

// Token aur user remove
export const removeAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Har API request mein token attach
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

export default axiosInstance;