import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBrandsApi,
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
  BrandsResponse,
  GetBrandsParams,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/lib/api/brands";

export const BRANDS_QUERY_KEYS = {
  all: ["brands"] as const,
  list: (params?: GetBrandsParams) => ["brands", "list", params] as const,
};

/**
 * Hook to fetch paginated brands with TanStack Query caching
 */
export const useGetBrandsQuery = (params?: GetBrandsParams) => {
  return useQuery<BrandsResponse>({
    queryKey: BRANDS_QUERY_KEYS.list(params),
    queryFn: () => getBrandsApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache gc time
  });
};

/**
 * Hook to create a new brand
 */
export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandInput) => createBrandApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to update an existing brand
 */
export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandInput }) =>
      updateBrandApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete a brand
 */
export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrandApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEYS.all });
    },
  });
};
