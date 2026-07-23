import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get("access_token") || null,
      isAuthenticated: !!Cookies.get("access_token"),

      setAuth: (user, token) => {
        Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: "lax" });
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      setToken: (token) => {
        Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: "lax" });
        set({ token, isAuthenticated: true });
      },

      logout: () => {
        Cookies.remove("access_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
