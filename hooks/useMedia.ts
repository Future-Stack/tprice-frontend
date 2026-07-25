import { useMutation } from "@tanstack/react-query";
import { uploadMediaApi, UploadMediaParams, MediaUploadResponse } from "@/lib/api/media";

/**
 * Hook to handle media/image uploads to Cloudinary via backend
 */
export const useUploadMediaMutation = () => {
  return useMutation<MediaUploadResponse, Error, UploadMediaParams>({
    mutationFn: (params: UploadMediaParams) => uploadMediaApi(params),
  });
};
