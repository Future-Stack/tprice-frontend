import apiClient from "./axios";

export interface ListingMedia {
  id: string;
  listingId: string;
  url: string;
  type: string;
  displayOrder: number;
  createdAt: string;
}

export interface ListingOwner {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  phone?: string | null;
  email?: string | null;
}

export interface ListingSpecifications {
  engine?: string;
  engines?: string;
  mileage?: number | string;
  horsepower?: number | string;
  power?: string;
  transmission?: string;
  exteriorColor?: string;
  interiorColor?: string;
  brand?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  maxMach?: number | string;
  sleepingCapacity?: number | string;
  passengerCapacity?: number | string;
  rangeNauticalMiles?: number | string;
  [key: string]: any;
}

export interface ListingItem {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  brand?: string | null;
  brandId?: string | null;
  category: string;
  categoryId?: string | null;
  subCategory?: string | null;
  saleType?: string;
  allowCounterOffers?: boolean;
  askingPrice: string;
  startingBid?: string | null;
  highestBid?: string | number | null;
  totalBidsCount?: number | null;
  auctionEndsAt?: string | null;
  currency: string;
  isOffMarket: boolean;
  isFeatured: boolean;
  subscriptionId?: string | null;
  status: string;
  rejectionReason?: string | null;
  viewsCount: number;
  locationCity?: string | null;
  locationCountry?: string | null;
  buildYear?: number | null;
  specifications?: ListingSpecifications;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  media: ListingMedia[];
  owner?: ListingOwner;
  _count?: {
    savedBy?: number;
    offers?: number;
  };
  savedCount?: number;
  offersCount?: number;
  isSaved?: boolean;
}

export interface SaveListingResponse {
  saved: boolean;
  message: string;
}

export interface ListingsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingsResponse {
  data: ListingItem[];
  meta: ListingsMeta;
}

export interface GetListingsParams {
  category?: string;
  subCategory?: string;
  brand?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  locationCity?: string;
  locationCountry?: string;
  buildYear?: number | string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const getListingsApi = async (params?: GetListingsParams): Promise<ListingsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.category && params.category !== "ALL" && params.category !== "All") {
      queryParams.category = params.category;
    }
    if (params.subCategory && params.subCategory !== "ALL" && params.subCategory !== "All") {
      queryParams.subCategory = params.subCategory;
    }
    if (params.brand && params.brand !== "ALL" && params.brand !== "All") {
      queryParams.brand = params.brand;
    }
    if (params.isFeatured !== undefined) {
      queryParams.isFeatured = params.isFeatured;
    }
    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice > 0) {
      queryParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice > 0) {
      queryParams.maxPrice = params.maxPrice;
    }
    if (params.locationCity && params.locationCity.trim()) {
      queryParams.locationCity = params.locationCity.trim();
    }
    if (params.locationCountry && params.locationCountry.trim()) {
      queryParams.locationCountry = params.locationCountry.trim();
    }
    if (params.buildYear) {
      queryParams.buildYear = params.buildYear;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.limit = params.limit;
    }
  }

  const response = await apiClient.get<ListingsResponse>("/listings", {
    params: queryParams,
  });

  return response.data;
};

/**
 * Fetch VIP listings via GET /listings/vip
 */
export const getVipListingsApi = async (
  params?: GetListingsParams
): Promise<ListingsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.category && params.category !== "ALL" && params.category !== "All") {
      queryParams.category = params.category;
    }
    if (params.subCategory && params.subCategory !== "ALL" && params.subCategory !== "All") {
      queryParams.subCategory = params.subCategory;
    }
    if (params.brand && params.brand !== "ALL" && params.brand !== "All") {
      queryParams.brand = params.brand;
    }
    if (params.isFeatured !== undefined) {
      queryParams.isFeatured = params.isFeatured;
    }
    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice > 0) {
      queryParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice > 0) {
      queryParams.maxPrice = params.maxPrice;
    }
    if (params.locationCity && params.locationCity.trim()) {
      queryParams.locationCity = params.locationCity.trim();
    }
    if (params.locationCountry && params.locationCountry.trim()) {
      queryParams.locationCountry = params.locationCountry.trim();
    }
    if (params.buildYear) {
      queryParams.buildYear = params.buildYear;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.limit = params.limit;
    }
  }

  const response = await apiClient.get<ListingsResponse>("/listings/vip", {
    params: queryParams,
  });

  return response.data;
};

export const getListingByIdApi = async (idOrSlug: string): Promise<ListingItem> => {
  const response = await apiClient.get<ListingItem>(`/listings/${idOrSlug}`);
  return response.data;
};

export const getListingBySlugApi = getListingByIdApi;

export interface GetMyListingsParams {
  sortBy?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

export const getMyListingsApi = async (
  params?: GetMyListingsParams
): Promise<ListingsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.limit = params.limit;
    }
    if (params.status && params.status !== "ALL" && params.status !== "All") {
      queryParams.status = params.status;
    }
    if (params.category && params.category !== "ALL" && params.category !== "All") {
      queryParams.category = params.category;
    }
  }

  const response = await apiClient.get<ListingsResponse>("/listings/me", {
    params: queryParams,
  });

  return response.data;
};

export interface CreateListingMediaInput {
  url: string;
  type?: string;
  displayOrder?: number;
}

export interface CreateListingInput {
  title: string;
  category: string;
  subCategory?: string;
  saleType?: string;
  allowCounterOffers?: boolean;
  askingPrice?: number;
  startingBid?: number;
  auctionEndsAt?: string;
  currency?: string;
  isOffMarket?: boolean;
  locationCity?: string;
  locationCountry?: string;
  buildYear?: number;
  brand?: string;
  specifications?: string;
  media?: CreateListingMediaInput[];
}

export const createListingApi = async (data: CreateListingInput): Promise<ListingItem> => {
  const response = await apiClient.post<ListingItem>("/listings", data);
  return response.data;
};

export interface UpdateListingInput {
  title?: string;
  category?: string;
  subCategory?: string;
  saleType?: string;
  allowCounterOffers?: boolean;
  askingPrice?: number;
  startingBid?: number;
  auctionEndsAt?: string;
  currency?: string;
  isOffMarket?: boolean;
  locationCity?: string;
  locationCountry?: string;
  buildYear?: number;
  brand?: string;
  specifications?: string;
  media?: CreateListingMediaInput[];
  status?: string;
}

export const updateListingApi = async (
  id: string,
  data: UpdateListingInput
): Promise<ListingItem> => {
  const response = await apiClient.patch<ListingItem>(`/listings/${id}`, data);
  return response.data;
};


export interface GetAdminListingsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

/**
 * Fetch admin listings via GET /admin/listings
 */
export const getAdminListingsApi = async (
  params?: GetAdminListingsParams
): Promise<ListingsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.status && params.status !== "ALL" && params.status !== "All listings") {
      queryParams.status = params.status;
    }
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
  }

  const response = await apiClient.get<ListingsResponse>("/admin/listings", {
    params: queryParams,
  });

  return response.data;
};

/**
 * Update admin listing status via PATCH /listings/:id/status
 */
export const updateAdminListingStatusApi = async (
  id: string,
  status: string,
  rejectionReason?: string
): Promise<ListingItem> => {
  const response = await apiClient.patch<ListingItem>(`/listings/${id}/status`, {
    status,
    ...(rejectionReason ? { rejectionReason } : {}),
  });
  return response.data;
};

export const updateListingStatusApi = updateAdminListingStatusApi;

export interface DeleteListingResponse {
  message: string;
  id: string;
}

/**
 * Delete listing via DELETE /listings/:id
 */
export const deleteListingApi = async (id: string): Promise<DeleteListingResponse> => {
  const response = await apiClient.delete<DeleteListingResponse>(`/listings/${id}`);
  return response.data;
};

/**
 * Alias for backward compatibility
 */
export const deleteAdminListingApi = deleteListingApi;

/**
 * Save / toggle favorite listing via POST /listings/:id/save
 */
export const saveListingApi = async (id: string): Promise<SaveListingResponse> => {
  const response = await apiClient.post<SaveListingResponse>(`/listings/${id}/save`);
  return response.data;
};

export interface GetSavedListingsParams {
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/**
 * Fetch current user's saved listings via GET /listings/me/saved
 */
export const getSavedListingsApi = async (
  params?: GetSavedListingsParams
): Promise<ListingsResponse> => {
  const queryParams: Record<string, any> = {};

  if (params) {
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice > 0) {
      queryParams.maxPrice = params.maxPrice;
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.limit = params.limit;
    }
  }

  const response = await apiClient.get<ListingsResponse>("/listings/me/saved", {
    params: queryParams,
  });

  return response.data;
};

export interface FeaturedSingleListingPlan {
  plan: "FEATURED_SINGLE_LISTING" | string;
  price: number;
  currency: string;
  billingInterval: string;
  duration?: string;
  description: string;
}

export interface FeaturedUnlimitedAnnualPlan {
  plan: "FEATURED_UNLIMITED_ANNUAL" | string;
  price: number;
  currency: string;
  billingInterval: string;
  durationDays?: number;
  description: string;
}

export interface FeaturedPricingResponse {
  singleListing: FeaturedSingleListingPlan;
  unlimitedAnnual: FeaturedUnlimitedAnnualPlan;
}

/**
 * Fetch featured pricing options via GET /listings/featured-pricing
 */
export const getFeaturedPricingApi = async (): Promise<FeaturedPricingResponse> => {
  const response = await apiClient.get<
    FeaturedPricingResponse | { data: FeaturedPricingResponse }
  >("/listings/featured-pricing");

  const resData = response.data as any;
  if (resData?.data && resData?.data?.singleListing) {
    return resData.data;
  }
  return resData;
};

export interface ActiveFeaturedSubscription {
  id: string;
  plan: string;
  amount: number;
  status: string;
  startsAt?: string;
  expiresAt?: string;
}

export interface FeaturedStatusPricing {
  singleListingPrice: number;
  unlimitedAnnualPrice: number;
  currency: string;
}

export interface FeaturedStatusResponse {
  hasActiveSubscription: boolean;
  expiresAt?: string | null;
  daysRemaining?: number | null;
  totalFeaturedListings?: number;
  activeSubscription?: ActiveFeaturedSubscription | null;
  pricing?: FeaturedStatusPricing;
}

/**
 * Fetch current seller's featured subscription status via GET /listings/me/featured-status
 */
export const getFeaturedStatusApi = async (): Promise<FeaturedStatusResponse> => {
  const response = await apiClient.get<
    FeaturedStatusResponse | { data: FeaturedStatusResponse }
  >("/listings/me/featured-status");

  const resData = response.data as any;
  if (resData?.data && resData?.data?.hasActiveSubscription !== undefined) {
    return resData.data;
  }
  return resData;
};
