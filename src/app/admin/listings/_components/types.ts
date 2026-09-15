import { ListingItem } from "@/lib/api/listings";

export const TABS = ["All listings", "pending", "Approved", "Rejected"] as const;
export const LIMIT_OPTIONS = [10, 20, 50, 100];

export const formatSubmittedDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) return "Today";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatPrice = (priceStr?: string | number, currency = "USD") => {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
};

export const getDealerName = (listing: ListingItem) => {
  if (listing.owner) {
    const fullName = `${listing.owner.firstName || ""} ${listing.owner.lastName || ""}`.trim();
    if (fullName) return fullName;
    if (listing.owner.email) return listing.owner.email;
  }
  return "Unknown Dealer";
};

export const getStatusBadge = (status: string) => {
  const normalized = (status || "").toUpperCase();

  if (normalized === "PENDING_APPROVAL" || normalized === "PENDING") {
    return {
      label: "pending",
      className: "bg-yellow-500/10 text-primary border border-primary/20",
    };
  }
  if (normalized === "LIVE" || normalized === "APPROVED") {
    return {
      label: "Approved",
      className: "bg-green-500/10 text-green-500 border border-green-500/20",
    };
  }
  if (normalized === "REJECTED") {
    return {
      label: "Rejected",
      className: "bg-red-500/10 text-red-500 border border-red-500/20",
    };
  }

  return {
    label: status,
    className: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  };
};

export interface AdminListingsHeaderProps {
  isFetching: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export interface AdminListingsFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  limit: number;
  onLimitChange: (val: number) => void;
}

export interface AdminListingsTableRowProps {
  listing: ListingItem;
  deletingId: string | null;
  updatingId: string | null;
  isDeletePending: boolean;
  isUpdatePending: boolean;
  updateTargetStatus?: string;
  onApprove: (id: string, title: string) => void;
  onOpenRejectModal: (listing: ListingItem) => void;
  onOpenEditModal: (listing: ListingItem) => void;
  onOpenDeleteModal: (listing: ListingItem) => void;
}

export interface AdminListingsTableProps {
  listings: ListingItem[];
  isLoading: boolean;
  searchQuery: string;
  activeTab: string;
  deletingId: string | null;
  updatingId: string | null;
  isDeletePending: boolean;
  isUpdatePending: boolean;
  updateTargetStatus?: string;
  onApprove: (id: string, title: string) => void;
  onOpenRejectModal: (listing: ListingItem) => void;
  onOpenEditModal: (listing: ListingItem) => void;
  onOpenDeleteModal: (listing: ListingItem) => void;
}

export interface AdminListingsPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}
