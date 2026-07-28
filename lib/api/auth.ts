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





