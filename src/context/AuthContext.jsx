import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { mergeGuestCart } from "../api/cart";
import { clearGuestSessionId } from "../utils/guestSession";
import { useCart } from "./CartContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const { refreshCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    authApi
      .fetchMe()
      .then((u) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user: u, token } = await authApi.login(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);

      await mergeGuestCart().catch(() => { });
      clearGuestSessionId();
      await refreshCart();

      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { user: u, token } = await authApi.register(payload);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);

      await mergeGuestCart().catch(() => { });
      clearGuestSessionId();
      await refreshCart();

      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      await refreshCart();
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}