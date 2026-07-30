export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterUser {
  id: string;
  email: string;
  role: string;
  vipStatus: boolean;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
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
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string | null;
  avatar?: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  dealerProfile?: any;
  [key: string]: any;
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
  user: User;
}

export interface LogoutResponse {
  message?: string;
  [key: string]: any;
}


