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
      urlParams.get("access_token");
    const refreshToken =
      urlParams.get("refreshToken") || urlParams.get("refresh_token");

    if (accessToken) {
      // 1. Store token in cookies & Zustand store
      useAuthStore.getState().setToken(accessToken, refreshToken || undefined);

      // 2. Clean URL search parameters without reloading page
      urlParams.delete("accessToken");
      urlParams.delete("token");
      urlParams.delete("access_token");
      urlParams.delete("refreshToken");
      urlParams.delete("refresh_token");

      const newSearch = urlParams.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);

      // 3. Fetch user info using getMeApi and update Zustand + Query Cache
      getMeApi()
        .then((user) => {
          if (user) {
            useAuthStore.getState().setAuth(user, accessToken, refreshToken || undefined);
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
          }
        })
        .catch((err) => {
          console.error("Error fetching profile after OAuth redirect:", err);
        });
    } else {
      // Check if access_token / accessToken / token cookie exists but Zustand store is not authenticated
      const cookieToken =
        Cookies.get("access_token") ||
        Cookies.get("accessToken") ||
        Cookies.get("token");
      if (cookieToken && (!useAuthStore.getState().isAuthenticated || !useAuthStore.getState().user)) {
        getMeApi()
          .then((user) => {
            if (user) {
              useAuthStore.getState().setAuth(user, cookieToken);
              queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
            }
          })
          .catch(() => {});
      }
    }
  }, [queryClient]);

  return null;
}
