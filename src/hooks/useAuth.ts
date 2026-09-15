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
    onError: (error: any) => {
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
      !!(
        Cookies.get("accessToken") ||
        Cookies.get("token") ||
        Cookies.get("access_token")
      ));

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
    retry: (failureCount, error: any) => {
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        error?.response?.status === 404
      ) {
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
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update profile";
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
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to change password";
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

