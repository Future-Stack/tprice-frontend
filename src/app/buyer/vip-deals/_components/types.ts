import { ListingItem } from "@/lib/api/listings";

export const SORT_OPTIONS = [
  { label: "Newest Listed", value: "NEWEST" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Most Viewed", value: "VIEWS" },
];

export const MIN_PRICE_LIMIT = 0;
export const MAX_PRICE_LIMIT = 100000000;

export interface VIPDealsHeaderProps {
  categoriesList: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenMobileFilter: () => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export interface VIPDealsFilterProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  locationCity: string;
  setLocationCity: (city: string) => void;
  locationCountry: string;
  setLocationCountry: (country: string) => void;
  buildYear: string;
  setBuildYear: (year: string) => void;
  search: string;
  setSearch: (query: string) => void;
  priceMin: number;
  setPriceMin: (min: number) => void;
  priceMax: number;
  setPriceMax: (max: number) => void;
  handleReset: () => void;
  minLimit: number;
  maxLimit: number;
  categoriesList: string[];
  brandsList: string[];
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export interface VIPDealCardProps {
  asset: ListingItem;
}

export interface VIPDealsGridProps {
  assets: ListingItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onResetFilters: () => void;
}

export interface VIPDealsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCount: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}
