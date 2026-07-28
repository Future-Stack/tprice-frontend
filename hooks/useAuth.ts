import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
  updateMeApi,
  changePasswordApi,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  User,
  LogoutResponse,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

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
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      // Invalidate and clear all TanStack Query cache
      queryClient.clear();

      toast.success(data?.message || "Logged out successfully!");
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Logout API error:", error);

      // Perform local cleanup as fallback even if backend request fails
      logoutStore();
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
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
        setAuth(data.user, data.accessToken);
        if (data.refreshToken) {
          Cookies.set("refresh_token", data.refreshToken, {
            expires: 7,
            secure: true,
            sameSite: "lax",
          });
        }
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
        setAuth(data.user, data.accessToken);
        if (data.refreshToken) {
          Cookies.set("refresh_token", data.refreshToken, {
            expires: 7,
            secure: true,
            sameSite: "lax",
          });
        }
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      }
    },
  });
};

/**
 * Custom TanStack Query Hook to fetch current user profile
 */
export const useGetMeQuery = (enabled: boolean = true) => {
  const setUser = useAuthStore((state) => state.setUser);
  const logoutStore = useAuthStore((state) => state.logout);

  return useQuery<User>({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      const data = await getMeApi();
      if (data) {
        setUser(data);
      }
      return data;
    },
    enabled: enabled && !!(Cookies.get("access_token") || useAuthStore.getState().token),
    staleTime: 5 * 60 * 1000,
    retry: false,
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

