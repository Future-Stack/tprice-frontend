import apiClient from "./axios";

export interface DealUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
}

export interface DealMessage {
  id: string;
  dealId: string;
  senderId: string;
  message: string;
  attachments?: any | null;
  createdAt: string;
  sender?: DealUser | null;
}

export interface SendDealMessagePayload {
  message: string;
}

export interface DealListing {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  askingPrice?: string | null;
  currency?: string;
  media?: { id?: string; url: string; type?: string }[];
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
  messages?: DealMessage[];
  offer?: any;
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
 * Fetch deals list for current user (Buyer/Seller) with pagination
 */
export const getDealsApi = async (
  params?: GetDealsParams
): Promise<GetDealsResponse> => {
  const response = await apiClient.get<GetDealsResponse>("/deals", {
    params,
  });
  return response.data;
};

/**
 * Fetch deals list with pagination for admin
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

/**
 * Fetch messages for a specific deal
 */
export const getDealMessagesApi = async (
  dealId: string
): Promise<DealMessage[]> => {
  const response = await apiClient.get<any>(`/deals/${dealId}/messages`);
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  if (response.data && Array.isArray(response.data.messages)) {
    return response.data.messages;
  }
  return [];
};

/**
 * Send a message for a specific deal
 */
export const sendDealMessageApi = async (
  dealId: string,
  payload: SendDealMessagePayload
): Promise<DealMessage> => {
  const response = await apiClient.post<any>(
    `/deals/${dealId}/messages`,
    payload
  );
  return response.data?.data || response.data?.message || response.data;
};


