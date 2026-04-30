import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const isAuthUrl = (url = "") => String(url).includes("/auth/");

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase() || "get";
  const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

  if (needsCsrf) {
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
export { API_BASE_URL, BACKEND_BASE_URL };
