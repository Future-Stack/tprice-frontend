import axios from "axios";
import apiClient from "./axios";
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  RefreshPayload,
  RefreshResponse,
  LogoutResponse,
  User,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/lib/types/auth";

export * from "@/lib/types/auth";

export const registerApi = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return response.data;
};

export const loginApi = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export const refreshTokenApi = async (
  payload: RefreshPayload,
): Promise<RefreshResponse> => {
  const baseURL = "https://api.exoticworldinc.com/api/v1";
  const response = await axios.post<RefreshResponse>(
    `${baseURL}/auth/refresh`,
    payload,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    },
  );
  return response.data;
};

export const handleGoogleLogin = (): void => {
  window.location.href = `https://api.exoticworldinc.com/api/v1/auth/google`;
};

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export const decodeJwtUser = (token: string): User | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    if (payload && (payload.sub || payload.id || payload.email)) {
      return {
        id: payload.sub || payload.id || "google-user",
        email: payload.email || "",
        role: payload.role || "BUYER",
        firstName: payload.firstName,
        lastName: payload.lastName,
        name:
          payload.name ||
          (payload.email ? payload.email.split("@")[0] : "User"),
      };
    }
  } catch {
    // Ignore decoding errors
  }
  return null;
};

export const getMeApi = async (): Promise<User> => {
  try {
    const response = await apiClient.get<any>("/users/me");
    const resData = response.data;
    if (resData && typeof resData === "object") {
      const extracted =
        resData.data?.user ||
        resData.user ||
        resData.data ||
        resData.result ||
        resData;
      if (extracted && typeof extracted === "object") {
        return extracted;
      }
    }
    return resData;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const fallback = await apiClient.get<any>("/auth/me");
        const resData = fallback.data;
        return resData?.data?.user || resData?.data || resData?.user || resData;
      } catch {
        const fallback2 = await apiClient.get<any>("/me");
        const resData = fallback2.data;
        return resData?.data?.user || resData?.data || resData?.user || resData;
      }
    }
    throw error;
  }
};

export const updateMeApi = async (
  payload: UpdateProfilePayload,
): Promise<User> => {
  const response = await apiClient.patch<User>("/users/me", payload);
  return response.data;
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
  [key: string]: any;
}

export const changePasswordApi = async (
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> => {
  const response = await apiClient.patch<ChangePasswordResponse>(
    "/users/me/change-password",
    payload,
  );
  return response.data;
};

export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
  return response.data;
};

export interface UserSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface RevokeSessionResponse {
  message?: string;
  id?: string;
}

export const getUserSessionsApi = async (): Promise<UserSession[]> => {
  try {
    const response = await apiClient.get<UserSession[]>("/users/me/sessions");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const fallbackRes =
          await apiClient.get<UserSession[]>("/auth/sessions");
        return fallbackRes.data;
      } catch {
        const fallbackRes2 = await apiClient.get<UserSession[]>("/sessions");
        return fallbackRes2.data;
      }
    }
    throw error;
  }
};

export const revokeUserSessionApi = async (
  sessionId: string,
): Promise<RevokeSessionResponse> => {
  try {
    const response = await apiClient.delete<RevokeSessionResponse>(
      `/users/me/sessions/${sessionId}`,
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const fallbackRes = await apiClient.delete<RevokeSessionResponse>(
          `/auth/sessions/${sessionId}`,
        );
        return fallbackRes.data;
      } catch {
        const fallbackRes2 = await apiClient.delete<RevokeSessionResponse>(
          `/sessions/${sessionId}`,
        );
        return fallbackRes2.data;
      }
    }
    throw error;
  }
};

export const forgotPasswordApi = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload,
  );
  return response.data;
};

export const resetPasswordApi = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    payload,
  );
  return response.data;
};
