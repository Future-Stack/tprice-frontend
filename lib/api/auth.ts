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

export const getMeApi = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
};

export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
  return response.data;
};




