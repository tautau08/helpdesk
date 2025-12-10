"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService } from "@/lib/api/auth.service";
import { LoginResponse } from "@/types/user.types";
import { toast } from "sonner";

interface AuthContextType {
  user: LoginResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = authService.getStoredToken();

    if (storedUser && token) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);

      // Store token and user data
      localStorage.setItem("helpdesk_token", response.token);
      localStorage.setItem("helpdesk_user", JSON.stringify(response));
      if (typeof document !== "undefined") {
        document.cookie = `helpdesk_token=${response.token}; Path=/; Max-Age=3600; SameSite=Lax`;
      }

      setUser(response);
      toast.success("Login successful!");
    } catch (error: any) {
      // Don't show error here - it's already handled by API client interceptor
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    if (typeof document !== "undefined") {
      document.cookie = "helpdesk_token=; Path=/; Max-Age=0; SameSite=Lax";
    }
    setUser(null);
    toast.info("Logged out successfully");
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
