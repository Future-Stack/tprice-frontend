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

export interface LandingMediaItem {
  id: string;
  title: string;
  category?: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  badgeText?: string;
  displayOrder?: number;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LandingMediaMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LandingMediaResponse {
  data: LandingMediaItem[];
  meta: LandingMediaMeta;
}

export interface GetLandingMediaParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  search?: string;
}

export const getLandingMediaApi = async (
  params: GetLandingMediaParams = {}
): Promise<LandingMediaResponse> => {
  const response = await apiClient.get<LandingMediaResponse>("/landing-media", {
    params,
  });
  return response.data;
};

export interface CreateLandingMediaPayload {
  title: string;
  category?: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  badgeText?: string;
  displayOrder?: number;
  isPublished?: boolean;
}

export const createLandingMediaApi = async (
  payload: CreateLandingMediaPayload
): Promise<LandingMediaItem> => {
  const response = await apiClient.post<LandingMediaItem>(
    "/admin/landing-media",
    payload
  );
  return response.data;
};

export const deleteLandingMediaApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/landing-media/${id}`);
};



