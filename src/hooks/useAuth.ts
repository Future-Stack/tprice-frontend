import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
  decodeJwtUser,
  updateMeApi,
  changePasswordApi,
  forgotPasswordApi,
  resetPasswordApi,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  User,
  LogoutResponse,
} from "@/lib/api/auth";
import { useAuthStore, clearAuthCookies } from "@/lib/store/useAuthStore";

export const AUTH_QUERY_KEYS = {
  user: ["auth", "me"] as const,
};

/**
 *  Mutation Hook for Logout
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: (data: LogoutResponse) => {
      // Clear Zustand auth state and cookies
      logoutStore();
      clearAuthCookies();

      // Invalidate and clear all TanStack Query cache
      queryClient.clear();

      toast.success(data?.message || "Logged out successfully!");
      router.push("/");
    },
    onError: (error: unknown) => {
      console.error("Logout API error:", error);

      // Perform local cleanup as fallback even if backend request fails
      logoutStore();
      clearAuthCookies();
      queryClient.clear();

      toast.success("Logged out successfully");
      router.push("/");
    },
  });
};

/**
 *  Mutation Hook for Login
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      }
    },
  });
};

/**
 *  Mutation Hook for Register
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      }
    },
  });
};

/**
 * Custom TanStack Query Hook to fetch current user profile
 */
export const useGetMeQuery = (enabled: boolean = true) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const storeToken = useAuthStore((state) => state.token);

  const hasToken =
    !!storeToken ||
    (typeof window !== "undefined" &&
      !!(Cookies.get("accessToken") || Cookies.get("token") || Cookies.get("access_token")));

  return useQuery<User>({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      const data = await getMeApi();
      if (data && typeof data === "object" && Object.keys(data).length > 0) {
        const token =
          useAuthStore.getState().token ||
          Cookies.get("accessToken") ||
          Cookies.get("token") ||
          Cookies.get("access_token");
        if (token) {
          setAuth(data, token);
        } else {
          setUser(data);
        }
      } else {
        const token = useAuthStore.getState().token;
        if (token) {
          const decoded = decodeJwtUser(token);
          if (decoded) setUser(decoded);
        }
      }
      return data;
    },
    enabled: enabled && hasToken,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403 || status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

/**
 * Mutation Hook for Profile Update
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMeApi(payload),
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update profile";
      toast.error(msg);
    },
  });
};

/**
 * Mutation Hook for Changing Password
 */
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePasswordApi(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully!");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to change password";
      toast.error(msg);
    },
  });
};

/**
 * Mutation Hook for Forgot Password
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordApi(payload),
  });
};

/**
 * Mutation Hook for Reset Password
 */
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi(payload),
  });
};

/**
 * Centralized Auth Hook
 * Single source of truth for authentication state throughout the app.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const activeToken =
    token ||
    (typeof window !== "undefined"
      ? Cookies.get("accessToken") || Cookies.get("token") || Cookies.get("access_token") || null
      : null);

  return {
    user,
    token: activeToken,
    isAuthenticated: isAuthenticated || Boolean(activeToken),
    logout,
    setUser,
    setToken,
  };
};
