// src/pages/Login.jsx
import { BACKEND_BASE_URL } from "../api/axios";

export default function Login() {
  const loginWithGitHub = () => {
    window.location.href = `${BACKEND_BASE_URL}/auth/github`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>
      <button onClick={loginWithGitHub}>Continue with GitHub</button>
    </div>
  );
}
