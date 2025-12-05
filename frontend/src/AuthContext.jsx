// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser } from "./api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "srs_token";
const USER_KEY = "srs_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || null
  );
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // On first load, if we have a token but no user, try to fetch /auth/me
  useEffect(() => {
    async function init() {
      if (!token) {
        setInitializing(false);
        return;
      }
      if (user) {
        setInitializing(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetchCurrentUser(token);
        setUser(res.user || null);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user || null));
      } catch (err) {
        console.error("Failed to validate stored token:", err);
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    }
    init();
  }, [token]);

  const setFromAuthResponse = (authResponse) => {
    const { token: newToken, user: newUser } = authResponse;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = {
    token,
    user,
    loading,
    initializing,
    setFromAuthResponse,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
