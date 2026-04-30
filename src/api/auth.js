import api, { BACKEND_BASE_URL } from "./axios";

const pickUser = (res) => res?.data?.data || res?.data || null;

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/me");
    return pickUser(res);
  } catch {
    const res = await api.get("/users/me");
    return pickUser(res);
  }
};

export const fetchAuthCsrfToken = async () => {
  const res = await api.get(`${BACKEND_BASE_URL}/auth/csrf-token`);
  return res.data?.csrfToken || null;
};

export const refreshSession = async () => {
  const res = await api.post(`${BACKEND_BASE_URL}/auth/refresh`);
  return res.data;
};

export const logoutSession = async () => {
  const res = await api.post(`${BACKEND_BASE_URL}/auth/logout`);
  return res.data;
};
