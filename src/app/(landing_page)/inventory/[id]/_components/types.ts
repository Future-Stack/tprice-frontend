import type { ListingItem, ListingMedia, ListingSpecifications } from "@/lib/api/listings";
import type { OfferDetailItem } from "@/lib/api/offers";

export type { ListingItem, ListingMedia, ListingSpecifications, OfferDetailItem };

export interface FormattedSpecItem {
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

export function getDisplaySpecs(specs?: ListingSpecifications): FormattedSpecItem[] {
  if (!specs) {
    return [
      { label: "Engine", value: "High-Performance V8 / Electric Hybrid" },
      { label: "Transmission", value: "Automatic Dual-Clutch" },
      { label: "Exterior Color", value: "Rosso Corsa" },
      { label: "Interior Color", value: "Premium Leather" },
    ];
  }

  const formattedSpecsList: FormattedSpecItem[] = [];

  // Standard keys priority
  if (specs.engine) {
    formattedSpecsList.push({ label: "Engine", value: formatSpecValue("engine", specs.engine) });
  }
  if (specs.mileage) {
    formattedSpecsList.push({ label: "Mileage", value: formatSpecValue("mileage", specs.mileage) });
  }
  if (specs.horsepower) {
    formattedSpecsList.push({
      label: "Horsepower",
      value: formatSpecValue("horsepower", specs.horsepower),
    });
  }
  if (specs.transmission) {
    formattedSpecsList.push({
      label: "Transmission",
      value: formatSpecValue("transmission", specs.transmission),
    });
  }
  if (specs.exteriorColor) {
    formattedSpecsList.push({
      label: "Exterior Color",
      value: formatSpecValue("exteriorColor", specs.exteriorColor),
    });
  }
  if (specs.interiorColor) {
    formattedSpecsList.push({
      label: "Interior Color",
      value: formatSpecValue("interiorColor", specs.interiorColor),
    });
  }

  // Add any additional dynamic specification keys
  Object.entries(specs).forEach(([k, v]) => {
    if (
      ![
        "engine",
        "mileage",
        "horsepower",
        "transmission",
        "exteriorColor",
        "interiorColor",
      ].includes(k) &&
      v !== null &&
      v !== undefined &&
      v !== ""
    ) {
      formattedSpecsList.push({
        label: formatSpecKey(k),
        value: formatSpecValue(k, v),
      });
    }
  });

  return formattedSpecsList.length > 0
    ? formattedSpecsList
    : [
        { label: "Engine", value: "High-Performance V8 / Electric Hybrid" },
        { label: "Transmission", value: "Automatic Dual-Clutch" },
        { label: "Exterior Color", value: "Rosso Corsa" },
        { label: "Interior Color", value: "Premium Leather" },
      ];
}

export function parseHighestBid(highestBid: unknown): number | null {
  if (highestBid === null || highestBid === undefined) return null;
  if (typeof highestBid === "object") {
    const obj = highestBid as { amount?: unknown; price?: unknown };
    const num = Number(obj.amount ?? obj.price);
    return !isNaN(num) && num > 0 ? num : null;
  }
  const num = Number(highestBid);
  return !isNaN(num) && num > 0 ? num : null;
}

export function getErrorMessage(error: unknown): string {
  if (!error) return "The requested luxury listing could not be retrieved or has been removed.";
  if (typeof error === "object" && error !== null) {
    const errObj = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (errObj.response?.data?.message) return errObj.response.data.message;
    if (errObj.message) return errObj.message;
  }
  return "The requested luxury listing could not be retrieved or has been removed.";
}

export function getMediaList(media?: ListingMedia[]): { type: "image" | "video"; url: string }[] {
  if (media && media.length > 0) {
    return [...media]
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((m) => ({
        type: (m.type?.toLowerCase() === "video" ? "video" : "image") as "video" | "image",
        url: m.url,
      }));
  }
  return [
    {
      type: "image" as const,
      url: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
  ];
}

export interface InventoryHeaderCardProps {
  item: ListingItem;
  locationText: string;
  formattedPrice: string;
}

export interface InventoryOverviewSectionProps {
  item: ListingItem;
}

export interface InventoryBiddingCardProps {
  item: ListingItem;
  currencySymbol: string;
  isAuction: boolean;
  isFixedPrice: boolean;
  allowCounterOffers: boolean;
  highestBidVal: number | null;
  startingBidVal: number | null;
  totalBidsCountVal: number | null;
  existingOffer?: OfferDetailItem;
  isOffersLoading: boolean;
  onOpenPlaceBid: () => void;
  onOpenSendOffer: () => void;
  onOpenCounterOffer: () => void;
}

export interface InventorySidebarProps {
  item: ListingItem;
  ownerName: string;
  locationText: string;
  isSaved: boolean;
  isSaving: boolean;
  onToggleSave: () => void;
  biddingSection: React.ReactNode;
}

export interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ListingItem;
  existingOffer?: OfferDetailItem;
  highestBidVal: number | null;
  startingBidVal: number | null;
  formattedPrice: string;
  currencySymbol: string;
  onSuccess: () => void;
}

export interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ListingItem;
  numericPrice: number;
  formattedPrice: string;
  onSuccess: () => void;
}

export interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ListingItem;
  existingOffer?: OfferDetailItem;
  numericPrice: number;
  formattedPrice: string;
  currencySymbol: string;
  onSuccess: () => void;
}
