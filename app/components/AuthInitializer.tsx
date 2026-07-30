"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "@/hooks/useAuth";
import { getMeApi, decodeJwtUser } from "@/lib/api/auth";

export default function AuthInitializer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken =
      urlParams.get("accessToken") ||
      urlParams.get("token") ||
      urlParams.get("access_token") ||
      urlParams.get("jwt") ||
      Cookies.get("accessToken") ||
      Cookies.get("access_token") ||
      Cookies.get("token");
    const refreshToken =
      urlParams.get("refreshToken") ||
      urlParams.get("refresh_token") ||
      Cookies.get("refreshToken") ||
      Cookies.get("refresh_token");

    if (accessToken) {
      // 1. Decode JWT for instant fallback user profile
      const decodedUser = decodeJwtUser(accessToken);
      const currentUser = useAuthStore.getState().user || decodedUser;

      if (currentUser) {
        useAuthStore
          .getState()
          .setAuth(currentUser, accessToken, refreshToken || undefined);
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, currentUser);
      } else {
        useAuthStore.getState().setToken(accessToken, refreshToken || undefined);
      }

      // 2. Clean URL search parameters without reloading page
      if (
        urlParams.has("accessToken") ||
        urlParams.has("token") ||
        urlParams.has("access_token") ||
        urlParams.has("jwt") ||
        urlParams.has("refreshToken") ||
        urlParams.has("refresh_token")
      ) {
        urlParams.delete("accessToken");
        urlParams.delete("token");
        urlParams.delete("access_token");
        urlParams.delete("jwt");
        urlParams.delete("refreshToken");
        urlParams.delete("refresh_token");

        const newSearch = urlParams.toString();
        const newUrl =
          window.location.pathname +
          (newSearch ? `?${newSearch}` : "") +
          window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }

      // 3. Fetch full user info using getMeApi and update Zustand + Query Cache
      getMeApi()
        .then((user) => {
          if (user && typeof user === "object" && Object.keys(user).length > 0) {
            useAuthStore
              .getState()
              .setAuth(user, accessToken, refreshToken || undefined);
            queryClient.setQueryData(AUTH_QUERY_KEYS.user, user);
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
            if (user && typeof user === "object" && Object.keys(user).length > 0) {
              useAuthStore.getState().setUser(user);
              queryClient.setQueryData(AUTH_QUERY_KEYS.user, user);
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
