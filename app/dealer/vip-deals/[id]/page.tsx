"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  MapPin,
  Info,
  BadgeCheck,
  ChevronLeft,
  Heart,
  Share2,
  AlertCircle,
  RefreshCw,
  Check,
} from "lucide-react";

import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useListingByIdQuery,
  useSaveListingMutation,
  useSavedListingsQuery,
} from "@/hooks/useListings";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ListingItem } from "@/lib/api/listings";

/* ─── Helpers ─── */
const formatPrice = (
  amount: string | number | null | undefined,
  currency: string = "USD"
) => {
  if (!amount) return "Price on Request";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Price on Request";

  const symbol = currency === "USD" ? "$" : currency + " ";
  return `${symbol}${num.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
};

const getSpecItems = (listing: ListingItem) => {
  const specs = listing.specifications || {};
  const items: { label: string; value: string }[] = [];

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

  // Include any other key specs not explicitly formatted above
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
      const formattedLabel = key.replace(/([A-Z])/g, " $1").toUpperCase().trim();
      items.push({
        label: formattedLabel,
        value: String(val),
      });
    }
  });

  return items;
};

export default function VIPDetailsPage() {
  const params = useParams();
  const pathname = usePathname();
  const idOrSlug = (params?.id as string) || "";

  const isDealerPath = pathname?.startsWith("/dealer");
  const backLink = isDealerPath ? "/dealer/vip-deals" : "/buyer/vip-deals";

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useListingByIdQuery(idOrSlug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [inclFees, setInclFees] = useState(true);
  const [isBiddingMode, setIsBiddingMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveMutation = useSaveListingMutation();
  const token = Cookies.get("access_token") || useAuthStore((state) => state.token);

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const isSavedInListings =
    savedResponse?.data?.some((savedItem) => savedItem.id === product?.id) ?? false;
  const isSaved =
    product?.isSaved !== undefined ? product.isSaved : isSavedInListings;

  const handleToggleSave = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!product?.id) return;
    if (!token) {
      toast.error("Please sign in to save listings to your favorites.");
      return;
    }
    saveMutation.mutate(product.id);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Listing URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return <VIPDetailsSkeleton backLink={backLink} />;
  }

  if (isError || !product) {
    return (
      <div className="mx-auto relative z-0 py-16 text-center">
        <AnimationWrapper type="fade-up" duration={0.5}>
          <div className="bg-[#161618] border border-[#2C2C2E] rounded-3xl p-10 max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-clash font-semibold text-white">
                VIP Listing Not Found
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {(error as any)?.response?.data?.message ||
                  error?.message ||
                  "The VIP listing you are looking for is currently unavailable or does not exist."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition-all border border-white/10 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href={backLink}
                className="px-5 py-2.5 bg-[#E78F23] hover:bg-[#E78F23]/90 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_16px_rgba(231,143,35,0.3)]"
              >
                Back to VIP Deals
              </Link>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    );
  }

  // Extract images from API media array or fallback
  const productImages =
    product.media && product.media.length > 0
      ? product.media
          .slice()
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((m) => m.url)
      : [
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
        ];

  const activeImageSrc = productImages[selectedImage] || productImages[0];

  // Location string
  const locationText =
    [product.locationCity, product.locationCountry].filter(Boolean).join(", ") ||
    "Location on Request";

  // Badge label
  const badgeLabel = product.isOffMarket
    ? "OFF MARKET VIP"
    : product.saleType === "AUCTION"
    ? "AUCTION"
    : product.category || "VIP ASSET";

  // Price formatting
  const rawPriceNum = parseFloat(product.askingPrice || product.startingBid || "0");
  const formattedPrice = formatPrice(
    product.askingPrice || product.startingBid,
    product.currency
  );
  const currentBidLabel =
    product.saleType === "AUCTION" ? "CURRENT BID" : "ASKING PRICE";

  // Seller mapping
  const sellerName = product.owner
    ? `${product.owner.firstName || ""} ${product.owner.lastName || ""}`.trim() ||
      "Verified Dealer"
    : "Monaco Exotics";
  const sellerBadge = product.owner?.isVerified
    ? "Verified Premium Dealer"
    : product.owner?.role || "Dealer";
  const sellerInitial =
    product.owner?.firstName?.[0]?.toUpperCase() ||
    product.owner?.lastName?.[0]?.toUpperCase() ||
    "D";

  // Key Specifications
  const specItems = getSpecItems(product);

  // Overview description
  const overviewText =
    product.description ||
    `${product.title} represents an exceptional ${product.category}${
      product.subCategory ? ` (${product.subCategory})` : ""
    } available for acquisition. Meticulously maintained with complete documentation and providence available upon request for verified buyers.`;

  // Bidding fee calculations
  const vipFee = rawPriceNum * 0.015;
  const totalPayableNum = inclFees ? rawPriceNum + vipFee : rawPriceNum;
  const formattedVipFee = formatPrice(vipFee, product.currency);
  const formattedTotalPayable = formatPrice(totalPayableNum, product.currency);

  return (
    <div className="mx-auto relative z-0">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-[40px] font-clash font-semibold">
              Exclusive Collection
            </h2>
            <p className="text-white text-[20px] mt-1 font-medium">
              Discover the world&apos;s finest assets available for acquisition.
            </p>
          </div>
        </AnimationWrapper>
      </div>

      {/* ── Back link ── */}
      <AnimationWrapper type="fade-right" duration={0.4} delay={0.15}>
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#E78F23] text-sm font-medium mb-6 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to VIP Deals
        </Link>
      </AnimationWrapper>

      {/* ── Product Layout: Image + Details ── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left — Gallery */}
        <div className="flex-1 min-w-0">
          {/* Main Image */}
          <AnimationWrapper type="zoom" duration={0.6} delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden bg-black w-full max-h-102.25 group">
              <img
                src={activeImageSrc}
                alt={product.title}
                className="w-full h-102.25 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Floating actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleToggleSave}
                  className={`w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/10 ${
                    isSaved ? "text-red-500" : "text-white/80 hover:text-red-400"
                  }`}
                  title={isSaved ? "Remove from Saved" : "Save Listing"}
                >
                  <Heart
                    className="w-4.5 h-4.5"
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-[#E78F23] transition-colors border border-white/10"
                  title="Share Listing"
                >
                  {copied ? (
                    <Check className="w-4.5 h-4.5 text-green-400" />
                  ) : (
                    <Share2 className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </AnimationWrapper>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {productImages.map((img, idx) => (
                <AnimationWrapper
                  key={idx}
                  type="fade-up"
                  duration={0.4}
                  delay={0.15 + idx * 0.05}
                >
                  <button
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                      selectedImage === idx
                        ? "border-[#E78F23] shadow-[0_0_12px_rgba(231,143,35,0.3)]"
                        : "border-[#2C2C2E] hover:border-[#E78F23]/40 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </AnimationWrapper>
              ))}
            </div>
          )}

          {/* Overview Section */}
          <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
            <div className="mt-10">
              <h3 className="text-xl font-clash font-bold mb-4">Overview</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl whitespace-pre-line">
                {overviewText}
              </p>
            </div>
          </AnimationWrapper>
        </div>

        {/* Right — Details Sidebar */}
        <div className="max-w-95 w-full shrink-0">
          {!isBiddingMode ? (
            <div className="space-y-5">
              {/* Auction Badge & Title */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
                <div>
                  <span className="inline-block bg-[#E78F23]/10 text-[#E78F23] text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 border border-[#E78F23]/20">
                    {badgeLabel}
                  </span>
                  <h2 className="text-[32px] font-clash font-medium tracking-tight leading-tight text-white">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2.5 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="font-medium">{locationText}</span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Price */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.15}>
                <div className="pt-2">
                  <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1">
                    {currentBidLabel}
                  </p>
                  <p className="text-3xl font-inter font-medium text-[#E78F23]">
                    {formattedPrice}
                  </p>
                </div>
              </AnimationWrapper>

              {/* Action Buttons */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.2}>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => setIsBiddingMode(true)}
                    className="w-full py-4 bg-[#E78F23] hover:bg-[#E78F23]/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide"
                  >
                    Place Bid
                  </button>
                  <button
                    onClick={() => {
                      toast.info("Sending counter offer process initiated");
                      setIsBiddingMode(true);
                    }}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all border border-white/10 active:scale-[0.98] capitalize tracking-wide"
                  >
                    send offer
                  </button>
                </div>
              </AnimationWrapper>

              {/* Key Specifications */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
                <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Info className="w-4 h-4 text-[#E78F23]" />
                    <h4 className="text-sm font-semibold text-white">
                      Key Specifications
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    {specItems.length > 0 ? (
                      specItems.map((item, idx) => (
                        <SpecItem key={idx} label={item.label} value={item.value} />
                      ))
                    ) : (
                      <>
                        <SpecItem
                          label="YEAR"
                          value={String(product.buildYear || 2023)}
                        />
                        <SpecItem
                          label="CATEGORY"
                          value={product.category || "VIP Asset"}
                        />
                        <SpecItem label="CONDITION" value="Pristine" />
                      </>
                    )}
                  </div>
                </div>
              </AnimationWrapper>

              {/* Seller Information */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.3}>
                <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6">
                  <h4 className="text-sm font-semibold mb-5 text-white">
                    Seller Information
                  </h4>
                  <div className="flex items-center gap-4">
                    {product.owner?.avatarUrl ? (
                      <img
                        src={product.owner.avatarUrl}
                        alt={sellerName}
                        className="w-11 h-11 rounded-full object-cover border border-[#3C3C3E]"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#2C2C2E] font-inter flex items-center justify-center text-[#E78F23] font-bold text-lg border border-[#3C3C3E]">
                        {sellerInitial}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[15px] text-white">
                        {sellerName}
                      </p>
                      <p className="text-xs text-green-400/90 flex items-center gap-1.5 mt-1 font-medium">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {sellerBadge}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimationWrapper>
            </div>
          ) : (
            /* ── Bidding Mode Sidebar ── */
            <div className="space-y-6">
              {/* Header */}
              <AnimationWrapper type="fade-down" duration={0.4}>
                <div>
                  <span className="inline-block bg-[#E78F23]/20 text-[#E78F23] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
                    {badgeLabel}
                  </span>
                  <h2 className="text-3xl font-clash font-semibold text-white">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locationText}</span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Price Summary Card */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
                <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Price Summary
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                        Show total incl. fees
                      </span>
                      <button
                        onClick={() => setInclFees(!inclFees)}
                        className={`w-10 h-5.5 rounded-full relative transition-all duration-300 ${
                          inclFees ? "bg-white" : "bg-[#2C2C2E]"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                            inclFees ? "left-5.5 bg-black" : "left-1 bg-white"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm tracking-tight">
                      <span className="text-gray-400">Current Price</span>
                      <span className="text-white font-medium">
                        {formattedPrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">VIP Fee (1.5%)</span>
                        <Info className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      <span className="text-white font-medium">
                        {formattedVipFee}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-400 mt-1">
                        Total Payable
                      </span>
                      <div className="text-right">
                        <p className="text-[32px] font-clash font-medium text-[#E78F23] leading-none mb-1 tracking-tight">
                          {formattedTotalPayable}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Asking: {formattedPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
                    <div className="w-1.5 h-1.5 bg-[#E78F23] rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
                    <span className="text-[9px] text-[#E78F23] font-bold uppercase tracking-widest">
                      VIP reduced fee applied
                    </span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Attributes Grid (image style 2x2) */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
                <div className="grid grid-cols-2 gap-3">
                  {specItems.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#161618] rounded-xl p-4 border border-white/3"
                    >
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-[15px] font-medium text-white truncate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                  {specItems.length < 4 && (
                    <div className="bg-[#161618] rounded-xl p-4 border border-white/3">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                        CATEGORY
                      </p>
                      <p className="text-[15px] font-medium text-white truncate">
                        {product.category || "VIP Deal"}
                      </p>
                    </div>
                  )}
                </div>
              </AnimationWrapper>

              {/* Seller - image style */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.3}>
                <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/3">
                  {product.owner?.avatarUrl ? (
                    <img
                      src={product.owner.avatarUrl}
                      alt={sellerName}
                      className="w-10 h-10 rounded-full object-cover border border-white/5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm border border-white/5">
                      {sellerInitial}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white leading-none mb-1">
                      {sellerName}
                    </p>
                    <p className="text-[11px] text-green-500/80 flex items-center gap-1.5 font-medium">
                      <BadgeCheck className="w-3 h-3" />
                      {sellerBadge}
                    </p>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Bidding Actions */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.4}>
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      toast.success(
                        "Your bid has been submitted successfully to the seller!"
                      );
                    }}
                    className="w-full py-4.5 bg-[#E78F23] hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98]"
                  >
                    Place Bid
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleToggleSave}
                      className={`flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors ${
                        isSaved ? "text-[#E78F23]" : ""
                      }`}
                    >
                      <Heart
                        className="w-4 h-4 text-[#E78F23]"
                        fill={isSaved ? "#E78F23" : "none"}
                      />
                      {isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Share2 className="w-4 h-4 text-gray-400" />
                      )}
                      {copied ? "Copied" : "Share"}
                    </button>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Cancel / Back Link */}
              <button
                onClick={() => setIsBiddingMode(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors pt-2 font-medium"
              >
                Go Back to Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components & Skeletons ─── */
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-white truncate">{value}</p>
    </div>
  );
}

function VIPDetailsSkeleton({ backLink }: { backLink: string }) {
  return (
    <div className="mx-auto relative z-0 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="h-10 w-72 bg-white/10 rounded-lg mb-2" />
          <div className="h-6 w-96 max-w-full bg-white/5 rounded-md" />
        </div>
      </div>

      {/* Back link Skeleton */}
      <div className="h-5 w-36 bg-white/5 rounded-md mb-6" />

      {/* Product Layout Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left — Gallery Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="w-full h-102.25 rounded-2xl bg-white/10 border border-white/5" />
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="w-25 h-18 rounded-xl bg-white/10 border border-white/5" />
            <div className="w-25 h-18 rounded-xl bg-white/5 border border-white/5" />
            <div className="w-25 h-18 rounded-xl bg-white/5 border border-white/5" />
          </div>

          <div className="mt-10 space-y-3">
            <div className="h-7 w-32 bg-white/10 rounded-md" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
          </div>
        </div>

        {/* Right — Details Sidebar Skeleton */}
        <div className="max-w-95 w-full shrink-0 space-y-5">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-[#E78F23]/10 rounded-md border border-[#E78F23]/20" />
            <div className="h-9 w-4/5 bg-white/10 rounded-lg" />
            <div className="h-5 w-1/2 bg-white/5 rounded" />
          </div>

          <div className="pt-2 space-y-2">
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-9 w-48 bg-[#E78F23]/20 rounded-lg" />
          </div>

          <div className="flex gap-3">
            <div className="h-14 flex-1 bg-[#E78F23]/30 rounded-xl" />
            <div className="h-14 flex-1 bg-white/10 rounded-xl" />
          </div>

          <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2 space-y-5">
            <div className="h-5 w-36 bg-white/10 rounded-md" />
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-white/5 rounded" />
                <div className="h-5 w-20 bg-white/10 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-5 w-24 bg-white/10 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-14 bg-white/5 rounded" />
                <div className="h-5 w-16 bg-white/10 rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-12 bg-white/5 rounded" />
                <div className="h-5 w-20 bg-white/10 rounded" />
              </div>
            </div>
          </div>

          <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 space-y-4">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-[#3C3C3E]" />
              <div className="space-y-2">
                <div className="h-4 w-28 bg-white/10 rounded" />
                <div className="h-3 w-24 bg-green-500/20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
