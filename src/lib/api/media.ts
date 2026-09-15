import apiClient from "./axios";

export interface MediaUploadResponse {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
}

export interface UploadMediaParams {
  file?: File;
  files?: File[] | File;
  folder?: string;
}

export interface UploadMultipleMediaParams {
  files: File[];
  folder?: string;
}

export const uploadMultipleMediaApi = async ({
  files,
  folder = "exoticworld/listings",
}: UploadMultipleMediaParams): Promise<MediaUploadResponse[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("folder", folder);

  const response = await apiClient.post<MediaUploadResponse[]>(
    "/media/upload-multiple",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const uploadMediaApi = async ({
  file,
  files,
  folder = "exoticworld/listings",
}: UploadMediaParams): Promise<MediaUploadResponse> => {
  const fileList = files
    ? Array.isArray(files)
      ? files
      : [files]
    : file
      ? [file]
      : [];

  const res = await uploadMultipleMediaApi({
    files: fileList,
    folder,
  });

  return Array.isArray(res) ? res[0] : (res as unknown as MediaUploadResponse);
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
  params: GetLandingMediaParams = {},
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
  payload: CreateLandingMediaPayload,
): Promise<LandingMediaItem> => {
  const response = await apiClient.post<LandingMediaItem>(
    "/admin/landing-media",
    payload,
  );
  return response.data;
};

export const deleteLandingMediaApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/landing-media/${id}`);
};
