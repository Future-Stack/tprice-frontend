import { useQuery } from "@tanstack/react-query";
import {
  getAdminDealsApi,
  getDealDetailApi,
  GetDealsParams,
  GetDealsResponse,
  DealItem,
} from "@/lib/api/deals";

export const DEALS_QUERY_KEYS = {
  all: ["deals"] as const,
  list: (params?: GetDealsParams) => ["deals", "list", params] as const,
  detail: (id: string) => ["deals", "detail", id] as const,
};

/**
 * React Query hook to fetch admin deals with caching and pagination
 */
export const useAdminDealsQuery = (params?: GetDealsParams) => {
  return useQuery<GetDealsResponse>({
    queryKey: DEALS_QUERY_KEYS.list(params),
    queryFn: () => getAdminDealsApi(params),
    staleTime: 30 * 1000, // 30 seconds stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2,
  });
};

/**
 * React Query hook to fetch a single deal by ID
 */
export const useDealDetailQuery = (dealId: string) => {
  return useQuery<DealItem>({
    queryKey: DEALS_QUERY_KEYS.detail(dealId),
    queryFn: () => getDealDetailApi(dealId),
    enabled: Boolean(dealId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};
