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
    const tokenFromParams =
      urlParams.get("accessToken") ||
      urlParams.get("token") ||
      urlParams.get("access_token") ||
      urlParams.get("jwt");
    const refreshFromParams =
      urlParams.get("refreshToken") ||
      urlParams.get("refresh_token");

    const cookieToken =
      Cookies.get("accessToken") ||
      Cookies.get("access_token") ||
      Cookies.get("token");
    const cookieRefreshToken =
      Cookies.get("refreshToken") ||
      Cookies.get("refresh_token");

    const storeToken = useAuthStore.getState().token;
    const storeRefreshToken = useAuthStore.getState().refreshToken;

    const effectiveAccessToken = tokenFromParams || cookieToken || storeToken;
    const effectiveRefreshToken =
      refreshFromParams || cookieRefreshToken || storeRefreshToken;

    if (tokenFromParams) {
      // 1. Clean URL search parameters without reloading page
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

    if (effectiveAccessToken) {
      // Decode JWT for instant fallback user profile
      const decodedUser = decodeJwtUser(effectiveAccessToken);
      const currentUser = useAuthStore.getState().user || decodedUser;

      if (currentUser) {
        useAuthStore
          .getState()
          .setAuth(
            currentUser,
            effectiveAccessToken,
            effectiveRefreshToken || undefined,
          );
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, currentUser);
      } else {
        useAuthStore
          .getState()
          .setToken(
            effectiveAccessToken,
            effectiveRefreshToken || undefined,
          );
      }

      // Fetch fresh user info
      getMeApi()
        .then((user) => {
          if (user && typeof user === "object" && Object.keys(user).length > 0) {
            useAuthStore
              .getState()
              .setAuth(
                user,
                effectiveAccessToken,
                effectiveRefreshToken || undefined,
              );
            queryClient.setQueryData(AUTH_QUERY_KEYS.user, user);
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            useAuthStore.getState().logout();
          }
        });
    }
  }, [queryClient]);

  return null;
}
