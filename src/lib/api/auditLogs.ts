import apiClient from "./axios";

export interface AuditLogUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  changes?: Record<string, any> | null;
  createdAt: string;
  user?: AuditLogUser | null;
}

export interface AuditLogsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogsResponse {
  data: AuditLogItem[];
  meta: AuditLogsMeta;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  resource?: string;
  search?: string;
}

/**
 * Fetch audit logs via GET /audit-logs
 */
export const getAuditLogsApi = async (
  params?: GetAuditLogsParams
): Promise<AuditLogsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.action && params.action !== "ALL") queryParams.action = params.action;
    if (params.resource && params.resource !== "ALL") queryParams.resource = params.resource;
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();
  }

  const response = await apiClient.get<AuditLogsResponse>("/audit-logs", {
    params: queryParams,
  });

  return response.data;
};
