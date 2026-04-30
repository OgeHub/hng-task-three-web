import { fetchAuthCsrfToken } from "../api/auth";

let csrfToken = null;
let csrfPromise = null;
const CSRF_COOKIE_NAME = "hng_internship_csrf_token";

export const fetchCSRFToken = async () => {
  if (csrfToken) return csrfToken;
  if (csrfPromise) return csrfPromise;

  csrfPromise = fetchAuthCsrfToken()
    .then((token) => {
      csrfToken = token;
      return token;
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
};

const getCookieValue = (name) => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const match = cookies.find((item) => item.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
};

export const getCSRFToken = () => getCookieValue(CSRF_COOKIE_NAME) || csrfToken;