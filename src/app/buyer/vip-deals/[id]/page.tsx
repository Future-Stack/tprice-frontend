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
  DollarSign,
  Loader2,
  X,
  Gavel,
} from "lucide-react";

import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useListingByIdQuery,
  useSaveListingMutation,
  useSavedListingsQuery,
} from "@/hooks/useListings";
import { useOffersQuery, useCreateOfferMutation } from "@/hooks/useOffers";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ListingItem } from "@/lib/api/listings";
import Image from "next/image";

/* ─── Helpers ─── */
const formatPrice = (
  amount: string | number | null | undefined,
  currency: string = "USD",
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
    if (
      !knownKeys.has(key) &&
      val !== null &&
      val !== undefined &&
      val !== ""
    ) {
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

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");

  const saveMutation = useSaveListingMutation();
  const token =
    Cookies.get("accessToken") ||
    Cookies.get("token") ||
    useAuthStore((state) => state.token);

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) },
  );

  const { data: offersResponse } = useOffersQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) },
  );

  const existingOffer = offersResponse?.data?.find(
    (off) =>
      String(off.listingId) === String(product?.id) ||
      String(off.listing?.id) === String(product?.id),
  );

  const createOfferMutation = useCreateOfferMutation();

  const isSavedInListings =
    savedResponse?.data?.some((savedItem) => savedItem.id === product?.id) ??
    false;
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

  const handleOpenOfferModal = () => {
    if (!token) {
      toast.error("Please sign in to submit an offer.");
      return;
    }
    if (existingOffer) {
      setOfferAmount(
        String(
          existingOffer.currentAmount || existingOffer.initialAmount || "",
        ),
      );
      setOfferNote((existingOffer as any).note || "");
    } else {
      const numericPrice = product?.askingPrice
        ? Number(product.askingPrice)
        : 0;
      setOfferAmount(numericPrice > 0 ? String(numericPrice) : "");
      setOfferNote("");
    }
    setIsOfferModalOpen(true);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    const numericAmount = parseFloat(offerAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: product.id,
        amount: numericAmount,
        note: offerNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsOfferModalOpen(false);
          toast.success(
            existingOffer
              ? "Offer updated successfully!"
              : "Offer submitted successfully!",
          );
        },
      },
    );
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
                Retry
              </button>
              <Link
                href={backLink}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_16px_rgba(231,143,35,0.3)]"
              >
                Back to VIP Deals
              </Link>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    );
  }

  // Media setup
  const productImages =
    product.media && product.media.length > 0
      ? product.media
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((m) => m.url)
      : [
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
        ];

  const safeSelectedImage =
    selectedImage < productImages.length ? selectedImage : 0;

  // Price calculations
  const rawPrice = product.askingPrice ? Number(product.askingPrice) : 0;
  const formattedPrice = formatPrice(product.askingPrice, product.currency);
  const currencySymbol = product.currency === "USD" || !product.currency ? "$" : `${product.currency} `;

  // Financial & Bidding properties parsing for conditional display
  const askingPriceVal =
    product?.askingPrice !== null &&
    product?.askingPrice !== undefined &&
    product?.askingPrice !== "" &&
    !isNaN(Number(product.askingPrice))
      ? Number(product.askingPrice)
      : null;

  const startingBidVal =
    product?.startingBid !== null &&
    product?.startingBid !== undefined &&
    product?.startingBid !== "" &&
    !isNaN(Number(product.startingBid))
      ? Number(product.startingBid)
      : null;

  const highestBidVal = (() => {
    if (product?.highestBid === null || product?.highestBid === undefined) return null;
    if (typeof product.highestBid === "object") {
      const num = Number(
        (product.highestBid as any).amount ?? (product.highestBid as any).price,
      );
      return !isNaN(num) && num > 0 ? num : null;
    }
    const num = Number(product.highestBid);
    return !isNaN(num) && num > 0 ? num : null;
  })();

  const totalBidsCountVal =
    product?.totalBidsCount !== null &&
    product?.totalBidsCount !== undefined &&
    typeof product.totalBidsCount === "number"
      ? product.totalBidsCount
      : null;
  const vipFeeNumber = rawPrice * 0.015;
  const formattedVipFee =
    rawPrice > 0
      ? `$${Math.round(vipFeeNumber).toLocaleString("en-US")}`
      : "Calculated at offer";

  const totalPayableNumber = rawPrice + vipFeeNumber;
  const formattedTotalPayable =
    rawPrice > 0
      ? `$${Math.round(totalPayableNumber).toLocaleString("en-US")}`
      : "Price on Request";

  // Location string
  const locationParts = [product.locationCity, product.locationCountry].filter(
    Boolean,
  );
  const locationText =
    locationParts.length > 0 ? locationParts.join(", ") : "Worldwide VIP";

  const specItems = getSpecItems(product);
  const badgeLabel =
    (product as any).badgeText || product.saleType || "VIP ASSET";

  // Seller details
  const sellerName = product.owner
    ? `${product.owner.firstName || ""} ${product.owner.lastName || ""}`.trim() ||
      "TPrice Concierge"
    : "TPrice Concierge";
  const sellerInitial = sellerName.charAt(0).toUpperCase();
  const sellerBadge = "Verified VIP Seller";

  return (
    <div className="mx-auto relative z-0">
      {/* Top Navigation */}
      <AnimationWrapper type="fade-down" duration={0.4}>
        <div className="mb-6">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group font-medium"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to VIP Deals</span>
          </Link>
        </div>
      </AnimationWrapper>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Gallery & Description */}
        <div className="flex-1 min-w-0">
          <AnimationWrapper type="fade-right" duration={0.5}>
            <div className="space-y-4">
              {/* Main Preview Image */}
              <div className="relative w-full h-102.25 rounded-2xl overflow-hidden bg-[#161618] border border-white/5 shadow-2xl">
                <Image
                  src={productImages[safeSelectedImage]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-[#E78F23] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                    {badgeLabel}
                  </span>
                  {product.category && (
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-white/10">
                      {product.category}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleToggleSave}
                  disabled={saveMutation.isPending}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Heart
                    className="w-5 h-5 text-primary"
                    fill={isSaved ? "#E78F23" : "none"}
                  />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        safeSelectedImage === idx
                          ? "border-primary scale-[1.02] shadow-lg shadow-[#E78F23]/20"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} view ${idx + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimationWrapper>

          {/* Description Section */}
          <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
            <div className="mt-10 space-y-4 bg-[#161618] border border-[#2C2C2E] rounded-2xl p-7">
              <h3 className="text-xl font-clash font-semibold text-white">
                Asset Overview
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                {product.description ||
                  "This off-market VIP asset is available exclusively to verified members. Complete privacy, escrow protection, and direct access to concierge negotiation are included."}
              </p>
            </div>
          </AnimationWrapper>
        </div>

        {/* Right Column: Pricing & Quick Actions Sidebar */}
        <div className="max-w-95 w-full shrink-0">
          {!isBiddingMode ? (
            <div className="space-y-6">
              {/* Header Info */}
              <AnimationWrapper type="fade-left" duration={0.5}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-[#E78F23]/20 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {badgeLabel}
                    </span>
                    {existingOffer && (
                      <span className="inline-block bg-teal-500/20 text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-teal-500/30">
                        Offer Submitted ($
                        {Number(
                          existingOffer.currentAmount ||
                            existingOffer.initialAmount,
                        ).toLocaleString()}
                        )
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-clash font-semibold text-white leading-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{locationText}</span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Price Card */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
                <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
                      Asking Price
                    </p>
                    <p className="text-3xl font-clash font-semibold text-primary">
                      {formattedPrice}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Includes VIP Concierge Inspection & Verification
                    </p>
                  </div>

                  {/* Conditional Property Details Breakdown */}
                  {(askingPriceVal !== null ||
                    startingBidVal !== null ||
                    highestBidVal !== null ||
                    totalBidsCountVal !== null) && (
                    <div className="bg-[#111111] border border-white/5 rounded-xl p-3.5 grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                      {askingPriceVal !== null && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                            Asking Price
                          </p>
                          <p className="text-sm font-medium text-white">
                            {currencySymbol}{askingPriceVal.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {startingBidVal !== null && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                            Starting Bid
                          </p>
                          <p className="text-sm font-medium text-white">
                            {currencySymbol}{startingBidVal.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {highestBidVal !== null && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                            Highest Bid
                          </p>
                          <p className="text-sm font-medium text-green-400">
                            {currencySymbol}{highestBidVal.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {totalBidsCountVal !== null && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                            Total Bids
                          </p>
                          <p className="text-sm font-medium text-white">
                            {totalBidsCountVal}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AnimationWrapper>

              {/* Main Actions */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.2}>
                <div className="space-y-3">
                  <button
                    onClick={handleOpenOfferModal}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    {existingOffer ? "Update My Offer" : "Make an Offer"}
                  </button>

                  <button
                    onClick={() => setIsBiddingMode(true)}
                    className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-4 h-4 text-primary" />
                    View Fee Breakdown & Bidding
                  </button>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={handleToggleSave}
                      disabled={saveMutation.isPending}
                      className={`flex items-center justify-center gap-2 py-3.5 bg-[#161618] text-white text-xs font-semibold rounded-xl border border-[#2C2C2E] hover:border-white/20 transition-all cursor-pointer ${
                        isSaved ? "text-primary border-primary/50" : ""
                      }`}
                    >
                      <Heart
                        className="w-4 h-4 text-primary"
                        fill={isSaved ? "#E78F23" : "none"}
                      />
                      {isSaved ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-3.5 bg-[#161618] text-white text-xs font-semibold rounded-xl border border-[#2C2C2E] hover:border-white/20 transition-all cursor-pointer"
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

              {/* Key Specifications */}
              <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
                <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Info className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-white">
                      Key Specifications
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    {specItems.length > 0 ? (
                      specItems.map((item, idx) => (
                        <SpecItem
                          key={idx}
                          label={item.label}
                          value={item.value}
                        />
                      ))
                    ) : (
                      <>
                        <SpecItem
                          label="YEAR"
                          value={String(product.buildYear || 2024)}
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
                      <Image
                        src={product.owner.avatarUrl}
                        alt={sellerName}
                        className="w-11 h-11 rounded-full object-cover border border-[#3C3C3E]"
                        width={44}
                        height={44}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#2C2C2E] font-inter flex items-center justify-center text-primary font-bold text-lg border border-[#3C3C3E]">
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
                  <span className="inline-block bg-[#E78F23]/20 text-primary text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider mb-3">
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
                        <p className="text-[32px] font-clash font-medium text-primary leading-none mb-1 tracking-tight">
                          {formattedTotalPayable}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Asking: {formattedPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E78F23]/10 rounded-full border border-[#E78F23]/20">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(231,143,35,0.6)]" />
                    <span className="text-[9px] text-primary font-bold uppercase tracking-widest">
                      VIP reduced fee applied
                    </span>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Attributes Grid */}
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

              {/* Seller */}
              <AnimationWrapper type="fade-up" duration={0.5} delay={0.3}>
                <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/3">
                  {product.owner?.avatarUrl ? (
                    <Image
                      src={product.owner.avatarUrl}
                      alt={sellerName}
                      className="w-10 h-10 rounded-full object-cover border border-white/5"
                      width={40}
                      height={40}
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
                    onClick={handleOpenOfferModal}
                    className="w-full py-4.5 bg-primary hover:brightness-110 text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98] cursor-pointer"
                  >
                    {existingOffer ? "Update My Offer" : "Make an Offer"}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleToggleSave}
                      disabled={saveMutation.isPending}
                      className={`flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors ${
                        isSaved ? "text-primary" : ""
                      }`}
                    >
                      <Heart
                        className="w-4 h-4 text-primary"
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

      {/* ─── MAKE AN OFFER MODAL ─── */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6 p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-clash font-semibold text-white">
                    {existingOffer ? "Update Your Offer" : "Make an Offer"}
                  </h3>
                  <p className="text-xs text-gray-400">{product.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Offer Amount (USD)
                  </label>
                  {rawPrice > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Asking: {formattedPrice}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setOfferAmount(String(Math.round(rawPrice * 0.95)))
                        }
                        className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                      >
                        -5%
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setOfferAmount(String(Math.round(rawPrice * 0.9)))
                        }
                        className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                      >
                        -10%
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="e.g. 900000"
                    className="w-full pl-9 pr-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white font-medium text-base outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Note / Terms Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Note / Special Terms{" "}
                  <span className="text-gray-500 font-normal lowercase">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  placeholder="Add any details about payment timeline, escrow verification, or delivery..."
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Dynamic VIP Fee estimate summary */}
              {Boolean(parseFloat(offerAmount)) &&
                parseFloat(offerAmount) > 0 && (
                  <div className="bg-[#111111] border border-white/5 p-3.5 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between text-gray-400">
                      <span>Offer Amount</span>
                      <span className="text-white font-medium">
                        ${parseFloat(offerAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Estimated VIP Fee (1.5%)</span>
                      <span className="text-white font-medium">
                        $
                        {Math.round(
                          parseFloat(offerAmount) * 0.015,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-white/5 flex justify-between font-semibold">
                      <span className="text-gray-300">Total Commitment</span>
                      <span className="text-primary">
                        $
                        {Math.round(
                          parseFloat(offerAmount) * 1.015,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  disabled={createOfferMutation.isPending}
                  className="px-5 py-3 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOfferMutation.isPending}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_16px_rgba(231,143,35,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createOfferMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {createOfferMutation.isPending
                    ? "Submitting..."
                    : existingOffer
                      ? "Update Offer"
                      : "Submit Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
