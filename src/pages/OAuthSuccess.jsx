import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { fetchCSRFToken } from "../utils/csrf";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await getCurrentUser();
        // CSRF bootstrap should not block successful login navigation.
        void fetchCSRFToken().catch(() => {});
        navigate("/dashboard");
      } catch {
        navigate("/login");
      }
    };

    verifyLogin();
  }, [navigate]);

  return <p>Logging you in...</p>;
}