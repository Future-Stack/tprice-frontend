import apiClient from "./axios";

export interface BrandCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BrandCount {
  listings: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  websiteUrl: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category: BrandCategory | null;
  _count?: BrandCount;
}

export interface BrandsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BrandsResponse {
  data: Brand[];
  meta: BrandsMeta;
}

export interface GetBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export interface CreateBrandInput {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  categoryId?: string;
}

export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  categoryId?: string | null;
}

/**
 * Fetch paginated brands from GET /brands
 */
export const getBrandsApi = async (
  params?: GetBrandsParams,
): Promise<BrandsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.categoryId && params.categoryId !== "ALL") {
      queryParams.categoryId = params.categoryId;
    }
  }

  const response = await apiClient.get<BrandsResponse>("/brands", {
    params: queryParams,
  });
  return response.data;
};

/**
 * Create a brand via POST /brands
 */
export const createBrandApi = async (
  data: CreateBrandInput,
): Promise<Brand> => {
  const response = await apiClient.post<Brand>("/brands", data);
  return response.data;
};

/**
 * Update a brand via PATCH /brands/:id
 */
export const updateBrandApi = async (
  id: string,
  data: UpdateBrandInput,
): Promise<Brand> => {
  const response = await apiClient.patch<Brand>(`/brands/${id}`, data);
  return response.data;
};

/**
 * Delete a brand via DELETE /brands/:id
 */
export const deleteBrandApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/brands/${id}`);
};
