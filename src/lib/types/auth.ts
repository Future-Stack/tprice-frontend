export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: "BUYER" | "SELLER" | "DEALER" | string;
}

export interface RegisterUser {
  id: string;
  email: string;
  role: string;
  vipStatus: boolean;
  isVip?: boolean;
  firstName?: string;
  lastName?: string;
  name?: string;
  fullName?: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: RegisterUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  vipStatus?: boolean;
  isVip?: boolean;
  firstName?: string;
  lastName?: string;
  name?: string;
  fullName?: string;
  phone?: string | null;
  avatar?: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  dealerProfile?: Record<string, unknown> | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message?: string;
  success?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  success?: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
  success?: boolean;
}
