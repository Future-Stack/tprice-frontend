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
  Cookies.get("access_token") ||
  null;

const getCookieRefreshToken = () =>
  Cookies.get("refreshToken") ||
  Cookies.get("refresh_token") ||
  null;

const setTokenCookies = (token?: string) => {
  if (token && token.trim() !== "") {
    Cookies.set("accessToken", token, {
      expires: 7,
      sameSite: "lax",
      path: "/",
    });
  }
};

const setRefreshTokenCookies = (refreshToken?: string) => {
  if (refreshToken && refreshToken.trim() !== "") {
    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      sameSite: "lax",
      path: "/",
    });
  }
};

export const clearAuthCookies = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("token", { path: "/" });
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  Cookies.remove("refresh_token", { path: "/" });
  Cookies.remove("accessToken");
  Cookies.remove("token");
  Cookies.remove("access_token");
  Cookies.remove("refreshToken");
  Cookies.remove("refresh_token");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: getCookieToken(),
      refreshToken: getCookieRefreshToken(),
      isAuthenticated: !!getCookieToken(),

      setAuth: (user, token, refreshToken) => {
        setTokenCookies(token);
        setRefreshTokenCookies(refreshToken);
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
        setTokenCookies(token);
        setRefreshTokenCookies(refreshToken);
        set((state) => ({
          token: token || state.token || getCookieToken(),
          refreshToken:
            refreshToken || state.refreshToken || getCookieRefreshToken(),
          isAuthenticated: !!state.user || !!token,
        }));
      },

      setRefreshToken: (refreshToken) => {
        setRefreshTokenCookies(refreshToken);
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
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("auth-storage");
          } catch {}
        }
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
