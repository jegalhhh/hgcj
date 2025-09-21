import axios from "axios";
import { startGlobalLoading, stopGlobalLoading } from "./src/hooks/loadingBus";

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

let _adminSecret: string | null = null;
export const setAdminSecret = (v: string | null) => {
  _adminSecret = v;
};

api.interceptors.request.use((cfg) => {
  const url = cfg.url ?? "";
  if (_adminSecret && (url.startsWith("/admin") || url.includes("/admin/"))) {
    cfg.headers = cfg.headers ?? {};
    (cfg.headers as any)["x-admin-secret"] = _adminSecret;
  }
  return cfg;
});

function isSkipLoading(h?: any) {
  if (!h) return false;
  const v =
    typeof h.get === "function" ? h.get("x-skip-loading") : h["x-skip-loading"];
  return v === "1" || v === "true" || v === true;
}

api.interceptors.request.use((cfg) => {
  if (!isSkipLoading(cfg.headers)) startGlobalLoading();
  return cfg;
});

api.interceptors.response.use(
  (res) => {
    if (!isSkipLoading(res.config?.headers)) stopGlobalLoading();
    return res;
  },
  (err) => {
    if (!isSkipLoading(err.config?.headers)) stopGlobalLoading();
    return Promise.reject(err);
  }
);

export default api;
