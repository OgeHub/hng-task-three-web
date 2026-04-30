import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    getCurrentUser()
      .then((me) => setUser(me))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  return children;
}