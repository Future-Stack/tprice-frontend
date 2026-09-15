import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboardOverviewApi,
  AdminDashboardOverviewResponse,
} from "@/lib/api/dashboard";

export const ADMIN_DASHBOARD_QUERY_KEYS = {
  overview: ["admin", "dashboard", "overview"] as const,
};

/**
 * Hook to fetch Admin Dashboard overview data with React Query
 */
export const useGetAdminDashboardOverviewQuery = () => {
  return useQuery<AdminDashboardOverviewResponse>({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview,
    queryFn: getAdminDashboardOverviewApi,
    staleTime: 60 * 1000, // 1 minute stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache gc time
  });
};
