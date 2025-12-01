import { useState, useEffect, useCallback, useMemo } from "react";
import { jwtDecode } from "jwt-decode";

export function useSession() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback((newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  const isAuthenticated = !!token;

  const user = useMemo(() => {
    //  Dekodiranje tokena da ne bismo morali da imamo authUtils klasu
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  }, [token]);

  return {
    token,
    user, // Dodali smo ovde da ne bismo morali da imamo authUtils
    isAuthenticated,
    login,
    logout,
  };
}
