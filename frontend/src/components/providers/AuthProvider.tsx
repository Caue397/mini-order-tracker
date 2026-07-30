"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await api.get<User>("/api/users/me");
      setUser(data);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial session check on mount
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await api.post<AuthResponse>("/api/auth/login", data);
      setToken(response.data.token);
      await fetchCurrentUser();
      router.push("/orders");
    },
    [fetchCurrentUser, router]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const response = await api.post<AuthResponse>("/api/auth/register", data);
      setToken(response.data.token);
      await fetchCurrentUser();
      router.push("/orders");
    },
    [fetchCurrentUser, router]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
