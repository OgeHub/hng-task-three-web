import api, { BACKEND_BASE_URL } from "./axios";

const pickUser = (res) => res?.data?.data || res?.data || null;
const VERSION_HEADER = { "x-api-version": "1" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCurrentUser = async () => {
  // OAuth callback redirect can race cookie persistence in some browsers.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await api.get("/me", {
        headers: VERSION_HEADER,
      });
      return pickUser(res);
    } catch {
      try {
        const res = await api.get("/users/me", {
          headers: VERSION_HEADER,
        });
        return pickUser(res);
      } catch {
        if (attempt === 1) throw new Error("Unable to fetch current user.");
        await sleep(300);
      }
    }
  }

  throw new Error("Unable to fetch current user.");
};

export const fetchAuthCsrfToken = async () => {
  const res = await api.get(`${BACKEND_BASE_URL}/auth/csrf-token`);
  return res.data?.csrfToken || null;
};

export const refreshSession = async () => {
  const res = await api.post(`${BACKEND_BASE_URL}/auth/refresh`, {});
  return res.data;
};

export const logoutSession = async () => {
  const res = await api.post(`${BACKEND_BASE_URL}/auth/logout`);
  return res.data;
};
