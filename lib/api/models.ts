import apiClient from "./axios";

export interface ModelBrandCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ModelBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  websiteUrl: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category: ModelBrandCategory | null;
}

export interface ModelTrim {
  id: string;
  name: string;
  slug?: string;
  modelId?: string;
  year?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModelCount {
  trims?: number;
  listings?: number;
}

export interface ModelItem {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  brand: ModelBrand | null;
  _count?: ModelCount;
  trims?: ModelTrim[];
}

export interface ModelsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ModelsResponse {
  data: ModelItem[];
  meta: ModelsMeta;
}

export interface GetModelsParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
}

export interface CreateModelInput {
  name: string;
  brandId: string;
  slug?: string;
}

export interface UpdateModelInput {
  name?: string;
  brandId?: string;
  slug?: string;
}

/**
 * Fetch paginated models from GET /models
 */
export const getModelsApi = async (
  params?: GetModelsParams,
): Promise<ModelsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.brandId && params.brandId !== "ALL") {
      queryParams.brandId = params.brandId;
    }
  }

  const response = await apiClient.get<ModelsResponse>("/models", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Fetch single model details by ID from GET /models/:id
 */
export const getModelByIdApi = async (id: string): Promise<ModelItem> => {
  const response = await apiClient.get<ModelItem>(`/models/${id}`);
  return response.data;
};

/**
 * Create a new model via POST /models
 */
export const createModelApi = async (
  data: CreateModelInput,
): Promise<ModelItem> => {
  const response = await apiClient.post<ModelItem>("/models", data);
  return response.data;
};

/**
 * Update a model via PATCH /models/:id
 */
export const updateModelApi = async (
  id: string,
  data: UpdateModelInput,
): Promise<ModelItem> => {
  const response = await apiClient.patch<ModelItem>(`/models/${id}`, data);
  return response.data;
};

/**
 * Delete a model via DELETE /models/:id
 */
export const deleteModelApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/models/${id}`);
};
