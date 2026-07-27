import apiClient from "./axios";

export interface UserCount {
  listings: number;
  offersAsBuyer: number;
  offersAsSeller: number;
  dealsAsBuyer: number;
  dealsAsSeller: number;
}

export interface DealerProfile {
  id: string;
  companyName: string;
  businessRegistrationNo: string;
  isAutoApproved: boolean;
}

export interface AdminUserItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: "ADMIN" | "DEALER" | "SELLER" | "BUYER" | string;
  vipStatus: boolean;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  dealerProfile: DealerProfile | null;
  _count?: UserCount;
}

export interface AdminUsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  data: AdminUserItem[];
  meta: AdminUsersMeta;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  isVerified?: boolean;
}

export interface UpdateUserStatusPayload {
  isVerified?: boolean;
  vipStatus?: boolean;
  role?: string;
  status?: string;
}

/**
 * Fetch admin users via GET /admin/users
 */
export const getAdminUsersApi = async (
  params?: GetAdminUsersParams
): Promise<AdminUsersResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.role && params.role !== "ALL" && params.role !== "All Roles") {
      queryParams.role = params.role;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.isVerified !== undefined) {
      queryParams.isVerified = params.isVerified;
    }
  }

  const response = await apiClient.get<AdminUsersResponse>("/admin/users", {
    params: queryParams,
  });

  return response.data;
};

/**
 * Update user status via PATCH /admin/users/:id/status (or fallback /admin/users/:id)
 */
export const updateAdminUserStatusApi = async (
  id: string,
  payload: UpdateUserStatusPayload
): Promise<AdminUserItem> => {
  try {
    const response = await apiClient.patch<AdminUserItem>(`/admin/users/${id}/status`, payload);
    return response.data;
  } catch (error: any) {
    // If status endpoint fallback is /admin/users/:id
    if (error.response?.status === 404) {
      const fallbackResponse = await apiClient.patch<AdminUserItem>(`/admin/users/${id}`, payload);
      return fallbackResponse.data;
    }
    throw error;
  }
};

export interface DeleteUserResponse {
  message: string;
  id: string;
}

/**
 * Delete user via DELETE /admin/users/:id
 */
export const deleteAdminUserApi = async (id: string): Promise<DeleteUserResponse> => {
  const response = await apiClient.delete<DeleteUserResponse>(`/admin/users/${id}`);
  return response.data;
};

export const deleteUserApi = deleteAdminUserApi;

