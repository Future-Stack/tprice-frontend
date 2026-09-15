import { useQuery } from "@tanstack/react-query";
import {
  getBuyerDashboardApi,
  BuyerDashboardResponse,
} from "@/lib/api/buyerDashboard";

export const BUYER_DASHBOARD_QUERY_KEYS = {
  dashboard: ["buyer", "dashboard"] as const,
};

/**
 * React Query hook for fetching buyer dashboard data with caching and stale time configuration
 */
export const useBuyerDashboardQuery = () => {
  return useQuery<BuyerDashboardResponse>({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.dashboard,
    queryFn: getBuyerDashboardApi,
    staleTime: 60 * 1000, // 1 minute stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache gc time
    retry: 2,
  });
};
