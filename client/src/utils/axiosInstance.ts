import axios from "axios";

const serverUrl = import.meta.env.VITE_GO_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
