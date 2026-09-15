import { ListingItem } from "@/lib/api/listings";
import { SpecItemData, VIPViewModel } from "./types";

export const formatPrice = (
  amount: string | number | null | undefined,
  currency: string = "USD"
): string => {
  if (!amount) return "Price on Request";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Price on Request";

  const symbol = currency === "USD" ? "$" : currency + " ";
  return `${symbol}${num.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
};

export const getSpecItems = (listing: ListingItem): SpecItemData[] => {
  const specs = listing.specifications || {};
  const items: SpecItemData[] = [];

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
};

export const getVIPViewModel = (product: ListingItem, inclFees: boolean): VIPViewModel => {
  const productImages =
    product.media && product.media.length > 0
      ? product.media
          .slice()
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((m) => m.url)
      : [
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
        ];

  const locationText =
    [product.locationCity, product.locationCountry].filter(Boolean).join(", ") ||
    "Location on Request";

  const badgeLabel = product.isOffMarket
    ? "OFF MARKET VIP"
    : product.saleType === "AUCTION"
      ? "AUCTION"
      : product.category || "VIP ASSET";

  const rawPriceNum = parseFloat(product.askingPrice || product.startingBid || "0");
  const formattedPrice = formatPrice(product.askingPrice || product.startingBid, product.currency);
  const currentBidLabel = product.saleType === "AUCTION" ? "CURRENT BID" : "ASKING PRICE";

  const sellerName = product.owner
    ? `${product.owner.firstName || ""} ${product.owner.lastName || ""}`.trim() || "Verified Dealer"
    : "Monaco Exotics";
  const sellerBadge = product.owner?.isVerified
    ? "Verified Premium Dealer"
    : product.owner?.role || "Dealer";
  const sellerInitial =
    product.owner?.firstName?.[0]?.toUpperCase() ||
    product.owner?.lastName?.[0]?.toUpperCase() ||
    "D";

  const specItems = getSpecItems(product);

  const overviewText =
    product.description ||
    `${product.title} represents an exceptional ${product.category}${
      product.subCategory ? ` (${product.subCategory})` : ""
    } available for acquisition. Meticulously maintained with complete documentation and providence available upon request for verified buyers.`;

  const vipFee = rawPriceNum * 0.015;
  const totalPayableNum = inclFees ? rawPriceNum + vipFee : rawPriceNum;
  const formattedVipFee = formatPrice(vipFee, product.currency);
  const formattedTotalPayable = formatPrice(totalPayableNum, product.currency);

  return {
    productImages,
    locationText,
    badgeLabel,
    formattedPrice,
    currentBidLabel,
    sellerName,
    sellerBadge,
    sellerInitial,
    specItems,
    overviewText,
    formattedVipFee,
    formattedTotalPayable,
  };
};
