import type { ListingItem } from "@/lib/api/listings";
import type { OfferDetailItem } from "@/lib/api/offers";

export type { ListingItem, OfferDetailItem };

export interface DynamicSpecItem {
  label: string;
  value: string;
}

export function formatSpecKey(key: string): string {
  const formatted = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatSpecValue(key: string, val: unknown): string {
  if (val === null || val === undefined || val === "") return "N/A";
  if (typeof val === "boolean") return val ? "Yes" : "No";

  const lowerKey = key.toLowerCase();
  if (typeof val === "number") {
    if (lowerKey.includes("mileage")) return `${val.toLocaleString()} mi`;
    if (lowerKey.includes("horsepower") || lowerKey.includes("power") || lowerKey === "hp")
      return `${val.toLocaleString()} hp`;
    if (lowerKey.includes("sqft") || lowerKey.includes("squarefeet"))
      return `${val.toLocaleString()} sq ft`;
    return val.toLocaleString();
  }

  const strVal = String(val);
  if (lowerKey.includes("mileage") && !strVal.toLowerCase().includes("mi")) return `${strVal} mi`;
  if (
    (lowerKey.includes("horsepower") || lowerKey.includes("power")) &&
    !strVal.toLowerCase().includes("hp")
  ) {
    return `${strVal} hp`;
  }

  return strVal;
}

export function parseHighestBid(highestBid: unknown): number | null {
  if (highestBid === null || highestBid === undefined) return null;
  if (typeof highestBid === "object") {
    const hb = highestBid as { amount?: number | string; price?: number | string };
    const num = Number(hb.amount ?? hb.price);
    return !isNaN(num) && num > 0 ? num : null;
  }
  const num = Number(highestBid);
  return !isNaN(num) && num > 0 ? num : null;
}

export function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred while fetching product details.";
  if (typeof error === "object" && error !== null) {
    const errObj = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (errObj.response?.data?.message) return errObj.response.data.message;
    if (errObj.message) return errObj.message;
  }
  return "An unexpected error occurred while fetching product details.";
}

export function getProductImages(product?: ListingItem): string[] {
  if (product?.media && product.media.length > 0) {
    return [...product.media].sort((a, b) => a.displayOrder - b.displayOrder).map((m) => m.url);
  }
  return [
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  ];
}

export function getDynamicSpecs(product?: ListingItem): DynamicSpecItem[] {
  if (!product) return [];
  const dynamicSpecs: DynamicSpecItem[] = [];

  if (product.buildYear && !product.specifications?.year && !product.specifications?.buildYear) {
    dynamicSpecs.push({
      label: "YEAR",
      value: String(product.buildYear),
    });
  }

  if (product.specifications && typeof product.specifications === "object") {
    Object.entries(product.specifications).forEach(([rawKey, val]) => {
      if (val !== null && val !== undefined && val !== "") {
        dynamicSpecs.push({
          label: formatSpecKey(rawKey),
          value: formatSpecValue(rawKey, val),
        });
      }
    });
  }

  return dynamicSpecs;
}

export interface BuyerListingGalleryProps {
  product: ListingItem;
  productImages: string[];
  safeSelectedImage: number;
  onSelectImage: (index: number) => void;
  isSaved: boolean;
  isSaving: boolean;
  onToggleSave: (e?: React.MouseEvent) => void;
  overviewText: string;
}

export interface BuyerListingSidebarProps {
  product: ListingItem;
  locationText: string;
  formattedPrice: string;
  currencySymbol: string;
  askingPriceVal: number | null;
  startingBidVal: number | null;
  highestBidVal: number | null;
  totalBidsCountVal: number | null;
  isAuction: boolean;
  isFixedPrice: boolean;
  isPrivateSale: boolean;
  existingOffer?: OfferDetailItem;
  isUserOffersLoading: boolean;
  dynamicSpecs: DynamicSpecItem[];
  sellerName: string;
  sellerInitial: string;
  onOpenSendOffer: () => void;
  onOpenViewOffer: () => void;
  onOpenPlaceBid: () => void;
}

export interface BuyerBiddingSidebarProps {
  product: ListingItem;
  locationText: string;
  formattedPrice: string;
  numericPrice: number;
  existingOffer?: OfferDetailItem;
  isSaving: boolean;
  isSaved: boolean;
  dynamicSpecs: DynamicSpecItem[];
  sellerName: string;
  sellerInitial: string;
  onOpenPlaceBid: () => void;
  onToggleSave: (e?: React.MouseEvent) => void;
  onExitBiddingMode: () => void;
}

export interface SendOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ListingItem;
  productImages: string[];
  numericPrice: number;
  formattedPrice: string;
  onSuccess: () => void;
}

export interface ViewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingOffer: OfferDetailItem;
}

export interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ListingItem;
  productImages: string[];
  existingOffer?: OfferDetailItem;
  formattedPrice: string;
  onSuccess: () => void;
}
