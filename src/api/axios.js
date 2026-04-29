import axios from "axios";
import { getCSRFToken } from "../utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://hng-task-three-production.up.railway.app/api";
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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

export default api;
export { API_BASE_URL, BACKEND_BASE_URL };