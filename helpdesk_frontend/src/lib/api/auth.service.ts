import apiClient from "./client";
import { LoginResponse } from "@/types/user.types";

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("helpdesk_token");
      localStorage.removeItem("helpdesk_user");
    }
  },

  getStoredToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("helpdesk_token");
    }
    return null;
  },

  getStoredUser: (): LoginResponse | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("helpdesk_user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};
