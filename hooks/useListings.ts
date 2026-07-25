import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getListingsApi,
  getListingByIdApi,
  createListingApi,
  getMyListingsApi,
  GetListingsParams,
  GetMyListingsParams,
  ListingsResponse,
  ListingItem,
  CreateListingInput,
} from "@/lib/api/listings";

export const LISTINGS_QUERY_KEYS = {
  all: ["listings"] as const,
  list: (params: GetListingsParams) => ["listings", "list", params] as const,
  me: (params: GetMyListingsParams) => ["listings", "me", params] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
};

/**
 * Custom React Query hook for fetching current seller's listings
 */
export const useMyListingsQuery = (
  params: GetMyListingsParams = { page: 1, limit: 10, sortBy: "NEWEST" }
) => {
  return useQuery<ListingsResponse>({
    queryKey: LISTINGS_QUERY_KEYS.me(params),
    queryFn: () => getMyListingsApi(params),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time for caching
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
    placeholderData: keepPreviousData, // smooth data transitions during page/filter updates
    retry: 2,
  });
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

/**
 * Custom React Query hook for creating a new listing
 */
export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListingInput) => createListingApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEYS.all });
    },
  });
};

