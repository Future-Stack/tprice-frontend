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
  Cookies.get("access_token") || Cookies.get("accessToken") || Cookies.get("token") || null;

const getCookieRefreshToken = () =>
  Cookies.get("refresh_token") || Cookies.get("refreshToken") || null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: getCookieToken(),
      refreshToken: getCookieRefreshToken(),
      isAuthenticated: !!getCookieToken(),

      setAuth: (user, token, refreshToken) => {
        Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: "lax" });
        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "lax" });
        }
        set({
          user,
          token,
          refreshToken: refreshToken || getCookieRefreshToken(),
          isAuthenticated: true,
        });
      },

      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!(user && (state.token || getCookieToken())),
        })),

      setToken: (token, refreshToken) => {
        Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: "lax" });
        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "lax" });
        }
        set({
          token,
          refreshToken: refreshToken || Cookies.get("refresh_token") || null,
          isAuthenticated: true,
        });
      },

      setRefreshToken: (refreshToken) => {
        Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "lax" });
        set({ refreshToken });
      },

      logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }),
    }
  )
);
