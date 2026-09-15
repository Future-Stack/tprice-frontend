import apiClient from "./axios";

export interface BuyerDashboardUser {
  id: string;
  name: string;
  vipStatus: boolean;
}

export interface BuyerDashboardStats {
  activeBidsCount: number;
  offersMadeCount: number;
  savedItemsCount: number;
  recentViewsCount: number;
}

export interface BuyerActiveBid {
  id: string;
  listingId: string;
  listingTitle: string;
  yourBid: number;
  currentHighest: number;
  status: "LEADING" | "PENDING" | "OUTBID" | string;
}

export interface BuyerRecentActivity {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  targetUrl: string;
}

export interface BuyerSavedItemMedia {
  id: string;
  listingId: string;
  url: string;
  type: string;
  displayOrder: number;
  createdAt: string;
}

export interface BuyerSavedItem {
  id: string;
  title: string;
  slug: string;
  askingPrice: string;
  currency: string;
  locationCity?: string | null;
  locationCountry?: string | null;
  status: string;
  media: BuyerSavedItemMedia[];
}

export interface BuyerDashboardResponse {
  user: BuyerDashboardUser;
  stats: BuyerDashboardStats;
  activeBids: BuyerActiveBid[];
  recentActivity: BuyerRecentActivity[];
  savedItems: BuyerSavedItem[];
}

/**
 * Fetch Buyer Dashboard data (user, stats, activeBids, recentActivity, savedItems)
 */
export const getBuyerDashboardApi = async (): Promise<BuyerDashboardResponse> => {
  const response = await apiClient.get<BuyerDashboardResponse>(
    "/users/me/buyer-dashboard"
  );
  return response.data;
};
