"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 as SpinnerIcon } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useGetMeQuery } from "@/hooks/useAuth";

export const getDashboardPath = (role?: string): string => {
  if (!role) return "/buyer";
  const r = role.toUpperCase();
  if (r === "ADMIN") return "/admin";
  if (r === "DEALER") return "/dealer";
  if (r === "SELLER") return "/seller";
  return "/buyer";
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const { user: storeUser, token: storeToken, logout } = useAuthStore();
  const token = storeToken || Cookies.get("access_token");

  // Fetch user if token exists
  const { data: fetchedUser, isLoading, isError } = useGetMeQuery(!!token);

  const currentUser = fetchedUser || storeUser;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 1. If no token exists, redirect to login
    if (!token) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. If getMe query failed (e.g. 401 unauthenticated), clear auth state & redirect
    if (isError) {
      logout();
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    // 3. If user is loaded, verify allowed roles
    if (currentUser && allowedRoles && allowedRoles.length > 0) {
      const userRole = (currentUser.role || "").toUpperCase();
      const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

      if (!normalizedAllowedRoles.includes(userRole)) {
        // Redirect user to their own authorized dashboard path
        const redirectPath = getDashboardPath(userRole);
        if (pathname !== redirectPath) {
          router.replace(redirectPath);
        }
      }
    }
  }, [isMounted, token, currentUser, isError, allowedRoles, pathname, router, logout]);

  // Render loading state while hydrating or waiting for initial user query
  if (!isMounted || (token && !currentUser && isLoading)) {
    return (
      <div className="min-h-screen w-full bg-[#0B0B0C] flex flex-col items-center justify-center gap-4 text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#E78F23]/20 border-t-[#E78F23] animate-spin" />
          <SpinnerIcon className="w-6 h-6 text-[#E78F23] absolute animate-pulse" />
        </div>
        <p className="text-xs uppercase tracking-widest text-gray-400 animate-pulse">
          Verifying security authorization...
        </p>
      </div>
    );
  }

  // If no token, return null while redirect effect fires
  if (!token || isError) {
    return null;
  }

  // If role is restricted and current user role does not match, return null while redirect effect fires
  if (currentUser && allowedRoles && allowedRoles.length > 0) {
    const userRole = (currentUser.role || "").toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
