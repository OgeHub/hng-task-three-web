import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api.get("/me")
      .then((res) => setUser(res.data?.data || res.data))
      .catch(() => setUser(null));
  }, []);

  return user;
}