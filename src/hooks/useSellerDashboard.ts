import { useQuery } from "@tanstack/react-query";
import {
  getSellerDashboardApi,
  SellerDashboardResponse,
} from "@/lib/api/sellerDashboard";

export const SELLER_DASHBOARD_QUERY_KEYS = {
  dashboard: ["seller", "dashboard"] as const,
};

/**
 * React Query hook for fetching seller dashboard data with caching and stale time configuration
 */
export const useSellerDashboardQuery = () => {
  return useQuery<SellerDashboardResponse>({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.dashboard,
    queryFn: getSellerDashboardApi,
    staleTime: 60 * 1000, // 1 minute stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache gc time
    retry: 2,
  });
};
