import axios from "axios";
import BASE_URL from "./BaseUrls";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    
  },
});

export default axiosInstance;