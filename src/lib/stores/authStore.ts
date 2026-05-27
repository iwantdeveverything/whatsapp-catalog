import { create } from "zustand";
import { mockAuthService } from "@/lib/services/mock/mockAuthService";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const result = await mockAuthService.login(email, password);
    set({ token: result.token, isAuthenticated: true });
  },

  logout: () => {
    mockAuthService.logout();
    set({ token: null, isAuthenticated: false });
  },
}));
