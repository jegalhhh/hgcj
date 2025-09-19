import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000",
  withCredentials: true,
});

const token = localStorage.getItem("ACCESS_TOKEN");
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default api;
