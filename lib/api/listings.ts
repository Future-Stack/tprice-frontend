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
  mileage?: number;
  horsepower?: number;
  transmission?: string;
  exteriorColor?: string;
  interiorColor?: string;
  brand?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
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

export const getListingByIdApi = async (idOrSlug: string): Promise<ListingItem> => {
  const response = await apiClient.get<ListingItem>(`/listings/${idOrSlug}`);
  return response.data;
};

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
  isFeatured?: boolean;
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

