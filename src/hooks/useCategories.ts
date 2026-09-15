import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  Category,
  CategoriesResponse,
  GetCategoriesParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/api/categories";

export const CATEGORIES_QUERY_KEYS = {
  all: ["categories"] as const,
  list: (params?: GetCategoriesParams) => ["categories", "list", params] as const,
};

/**
 * Hook to fetch paginated categories with TanStack Query caching
 */
export const useGetCategoriesQuery = (params?: GetCategoriesParams) => {
  return useQuery<CategoriesResponse>({
    queryKey: CATEGORIES_QUERY_KEYS.list(params),
    queryFn: () => getCategoriesApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
    gcTime: 5 * 60 * 1000, // 5 minutes cache gc time
  });
};

/**
 * Alias for useGetCategoriesQuery
 */
export const useGetCategoryQuery = useGetCategoriesQuery;

/**
 * Hook to create a new category
 */
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to update an existing category by ID
 */
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      updateCategoryApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete a category by ID
 */
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
    },
  });
};
