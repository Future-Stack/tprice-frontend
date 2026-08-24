import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getModelsApi,
  getModelByIdApi,
  createModelApi,
  updateModelApi,
  deleteModelApi,
  ModelsResponse,
  GetModelsParams,
  CreateModelInput,
  UpdateModelInput,
  ModelItem,
} from "@/lib/api/models";

export const MODELS_QUERY_KEYS = {
  all: ["models"] as const,
  list: (params?: GetModelsParams) => ["models", "list", params] as const,
  detail: (id: string) => ["models", "detail", id] as const,
};

/**
 * Hook to fetch paginated models with TanStack Query caching
 */
export const useGetModelsQuery = (params?: GetModelsParams) => {
  return useQuery<ModelsResponse>({
    queryKey: MODELS_QUERY_KEYS.list(params),
    queryFn: () => getModelsApi(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch single model by ID
 */
export const useGetModelByIdQuery = (id?: string) => {
  return useQuery<ModelItem>({
    queryKey: MODELS_QUERY_KEYS.detail(id || ""),
    queryFn: () => getModelByIdApi(id!),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to create a new model
 */
export const useCreateModelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateModelInput) => createModelApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to update an existing model
 */
export const useUpdateModelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModelInput }) =>
      updateModelApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete a model
 */
export const useDeleteModelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteModelApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODELS_QUERY_KEYS.all });
    },
  });
};
