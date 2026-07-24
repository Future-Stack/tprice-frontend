import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getListingsApi,
  getListingByIdApi,
  GetListingsParams,
  ListingsResponse,
  ListingItem,
} from "@/lib/api/listings";

export const LISTINGS_QUERY_KEYS = {
  all: ["listings"] as const,
  list: (params: GetListingsParams) => ["listings", "list", params] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
};

/**
 * Custom React Query hook for fetching marketplace listings with caching, error handling, and smooth transitions
 */
export const useListingsQuery = (params: GetListingsParams = { page: 1, limit: 9 }) => {
  return useQuery<ListingsResponse>({
    queryKey: LISTINGS_QUERY_KEYS.list(params),
    queryFn: () => getListingsApi(params),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time for caching
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
    placeholderData: keepPreviousData, // smooth data transitions during page/filter updates
    retry: 2,
  });
};

/**
 * Custom React Query hook for fetching single listing by ID
 */
export const useListingByIdQuery = (id: string) => {
  return useQuery<ListingItem>({
    queryKey: LISTINGS_QUERY_KEYS.detail(id),
    queryFn: () => getListingByIdApi(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
