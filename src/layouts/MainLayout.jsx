// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}