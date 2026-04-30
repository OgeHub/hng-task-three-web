import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { getProfiles } from "../api/profiles";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProfiles: 0,
    page: 1,
    totalPages: 1,
    username: "",
    role: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");
        const [meRes, profilesRes] = await Promise.all([
          getCurrentUser(),
          getProfiles({ page: 1, limit: 1 }),
        ]);
        const me = meRes || {};

        setStats({
          totalProfiles: profilesRes.total || 0,
          page: profilesRes.page || 1,
          totalPages: profilesRes.total_pages || 1,
          username: me.username || "Unknown user",
          role: me.role || "analyst",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p>Signed in as: {stats.username}</p>
      <p>Role: {stats.role}</p>
      <p>Total profiles: {stats.totalProfiles}</p>
      <p>
        Profiles pagination snapshot: page {stats.page} of {stats.totalPages}
      </p>
    </div>
  );
}