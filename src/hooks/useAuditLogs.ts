import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getAuditLogsApi,
  GetAuditLogsParams,
  AuditLogsResponse,
} from "@/lib/api/auditLogs";

export const AUDIT_LOGS_QUERY_KEYS = {
  all: ["audit-logs"] as const,
  list: (params: GetAuditLogsParams) => ["audit-logs", "list", params] as const,
};

/**
 * Custom React Query hook for fetching audit logs with pagination & filtering
 */
export const useAuditLogsQuery = (
  params: GetAuditLogsParams = { page: 1, limit: 20 }
) => {
  return useQuery<AuditLogsResponse>({
    queryKey: AUDIT_LOGS_QUERY_KEYS.list(params),
    queryFn: () => getAuditLogsApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
    gcTime: 10 * 60 * 1000, // 10 minutes cache retention
    placeholderData: keepPreviousData, // Smooth pagination transitions
    retry: 2,
  });
};
