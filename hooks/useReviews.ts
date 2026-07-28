import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  createReviewApi,
  getReviewsApi,
  getAdminReviewsApi,
  deleteAdminReviewApi,
  CreateReviewPayload,
  GetReviewsParams,
  GetReviewsResponse,
  ReviewItem,
} from "@/lib/api/reviews";

export const REVIEWS_QUERY_KEYS = {
  all: ["reviews"] as const,
  list: (params: GetReviewsParams) => ["reviews", "list", params] as const,
  adminList: (params: GetReviewsParams) => ["reviews", "adminList", params] as const,
};

/**
 * Custom React Query hook for fetching public reviews with pagination
 */
export const useGetReviewsQuery = (params: GetReviewsParams = { page: 1, limit: 10 }) => {
  return useQuery<GetReviewsResponse>({
    queryKey: REVIEWS_QUERY_KEYS.list(params),
    queryFn: () => getReviewsApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
  });
};

/**
 * Custom React Query hook for fetching admin reviews with pagination
 */
export const useAdminReviewsQuery = (params: GetReviewsParams = { page: 1, limit: 10 }) => {
  return useQuery<GetReviewsResponse>({
    queryKey: REVIEWS_QUERY_KEYS.adminList(params),
    queryFn: () => getAdminReviewsApi(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
  });
};

/**
 * Custom React Query hook for deleting an admin review by ID
 */
export const useDeleteAdminReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteAdminReviewApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.all });
    },
  });
};

/**
 * Custom React Query hook for creating a review
 */
export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ReviewItem, Error, CreateReviewPayload>({
    mutationFn: (payload: CreateReviewPayload) => createReviewApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.all });
    },
  });
};


