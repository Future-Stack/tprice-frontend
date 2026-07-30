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
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken?: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
}

const getCookieToken = () =>
  Cookies.get("accessToken") ||
  Cookies.get("token") ||
  null;

const getCookieRefreshToken = () =>
  Cookies.get("refreshToken") || null;

export const clearAuthCookies = () => {
  Cookies.remove("accessToken");
  Cookies.remove("token");
  Cookies.remove("refreshToken");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: getCookieToken(),
      refreshToken: getCookieRefreshToken(),
      isAuthenticated: !!getCookieToken(),

      setAuth: (user, token, refreshToken) => {
        set((state) => ({
          user,
          token: token || state.token || getCookieToken(),
          refreshToken:
            refreshToken || state.refreshToken || getCookieRefreshToken(),
          isAuthenticated: !!user,
        }));
      },

      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
        })),

      setToken: (token, refreshToken) => {
        set((state) => ({
          token: token || state.token || getCookieToken(),
          refreshToken:
            refreshToken || state.refreshToken || getCookieRefreshToken(),
          isAuthenticated: !!state.user || !!token,
        }));
      },

      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },

      logout: () => {
        clearAuthCookies();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
