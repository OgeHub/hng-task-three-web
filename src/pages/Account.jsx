import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Account() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data?.data || res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load account details.")
      );
  }, []);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!user) return <p>Loading account...</p>;

  return (
    <div>
      <h2>Account Page</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email || "N/A"}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.is_active ? "Active" : "Inactive"}</p>
      <p>Last login: {user.last_login_at || "N/A"}</p>
    </div>
  );
}