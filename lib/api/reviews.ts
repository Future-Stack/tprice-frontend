import apiClient from "./axios";

export interface ReviewItem {
  id: string;
  userId?: string;
  reviewerName: string;
  reviewerTitle: string;
  reviewerLocation: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  highlightTags?: string[];
  isFeatured?: boolean;
  isApproved?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewPayload {
  reviewerName: string;
  reviewerTitle: string;
  reviewerLocation: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  highlightTags?: string[];
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
}

export interface GetReviewsResponse {
  data: ReviewItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Submit a new VIP review
 */
export const createReviewApi = async (
  payload: CreateReviewPayload
): Promise<ReviewItem> => {
  const response = await apiClient.post<ReviewItem>("/reviews", payload);
  return response.data;
};

/**
 * Fetch reviews list
 */
export const getReviewsApi = async (
  params: GetReviewsParams = {}
): Promise<GetReviewsResponse> => {
  const response = await apiClient.get<GetReviewsResponse>("/reviews", {
    params,
  });
  return response.data;
};

/**
 * Fetch admin reviews list
 */
export const getAdminReviewsApi = async (
  params: GetReviewsParams = {}
): Promise<GetReviewsResponse> => {
  const response = await apiClient.get<GetReviewsResponse>("/admin/reviews", {
    params,
  });
  return response.data;
};

export interface UpdateReviewPayload {
  reviewerName?: string;
  reviewerTitle?: string;
  reviewerLocation?: string;
  avatarUrl?: string;
  rating?: number;
  content?: string;
  highlightTags?: string[];
}

/**
 * Delete admin review by ID
 */
export const deleteAdminReviewApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/reviews/${id}`);
};

/**
 * Update an existing review by ID
 */
export const updateReviewApi = async (
  id: string,
  payload: UpdateReviewPayload
): Promise<ReviewItem> => {
  const response = await apiClient.patch<ReviewItem>(`/reviews/${id}`, payload);
  return response.data;
};



