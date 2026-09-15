import type { ListingItem } from "@/lib/api/listings";
import type { OfferDetailItem } from "@/lib/api/offers";

export type { ListingItem, OfferDetailItem };

export interface SpecItemType {
  label: string;
  value: string;
}

export function formatPrice(
  amount: string | number | null | undefined,
  currency: string = "USD"
): string {
  if (!amount) return "Price on Request";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Price on Request";

  const symbol = currency === "USD" ? "$" : currency + " ";
  return `${symbol}${num.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
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
  if (!error) return "The VIP listing you are looking for is currently unavailable or does not exist.";
  if (typeof error === "object" && error !== null) {
    const errObj = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (errObj.response?.data?.message) return errObj.response.data.message;
    if (errObj.message) return errObj.message;
  }
  return "The VIP listing you are looking for is currently unavailable or does not exist.";
}

export function getSpecItems(listing: ListingItem): SpecItemType[] {
  const specs = listing.specifications || {};
  const items: SpecItemType[] = [];

  if (listing.buildYear || specs.buildYear || specs.year) {
    items.push({
      label: "YEAR",
      value: String(listing.buildYear || specs.buildYear || specs.year),
    });
  }

  if (specs.engines || specs.engine) {
    items.push({
      label: "ENGINES",
      value: String(specs.engines || specs.engine),
    });
  }

  if (specs.maxMach !== undefined && specs.maxMach !== null) {
    items.push({
      label: "MAX MACH",
      value: `${specs.maxMach} Mach`,
    });
  }

  if (specs.rangeNauticalMiles !== undefined || specs.range) {
    const rangeVal =
      specs.rangeNauticalMiles !== undefined
        ? `${Number(specs.rangeNauticalMiles).toLocaleString()} NM`
        : String(specs.range);
    items.push({
      label: "RANGE",
      value: rangeVal,
    });
  }

  if (specs.passengerCapacity !== undefined || specs.passengers) {
    items.push({
      label: "PASSENGERS",
      value: `${specs.passengerCapacity ?? specs.passengers} Seats`,
    });
  }

  if (specs.sleepingCapacity !== undefined) {
    items.push({
      label: "SLEEPING CAP",
      value: `${specs.sleepingCapacity} Guests`,
    });
  }

  if (specs.mileage) {
    const mil =
      typeof specs.mileage === "number"
        ? `${specs.mileage.toLocaleString()} mi`
        : String(specs.mileage);
    items.push({
      label: "MILEAGE",
      value: mil,
    });
  }

  if (specs.horsepower || specs.power) {
    items.push({
      label: "POWER",
      value: String(specs.horsepower || specs.power),
    });
  }

  if (specs.transmission) {
    items.push({
      label: "TRANSMISSION",
      value: String(specs.transmission),
    });
  }

  if (specs.condition) {
    items.push({
      label: "CONDITION",
      value: String(specs.condition),
    });
  }

  const knownKeys = new Set([
    "buildYear",
    "year",
    "engines",
    "engine",
    "maxMach",
    "rangeNauticalMiles",
    "range",
    "passengerCapacity",
    "passengers",
    "sleepingCapacity",
    "mileage",
    "horsepower",
    "power",
    "transmission",
    "condition",
  ]);

  Object.entries(specs).forEach(([key, val]) => {
    if (!knownKeys.has(key) && val !== null && val !== undefined && val !== "") {
      const formattedLabel = key
        .replace(/([A-Z])/g, " $1")
        .toUpperCase()
        .trim();
      items.push({
        label: formattedLabel,
        value: String(val),
      });
    }
  });

  return items;
}

export function getProductImages(product?: ListingItem): string[] {
  if (product?.media && product.media.length > 0) {
    return [...product.media]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((m) => m.url);
  }
  return [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
  ];
}

export interface VIPDetailsGalleryProps {
  product: ListingItem;
  productImages: string[];
  safeSelectedImage: number;
  onSelectImage: (index: number) => void;
  badgeLabel: string;
  isSaved: boolean;
  isSaving: boolean;
  onToggleSave: (e?: React.MouseEvent) => void;
}

export interface VIPDetailsSidebarProps {
  product: ListingItem;
  badgeLabel: string;
  locationText: string;
  formattedPrice: string;
  currencySymbol: string;
  askingPriceVal: number | null;
  startingBidVal: number | null;
  highestBidVal: number | null;
  totalBidsCountVal: number | null;
  existingOffer?: OfferDetailItem;
  specItems: SpecItemType[];
  sellerName: string;
  sellerInitial: string;
  sellerBadge: string;
  isSaved: boolean;
  isSaving: boolean;
  copied: boolean;
  onOpenOfferModal: () => void;
  onStartBidding: () => void;
  onToggleSave: (e?: React.MouseEvent) => void;
  onShare: () => void;
}

export interface VIPBiddingSidebarProps {
  product: ListingItem;
  badgeLabel: string;
  locationText: string;
  formattedPrice: string;
  rawPrice: number;
  specItems: SpecItemType[];
  existingOffer?: OfferDetailItem;
  sellerName: string;
  sellerInitial: string;
  sellerBadge: string;
  isSaved: boolean;
  isSaving: boolean;
  copied: boolean;
  onOpenOfferModal: () => void;
  onToggleSave: (e?: React.MouseEvent) => void;
  onShare: () => void;
  onExitBiddingMode: () => void;
}

export interface VIPOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ListingItem;
  existingOffer?: OfferDetailItem;
  rawPrice: number;
  onSuccess: () => void;
}
