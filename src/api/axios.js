import axios from "axios";
import { getGuestSessionId } from "../utils/guestSession";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
  // تأكد أنك تُزيل Content-Type للـ FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    // للـ JSON requests
    config.headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers["X-Guest-Session-ID"] = getGuestSessionId();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;