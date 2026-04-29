import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api.get("/me")
      .then((res) => setUser(res.data?.data || res.data))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  return children;
}