import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";

export default function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    getCurrentUser()
      .then((me) => setUser(me))
      .catch(() => setUser(null));
  }, []);

  return user;
}