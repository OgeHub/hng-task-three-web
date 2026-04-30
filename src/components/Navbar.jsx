import { Link } from "react-router-dom";
import { logoutSession } from "../api/auth";

export default function Navbar() {
  const handleLogout = async () => {
    try {
      await logoutSession();
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px" }}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profiles">Profiles</Link>
      <Link to="/search">Search</Link>
      <Link to="/account">Account</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}