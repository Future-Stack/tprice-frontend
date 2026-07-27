import apiClient from "./axios";

export interface SellerDashboardUser {
  id: string;
  name: string;
  role: string;
}

export interface SellerDashboardStats {
  totalListingsCount: number;
  activeListingsCount: number;
  pendingApprovalCount: number;
  offersReceivedCount: number;
}

export interface QuickViewListing {
  id: string;
  title: string;
  slug: string;
  askingPrice: string;
  currency: string;
  status: string;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  targetUrl: string;
}

export interface ActiveListingMedia {
  id: string;
  listingId: string;
  url: string;
  type: string;
  displayOrder: number;
  createdAt: string;
}

export interface ActiveListingItem {
  id: string;
  title: string;
  slug: string;
  askingPrice: string;
  currency: string;
  locationCity?: string | null;
  locationCountry?: string | null;
  status: string;
  media: ActiveListingMedia[];
}

export interface SellerDashboardResponse {
  user: SellerDashboardUser;
  stats: SellerDashboardStats;
  quickViewListings: QuickViewListing[];
  recentActivity: RecentActivityItem[];
  activeListings: ActiveListingItem[];
}

/**
 * Fetch Seller Dashboard data (stats, quickViewListings, recentActivity, activeListings)
 */
export const getSellerDashboardApi = async (): Promise<SellerDashboardResponse> => {
  const response = await apiClient.get<SellerDashboardResponse>(
    "/users/me/seller-dashboard"
  );
  return response.data;
};
