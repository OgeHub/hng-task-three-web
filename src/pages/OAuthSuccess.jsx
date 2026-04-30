import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { fetchCSRFToken } from "../utils/csrf";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await fetchCSRFToken();
        await getCurrentUser();
        navigate("/dashboard");
      } catch {
        navigate("/login");
      }
    };

    verifyLogin();
  }, [navigate]);

  return <p>Logging you in...</p>;
}