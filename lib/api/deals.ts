import apiClient from "./axios";

export interface DealUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface DealListing {
  id: string;
  title: string;
  slug?: string;
  category?: string;
}

export interface DealItem {
  id: string;
  offerId?: string;
  listingId?: string;
  buyerId?: string;
  sellerId?: string;
  agreedPrice: string | number;
  stage: string;
  isFlagged: boolean;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  listing?: DealListing | null;
  buyer?: DealUser | null;
  seller?: DealUser | null;
}

export interface DealsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetDealsResponse {
  data: DealItem[];
  meta: DealsMeta;
}

export interface GetDealsParams {
  page?: number;
  limit?: number;
  stage?: string;
  isFlagged?: boolean;
  search?: string;
}

/**
 * Fetch deals list with pagination
 */
export const getAdminDealsApi = async (
  params?: GetDealsParams
): Promise<GetDealsResponse> => {
  const response = await apiClient.get<GetDealsResponse>("/deals", {
    params,
  });
  return response.data;
};

/**
 * Fetch single deal detail by ID (if endpoint available)
 */
export const getDealDetailApi = async (
  dealId: string
): Promise<DealItem> => {
  const response = await apiClient.get<DealItem>(`/deals/${dealId}`);
  return response.data;
};
