import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  uploadMediaApi,
  UploadMediaParams,
  MediaUploadResponse,
  getLandingMediaApi,
  GetLandingMediaParams,
  LandingMediaResponse,
  createLandingMediaApi,
  CreateLandingMediaPayload,
  LandingMediaItem,
  deleteLandingMediaApi,
} from "@/lib/api/media";

export const MEDIA_QUERY_KEYS = {
  all: ["media"] as const,
  landingMedia: (params: GetLandingMediaParams) =>
    ["media", "landing-media", params] as const,
};

/**
 * Hook to handle media/image uploads to Cloudinary via backend
 */
export const useUploadMediaMutation = () => {
  return useMutation<MediaUploadResponse, Error, UploadMediaParams>({
    mutationFn: (params: UploadMediaParams) => uploadMediaApi(params),
  });
};

/**
 * Custom React Query hook for fetching paginated landing media with smooth pagination transitions
 */
export const useLandingMediaQuery = (
  params: GetLandingMediaParams = { page: 1, limit: 10 }
) => {
  return useQuery<LandingMediaResponse>({
    queryKey: MEDIA_QUERY_KEYS.landingMedia(params),
    queryFn: () => getLandingMediaApi(params),
    staleTime: 3 * 60 * 1000, // 3 minutes cache stale time
    gcTime: 10 * 60 * 1000, // 10 minutes cache retention
    placeholderData: keepPreviousData, // Smooth pagination transitions without layout jump
    retry: 2,
  });
};

/**
 * Hook to create new landing media with automatic cache invalidation
 */
export const useCreateLandingMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<LandingMediaItem, Error, CreateLandingMediaPayload>({
    mutationFn: (payload: CreateLandingMediaPayload) => createLandingMediaApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete landing media asset with automatic cache invalidation
 */
export const useDeleteLandingMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteLandingMediaApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
    },
  });
};



