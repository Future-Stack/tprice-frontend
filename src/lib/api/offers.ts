import apiClient from "./axios";

export interface OfferMedia {
  id: string;
  url: string;
  type: string;
  displayOrder?: number;
}

export interface OfferListing {
  id: string;
  title: string;
  slug: string;
  saleType?: string;
  allowCounterOffers?: boolean;
  askingPrice?: string | null;
  startingBid?: string | null;
  auctionEndsAt?: string | null;
  currency?: string;
  media?: OfferMedia[];
}

export interface OfferUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

export interface OfferItem {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  initialAmount: string;
  currentAmount: string;
  status: string;
  roundsCount: number;
  createdAt: string;
  updatedAt: string;
  listing?: OfferListing | null;
  buyer?: OfferUser | null;
  seller?: OfferUser | null;
  histories?: OfferHistoryItem[];
}

export interface OfferHistoryItem {
  id: string;
  offerId: string;
  senderId: string;
  amount: string;
  note?: string | null;
  action: string;
  createdAt: string;
  sender?: OfferUser | null;
}

export interface OfferDeal {
  id: string;
  offerId: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  agreedPrice: string;
  stage: string;
  isFlagged: boolean;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfferDetailItem extends OfferItem {
  histories?: OfferHistoryItem[];
  deal?: OfferDeal | null;
}

export interface OffersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetOffersResponse {
  data: OfferItem[];
  meta: OffersMeta;
}

export interface GetOffersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface AcceptOfferResponse {
  message: string;
  offer: OfferItem;
  dealId: string;
}

/**
 * Fetch list of offers received by seller
 */
export const getOffersApi = async (
  params?: GetOffersParams
): Promise<GetOffersResponse> => {
  const response = await apiClient.get<GetOffersResponse>("/offers", {
    params,
  });
  return response.data;
};

/**
 * Fetch single offer detail by ID
 */
export const getOfferDetailApi = async (
  offerId: string
): Promise<OfferDetailItem> => {
  const response = await apiClient.get<OfferDetailItem>(`/offers/${offerId}`);
  return response.data;
};

/**
 * Payload for creating an offer
 */
export interface CreateOfferPayload {
  listingId: string;
  amount: number;
  note?: string;
}

/**
 * Create/Send a new offer for a listing
 */
export const createOfferApi = async (
  payload: CreateOfferPayload
): Promise<OfferDetailItem> => {
  const response = await apiClient.post<OfferDetailItem>("/offers", payload);
  return response.data;
};

/**
 * Accept an offer by offer ID
 */
export const acceptOfferApi = async (
  offerId: string
): Promise<AcceptOfferResponse> => {
  const response = await apiClient.post<AcceptOfferResponse>(
    `/offers/${offerId}/accept`,
    {}
  );
  return response.data;
};

export interface WithdrawOfferResponse {
  message?: string;
  offer?: OfferItem;
}

/**
 * Withdraw an offer by offer ID
 */
export const withdrawOfferApi = async (
  offerId: string
): Promise<WithdrawOfferResponse> => {
  const response = await apiClient.post<WithdrawOfferResponse>(
    `/offers/${offerId}/withdraw`,
    {}
  );
  return response.data;
};

/**
 * Payload for counter-offer
 */
export interface CounterOfferPayload {
  amount: number;
  note?: string;
}

/**
 * Send counter-offer by offer ID
 */
export const counterOfferApi = async (
  offerId: string,
  payload: CounterOfferPayload
): Promise<OfferDetailItem> => {
  const response = await apiClient.post<OfferDetailItem>(
    `/offers/${offerId}/counter`,
    payload
  );
  return response.data;
};

export interface RejectOfferResponse {
  message?: string;
  offer?: OfferItem;
}

/**
 * Reject an offer by offer ID
 */
export const rejectOfferApi = async (
  offerId: string
): Promise<RejectOfferResponse> => {
  const response = await apiClient.post<RejectOfferResponse>(
    `/offers/${offerId}/reject`,
    {}
  );
  return response.data;
};



