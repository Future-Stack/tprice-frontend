import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  uploadMediaApi,
  UploadMediaParams,
  MediaUploadResponse,
  getLandingMediaApi,
  GetLandingMediaParams,
  LandingMediaResponse,
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

