import { ListingItem } from "@/lib/api/listings";

export const SORT_OPTIONS = [
  { label: "Newest Listed", value: "NEWEST" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Most Viewed", value: "VIEWS" },
];

export const DEFAULT_CATEGORIES = [
  { label: "All", value: "ALL" },
  { label: "Supercar", value: "SUPERCAR" },
  { label: "Yacht", value: "YACHT" },
  { label: "Jet", value: "JET" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Watch", value: "WATCH" },
];

export interface CategoryOption {
  label: string;
  value: string;
}

export interface MarketplaceHeaderProps {
  categories: CategoryOption[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  onOpenMobileFilter: () => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export interface MarketplaceFilterProps {
  categories: CategoryOption[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  locationCity: string;
  setLocationCity: (val: string) => void;
  locationCountry: string;
  setLocationCountry: (val: string) => void;
  buildYear: string;
  setBuildYear: (val: string) => void;
  priceMin: number;
  setPriceMin: (val: number) => void;
  priceMax: number;
  setPriceMax: (val: number) => void;
  handleResetFilters: () => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export interface MarketplaceCardProps {
  asset: ListingItem;
}

export interface MarketplaceGridProps {
  listings: ListingItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onResetFilters: () => void;
}

export interface MarketplacePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  currentCount: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}
