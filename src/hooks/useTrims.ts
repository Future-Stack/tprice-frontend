import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTrimsApi,
  getTrimByIdApi,
  createTrimApi,
  updateTrimApi,
  deleteTrimApi,
  TrimsResponse,
  GetTrimsParams,
  CreateTrimInput,
  UpdateTrimInput,
  TrimItem,
} from "@/lib/api/trims";
import { MODELS_QUERY_KEYS } from "@/hooks/useModels";

export const TRIMS_QUERY_KEYS = {
  all: ["trims"] as const,
  list: (params?: GetTrimsParams) => ["trims", "list", params] as const,
  detail: (id: string) => ["trims", "detail", id] as const,
};

/**
 * Hook to fetch paginated trims with TanStack Query caching
 */
export const useGetTrimsQuery = (
  params?: GetTrimsParams,
  options?: { enabled?: boolean },
) => {
  return useQuery<TrimsResponse>({
    queryKey: TRIMS_QUERY_KEYS.list(params),
    queryFn: () => getTrimsApi(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook to fetch single trim by ID
 */
export const useGetTrimByIdQuery = (id?: string) => {
  return useQuery<TrimItem>({
    queryKey: TRIMS_QUERY_KEYS.detail(id || ""),
    queryFn: () => getTrimByIdApi(id!),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to create a new trim
 */
export const useCreateTrimMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTrimInput) => createTrimApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIMS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to update an existing trim
 */
export const useUpdateTrimMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrimInput }) =>
      updateTrimApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIMS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete a trim
 */
export const useDeleteTrimMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTrimApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIMS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEYS.all });
    },
  });
};
