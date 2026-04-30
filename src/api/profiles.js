import api from "./axios";

const VERSION_HEADER = { "x-api-version": "1" };

export const getProfiles = async (params = {}) => {
  const res = await api.get("/profiles", {
    params,
    headers: VERSION_HEADER,
  });
  return res.data;
};

export const searchProfiles = async (params = {}) => {
  const res = await api.get("/profiles/search", {
    params,
    headers: VERSION_HEADER,
  });
  return res.data;
};

export const getProfileById = async (id) => {
  const res = await api.get(`/profiles/${id}`, {
    headers: VERSION_HEADER,
  });
  return res.data;
};

export const createProfile = async (payload) => {
  const res = await api.post("/profiles", payload, {
    headers: VERSION_HEADER,
  });
  return res.data;
};

export const exportProfilesCsv = async (params = {}) => {
  const res = await api.get("/profiles/export", {
    params,
    headers: VERSION_HEADER,
    responseType: "blob",
  });
  return res;
};

export const deleteProfile = async (id) => {
  const res = await api.delete(`/profiles/${id}`, {
    headers: VERSION_HEADER,
  });
  return res.data;
};
