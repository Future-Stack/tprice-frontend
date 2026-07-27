import { useQuery, useMutation, useQueryClient, keepPreviousData, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getListingsApi,
  getListingByIdApi,
  createListingApi,
  updateListingApi,
  getMyListingsApi,
  getSavedListingsApi,
  getAdminListingsApi,
  updateAdminListingStatusApi,
  deleteListingApi,
  deleteAdminListingApi,
  saveListingApi,
  GetListingsParams,
  GetMyListingsParams,
  GetSavedListingsParams,
  GetAdminListingsParams,
  ListingsResponse,
  ListingItem,
  CreateListingInput,
  UpdateListingInput,
  DeleteListingResponse,
  SaveListingResponse,
} from "@/lib/api/listings";

export const LISTINGS_QUERY_KEYS = {
  all: ["listings"] as const,
  list: (params: GetListingsParams) => ["listings", "list", params] as const,
  me: (params: GetMyListingsParams) => ["listings", "me", params] as const,
  saved: (params: GetSavedListingsParams) => ["listings", "saved", params] as const,
  admin: (params: GetAdminListingsParams) => ["listings", "admin", params] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
};

export interface SaveListingContext {
  previousQueries: [QueryKey, ListingsResponse | undefined][];
  previousDetail?: ListingItem;
}

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
 * Custom React Query hook for fetching current user's saved listings
 */
export const useSavedListingsQuery = (
  params: GetSavedListingsParams = { page: 1, limit: 10 },
  options?: { enabled?: boolean }
) => {
  return useQuery<ListingsResponse>({
    queryKey: LISTINGS_QUERY_KEYS.saved(params),
    queryFn: () => getSavedListingsApi(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: 2,
    ...options,
  });
};

/**
 * Custom React Query hook for fetching admin listings with pagination & filter parameters
 */
export const useAdminListingsQuery = (
  params: GetAdminListingsParams = { page: 1, limit: 10 }
) => {
  return useQuery<ListingsResponse>({
    queryKey: LISTINGS_QUERY_KEYS.admin(params),
    queryFn: () => getAdminListingsApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time for admin
    gcTime: 10 * 60 * 1000, // 10 minutes cache gc
    placeholderData: keepPreviousData,
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

/**
 * Custom React Query hook for updating an existing listing
 */
export const useUpdateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListingInput }) =>
      updateListingApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to update an admin listing status (e.g. approve with LIVE or reject with REJECTED)
 * Includes optimistic update for instant smooth UI response.
 */
export const useUpdateAdminListingStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => updateAdminListingStatusApi(id, status, rejectionReason),
    onMutate: async ({ id, status, rejectionReason }) => {
      // Cancel any outgoing refetches to prevent optimistic cache overwrites
      await queryClient.cancelQueries({ queryKey: LISTINGS_QUERY_KEYS.all });

      // Snapshot previous query data across all listing query keys
      const previousQueries = queryClient.getQueriesData<ListingsResponse>({
        queryKey: LISTINGS_QUERY_KEYS.all,
      });

      // Optimistically update matching items in cache instantly
      queryClient.setQueriesData<ListingsResponse>(
        { queryKey: LISTINGS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status,
                    rejectionReason: rejectionReason !== undefined ? rejectionReason : item.rejectionReason,
                  }
                : item
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback cache if mutation fails
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEYS.all });
    },
  });
};

export const useUpdateListingStatusMutation = useUpdateAdminListingStatusMutation;

/**
 * Hook to delete a listing with tag invalidation
 */
export const useDeleteListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteListingResponse, Error, string>({
    mutationFn: (id: string) => deleteListingApi(id),
    onSuccess: () => {
      // Invalidate all query tags matching ["listings"] to trigger UI refetch
      queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEYS.all });
    },
  });
};

export const useDeleteAdminListingMutation = useDeleteListingMutation;

/**
 * Custom React Query hook to toggle save/favorite listing status with instant optimistic UI update
 */
export const useSaveListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveListingResponse, Error, string, SaveListingContext>({
    mutationFn: (id: string) => saveListingApi(id),
    onMutate: async (id: string) => {
      // Cancel outgoing refetches to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: LISTINGS_QUERY_KEYS.all });

      // Snapshot current cache states for rollback on error
      const previousQueries = queryClient.getQueriesData<ListingsResponse>({
        queryKey: LISTINGS_QUERY_KEYS.all,
      });
      const previousDetail = queryClient.getQueryData<ListingItem>(
        LISTINGS_QUERY_KEYS.detail(id)
      );

      // Optimistically update list queries in cache
      queryClient.setQueriesData<ListingsResponse>(
        { queryKey: LISTINGS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) => {
              if (item.id === id) {
                const nextSaved = !item.isSaved;
                const currentCount = item.savedCount ?? item._count?.savedBy ?? 0;
                const nextCount = nextSaved
                  ? currentCount + 1
                  : Math.max(0, currentCount - 1);
                return {
                  ...item,
                  isSaved: nextSaved,
                  savedCount: nextCount,
                  _count: item._count ? { ...item._count, savedBy: nextCount } : { savedBy: nextCount },
                };
              }
              return item;
            }),
          };
        }
      );

      // Optimistically update single listing detail cache if present
      if (previousDetail) {
        const nextSaved = !previousDetail.isSaved;
        const currentCount = previousDetail.savedCount ?? previousDetail._count?.savedBy ?? 0;
        const nextCount = nextSaved ? currentCount + 1 : Math.max(0, currentCount - 1);
        queryClient.setQueryData<ListingItem>(LISTINGS_QUERY_KEYS.detail(id), {
          ...previousDetail,
          isSaved: nextSaved,
          savedCount: nextCount,
          _count: previousDetail._count ? { ...previousDetail._count, savedBy: nextCount } : { savedBy: nextCount },
        });
      }

      return { previousQueries, previousDetail };
    },
    onError: (err, id, context) => {
      // Rollback optimistic cache update
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(LISTINGS_QUERY_KEYS.detail(id), context.previousDetail);
      }
      const errMsg =
        (err as any)?.response?.data?.message || err.message || "Failed to save listing";
      toast.error(errMsg);
    },
    onSuccess: (data, id) => {
      if (data?.message) {
        toast.success(data.message);
      }
      queryClient.setQueriesData<ListingsResponse>(
        { queryKey: LISTINGS_QUERY_KEYS.all },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  isSaved: data.saved,
                };
              }
              return item;
            }),
          };
        }
      );
      queryClient.setQueryData<ListingItem>(LISTINGS_QUERY_KEYS.detail(id), (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isSaved: data.saved,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", "saved"] });
    },
  });
};




