import axios from "axios";

const serverUrl = process.env.GO_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
