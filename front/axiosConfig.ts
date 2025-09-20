import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000",
  withCredentials: true,
});

// 요청 인터셉터로 동적 토큰 관리
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  const isGuest = localStorage.getItem("GUEST_MODE") === "true";
  
  // 비회원이거나 토큰이 없으면 Authorization 헤더 제거
  if (isGuest || !token) {
    delete config.headers.Authorization;
  } else {
    // 토큰이 있으면 설정
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
