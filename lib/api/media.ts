import apiClient from "./axios";

export interface MediaUploadResponse {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
}

export interface UploadMediaParams {
  file: File;
  folder?: string;
}

export const uploadMediaApi = async ({
  file,
  folder = "exoticworld/listings",
}: UploadMediaParams): Promise<MediaUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await apiClient.post<MediaUploadResponse>(
    "/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
