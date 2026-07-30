"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "@/hooks/useAuth";
import { getMeApi } from "@/lib/api/auth";

export default function AuthInitializer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken =
      urlParams.get("accessToken") ||
      urlParams.get("token") ||
      Cookies.get("accessToken") ||
      Cookies.get("token");
    const refreshToken =
      urlParams.get("refreshToken") ||
      Cookies.get("refreshToken");

    if (accessToken) {
      // 1. Store token in Zustand store
      useAuthStore.getState().setToken(accessToken, refreshToken || undefined);

      // 2. Clean URL search parameters without reloading page
      urlParams.delete("accessToken");
      urlParams.delete("token");
      urlParams.delete("refreshToken");

      const newSearch = urlParams.toString();
      const newUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : "") +
        window.location.hash;
      window.history.replaceState({}, document.title, newUrl);

      // 3. Fetch user info using getMeApi and update Zustand + Query Cache
      getMeApi()
        .then((user) => {
          if (user) {
            useAuthStore
              .getState()
              .setAuth(user, accessToken, refreshToken || undefined);
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
          }
        })
        .catch((err) => {
          console.error("Error fetching profile after OAuth redirect:", err);
        });
    } else {
      // HttpOnly cookies cannot be read via JavaScript (Cookies.get returns undefined).
      // If store user is missing, attempt fetching /users/me using HttpOnly cookie via withCredentials.
      if (
        !useAuthStore.getState().user ||
        !useAuthStore.getState().isAuthenticated
      ) {
        getMeApi()
          .then((user) => {
            if (user && (user.id || user.email)) {
              useAuthStore.getState().setUser(user);
              queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
            }
          })
          .catch(() => {
            // Unauthenticated, silently ignore
          });
      }
    }
  }, [queryClient]);

  return null;
}
