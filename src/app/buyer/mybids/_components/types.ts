import { OfferItem } from "@/lib/api/offers";

export interface StatusBadgeInfo {
  label: string;
  colorClass: string;
}

export interface BidTableRowProps {
  bid: OfferItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export interface BidsTableSectionProps {
  bids: OfferItem[];
  selectedBidId: string | null;
  onSelectBid: (id: string) => void;
}

export interface BidDetailPanelProps {
  selectedBid: OfferItem;
  inclFees: boolean;
  onToggleInclFees: () => void;
  onShare: () => void;
}

export interface BidsPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface BidsErrorStateProps {
  errorMessage?: string;
  onRetry: () => void;
}

/* ─── Helpers ─── */
export const formatPrice = (priceStr?: string | number | null, currency = "USD"): string => {
  if (priceStr === undefined || priceStr === null || priceStr === "") return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;

  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const getStatusBadge = (status?: string): StatusBadgeInfo => {
  const norm = (status || "").toUpperCase();
  switch (norm) {
    case "ACCEPTED":
    case "WON":
      return {
        label: "Accepted",
        colorClass: "text-[#E78F23]",
      };
    case "LEADING":
      return {
        label: "Leading",
        colorClass: "text-emerald-500",
      };
    case "PENDING":
      return {
        label: "Pending",
        colorClass: "text-blue-400",
      };
    case "COUNTERED":
      return {
        label: "Countered",
        colorClass: "text-amber-400",
      };
    case "REJECTED":
    case "DECLINED":
      return {
        label: "Declined",
        colorClass: "text-red-500",
      };
    case "OUTBID":
      return {
        label: "Outbid",
        colorClass: "text-red-500",
      };
    default:
      return {
        label: status || "Pending",
        colorClass: "text-gray-400",
      };
  }
};
