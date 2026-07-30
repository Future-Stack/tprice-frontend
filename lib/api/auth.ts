import apiClient from "./axios";
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  User,
} from "@/lib/types/auth";

export * from "@/lib/types/auth";

export const registerApi = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export const getMeApi = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
};

export const updateMeApi = async (payload: UpdateProfilePayload): Promise<User> => {
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
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  const response = await apiClient.patch<ChangePasswordResponse>(
    "/users/me/change-password",
    payload
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
        const fallbackRes = await apiClient.get<UserSession[]>("/auth/sessions");
        return fallbackRes.data;
      } catch {
        const fallbackRes2 = await apiClient.get<UserSession[]>("/sessions");
        return fallbackRes2.data;
      }
    }
    throw error;
  }
};

export const revokeUserSessionApi = async (sessionId: string): Promise<RevokeSessionResponse> => {
  try {
    const response = await apiClient.delete<RevokeSessionResponse>(`/users/me/sessions/${sessionId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const fallbackRes = await apiClient.delete<RevokeSessionResponse>(`/auth/sessions/${sessionId}`);
        return fallbackRes.data;
      } catch {
        const fallbackRes2 = await apiClient.delete<RevokeSessionResponse>(`/sessions/${sessionId}`);
        return fallbackRes2.data;
      }
    }
    throw error;
  }
};






