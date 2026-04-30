import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

const normalizeUrl = (value) => (typeof value === "string" ? value : "").replace(/\/+$/, "");
const stripTrailingApi = (value = "") => normalizeUrl(value).replace(/\/api$/, "");

const API_BASE_URL = normalizeUrl(import.meta.env.VITE_API_BASE_URL);
const AUTH_BASE_URL = normalizeUrl(import.meta.env.VITE_AUTH_BASE_URL) || stripTrailingApi(API_BASE_URL);
const BACKEND_BASE_URL = AUTH_BASE_URL;
const API_VERSION = "1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const isAuthUrl = (url = "") => String(url).includes("/auth/");
const isAbsoluteUrl = (url = "") => /^https?:\/\//i.test(String(url));
const isProtectedApiUrl = (url = "") => {
  const value = String(url);
  if (!value) return true;
  if (isAuthUrl(value)) return false;
  if (value.startsWith("/api/")) return true;
  if (!isAbsoluteUrl(value)) return true;
  return value.startsWith(`${API_BASE_URL}/`);
};

api.interceptors.request.use((config) => {
  if (isProtectedApiUrl(config.url)) {
    config.headers["x-api-version"] = API_VERSION;
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthUrl(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        await api.post(`${BACKEND_BASE_URL}/auth/refresh`);
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { API_BASE_URL, AUTH_BASE_URL, BACKEND_BASE_URL };
