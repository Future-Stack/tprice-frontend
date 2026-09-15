import apiClient from "./axios";

export interface CategoryCount {
  brands: number;
  listings: number;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  imageUrl: string | null;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: CategoryCount;
}

export interface CategoriesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriesResponse {
  data: Category[];
  meta: CategoriesMeta;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isActive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  imageUrl?: string;
  iconName?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  iconName?: string;
  displayOrder?: number;
  isActive?: boolean;
}

/**
 * Fetch categories with pagination & filtering from GET /categories
 */
export const getCategoriesApi = async (
  params?: GetCategoriesParams,
): Promise<CategoriesResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.status && params.status !== "ALL") {
      queryParams.status = params.status;
    }
    if (params.isActive !== undefined) {
      queryParams.isActive = params.isActive;
    }
  }

  const response = await apiClient.get("/categories", {
    params: queryParams,
  });

  // If backend returns a raw array, handle filtering & pagination as fallback
  if (Array.isArray(response.data)) {
    let items = response.data as Category[];

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      items = items.filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) ||
          (cat.description && cat.description.toLowerCase().includes(q)),
      );
    }

    if (params?.status && params.status !== "ALL") {
      const isActive = params.status === "ACTIVE";
      items = items.filter((cat) => cat.isActive === isActive);
    }

    if (params?.isActive !== undefined) {
      items = items.filter((cat) => cat.isActive === params.isActive);
    }

    const total = items.length;
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  // If backend returns object with { data, meta }
  return response.data;
};

/**
 * Create a new category via POST /categories
 */
export const createCategoryApi = async (
  data: CreateCategoryInput,
): Promise<Category> => {
  const response = await apiClient.post<Category>("/categories", data);
  return response.data;
};

/**
 * Update an existing category via PATCH /categories/:id
 */
export const updateCategoryApi = async (
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> => {
  const response = await apiClient.patch<Category>(`/categories/${id}`, data);
  return response.data;
};

/**
 * Delete a category via DELETE /categories/:id
 */
export const deleteCategoryApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
