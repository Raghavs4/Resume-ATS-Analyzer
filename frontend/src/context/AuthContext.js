import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// ─── Context ──────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage so user stays logged in on refresh
  const [token, setToken] = useState(() => localStorage.getItem("ats_token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // loading for auth actions

  // Keep axios Authorization header in sync whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("ats_token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("ats_token");
    }
  }, [token]);

  /**
   * Login — saves token, sets auth header
   * @param {string} newToken - JWT from backend
   */
  const login = (newToken) => {
    setToken(newToken);
  };

  /**
   * Logout — clears token and user state
   * Calls backend logout endpoint (backend is stateless, but good practice)
   */
  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (_) {
      // Ignore errors on logout — always clear locally
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  /** Whether the user is currently authenticated */
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, loading, setLoading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
