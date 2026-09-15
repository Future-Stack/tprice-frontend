import { OfferItem } from "@/lib/api/offers";

export interface BuyerOfferCardProps {
  offer: OfferItem;
  expandedOfferId: string | null;
  onToggleExpand: (id: string) => void;
  onAccept: (id: string) => void;
  onWithdraw: (id: string) => void;
  onOpenCounter: (offer: OfferItem) => void;
  isAcceptPending: boolean;
  isWithdrawPending: boolean;
}

export interface BuyerOfferListProps {
  offers: OfferItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  expandedOfferId: string | null;
  onToggleExpand: (id: string) => void;
  onAccept: (id: string) => void;
  onWithdraw: (id: string) => void;
  onOpenCounter: (offer: OfferItem) => void;
  isAcceptPending: boolean;
  isWithdrawPending: boolean;
}

export interface BuyerOfferPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferItem | null;
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
  if (!dateString) return "";
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
