import apiClient from "./axios";

export interface DashboardMetrics {
  activeDealersCount: number;
  pendingListingsCount: number;
  activeDealsCount: number;
  totalListingsCount: number;
}

export interface PendingApprovalOwner {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface PendingApprovalMedia {
  id: string;
  listingId: string;
  url: string;
  type: string;
  displayOrder: number;
  createdAt: string;
}

export interface PendingApproval {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  brand: string | null;
  brandId: string | null;
  category: string;
  categoryId: string | null;
  subCategory: string | null;
  saleType: string;
  allowCounterOffers: boolean;
  askingPrice: string;
  startingBid: string | null;
  auctionEndsAt: string | null;
  currency: string;
  isOffMarket: boolean;
  isFeatured: boolean;
  subscriptionId: string | null;
  status: string;
  rejectionReason: string | null;
  viewsCount: number;
  locationCity: string | null;
  locationCountry: string | null;
  buildYear: number | null;
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  media: PendingApprovalMedia[];
  owner: PendingApprovalOwner;
}

export interface DealerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  isVerified: boolean;
  activeDealsCount: number;
}

export interface RecentActivityUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface RecentActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string | null;
  userAgent: string | null;
  changes?: Record<string, any>;
  createdAt: string;
  user: RecentActivityUser;
}

export interface ActiveDealListing {
  id: string;
  title: string;
  slug: string;
  askingPrice: string;
}

export interface ActiveDealUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ActiveDeal {
  id: string;
  offerId: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  agreedPrice: string;
  stage: string;
  isFlagged: boolean;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  listing: ActiveDealListing;
  buyer: ActiveDealUser;
  seller: ActiveDealUser;
}

export interface AdminDashboardOverviewResponse {
  metrics: DashboardMetrics;
  pendingApprovals: PendingApproval[];
  dealersSummary: DealerSummary[];
  recentActivities: RecentActivity[];
  activeDeals: ActiveDeal[];
}

/**
 * Fetch Admin Dashboard Overview metrics, pending approvals, dealers, activities, and active deals.
 */
export const getAdminDashboardOverviewApi = async (): Promise<AdminDashboardOverviewResponse> => {
  const response = await apiClient.get<AdminDashboardOverviewResponse>(
    "/admin/dashboard/overview"
  );
  return response.data;
};
