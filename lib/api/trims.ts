import apiClient from "./axios";

export interface TrimCategory {
  id: string;
  name: string;
  slug: string;
}

export interface TrimBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  categoryId?: string | null;
  category?: TrimCategory | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrimModel {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  createdAt?: string;
  updatedAt?: string;
  brand?: TrimBrand | null;
}

export interface TrimItem {
  id: string;
  name: string;
  modelId: string;
  yearStart: number | null;
  yearEnd: number | null;
  createdAt: string;
  updatedAt: string;
  model: TrimModel | null;
}

export interface TrimsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrimsResponse {
  data: TrimItem[];
  meta: TrimsMeta;
}

export interface GetTrimsParams {
  page?: number;
  limit?: number;
  search?: string;
  modelId?: string;
}

export interface CreateTrimInput {
  name: string;
  modelId: string;
  yearStart?: number | null;
  yearEnd?: number | null;
}

export interface UpdateTrimInput {
  name?: string;
  modelId?: string;
  yearStart?: number | null;
  yearEnd?: number | null;
}

/**
 * Fetch paginated trims from GET /trims
 */
export const getTrimsApi = async (
  params?: GetTrimsParams,
): Promise<TrimsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.modelId && params.modelId !== "ALL") {
      queryParams.modelId = params.modelId;
    }
  }

  const response = await apiClient.get<TrimsResponse>("/trims", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Fetch single trim by ID from GET /trims/:id
 */
export const getTrimByIdApi = async (id: string): Promise<TrimItem> => {
  const response = await apiClient.get<TrimItem>(`/trims/${id}`);
  return response.data;
};

/**
 * Create a new trim via POST /trims
 */
export const createTrimApi = async (
  data: CreateTrimInput,
): Promise<TrimItem> => {
  const response = await apiClient.post<TrimItem>("/trims", data);
  return response.data;
};

/**
 * Update an existing trim via PATCH /trims/:id
 */
export const updateTrimApi = async (
  id: string,
  data: UpdateTrimInput,
): Promise<TrimItem> => {
  const response = await apiClient.patch<TrimItem>(`/trims/${id}`, data);
  return response.data;
};

/**
 * Delete a trim via DELETE /trims/:id
 */
export const deleteTrimApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/trims/${id}`);
};
