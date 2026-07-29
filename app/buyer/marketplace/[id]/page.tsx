"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Info,
  BadgeCheck,
  ChevronLeft,
  Heart,
  Share2,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Lock,
  X,
  Send,
  Clock,
  Loader2,
  DollarSign,
  ArrowUpRight,
  Gavel,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";

import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useListingByIdQuery, useSaveListingMutation, useSavedListingsQuery } from "@/hooks/useListings";
import { useOffersQuery, useCreateOfferMutation } from "@/hooks/useOffers";
import { useAuthStore } from "@/lib/store/useAuthStore";

/* ─── Helper utilities for dynamic key-value specifications ─── */
function formatSpecKey(key: string): string {
  const formatted = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatSpecValue(key: string, val: any): string {
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
  if (lowerKey.includes("mileage") && !strVal.toLowerCase().includes("mi"))
    return `${strVal} mi`;
  if ((lowerKey.includes("horsepower") || lowerKey.includes("power")) && !strVal.toLowerCase().includes("hp"))
    return `${strVal} hp`;

  return strVal;
}

export default function BuyerListingDetailPage() {
  const params = useParams();
  const idOrSlug = (params?.id as string) || "";

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

  // Offer & Bid modal states
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isViewOfferModalOpen, setIsViewOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>("");
  const [offerNote, setOfferNote] = useState<string>("");

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidNote, setBidNote] = useState<string>("");

  const saveMutation = useSaveListingMutation();
  const createOfferMutation = useCreateOfferMutation();
  const token = Cookies.get("access_token") || useAuthStore((state) => state.token);

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const { data: userOffersData, isLoading: isUserOffersLoading } = useOffersQuery(
    { limit: 100 },
    { enabled: Boolean(token) }
  );

  const existingOffer = userOffersData?.data?.find(
    (offer) =>
      offer.listingId === product?.id || offer.listing?.id === product?.id
  );

  const isSavedInListings = savedResponse?.data?.some((savedItem) => savedItem.id === product?.id) ?? false;
  const isSaved = product?.isSaved !== undefined ? product.isSaved : isSavedInListings;

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

  const handleOpenSendOfferModal = () => {
    if (!token) {
      toast.error("Please sign in to send an offer.");
      return;
    }
    const initialPrice = product?.askingPrice ? Number(product.askingPrice) : 0;
    setOfferAmount(initialPrice > 0 ? String(initialPrice) : "");
    setOfferNote(
      "Flexible on delivery timeline and ready to complete escrow verification."
    );
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
        },
      }
    );
  };

  const handleOpenPlaceBidModal = () => {
    if (!token) {
      toast.error("Please sign in to place a bid.");
      return;
    }
    const currentVal = existingOffer
      ? Number(existingOffer.currentAmount || existingOffer.initialAmount)
      : product?.startingBid
      ? Number(product.startingBid)
      : product?.askingPrice
      ? Number(product.askingPrice)
      : 0;

    // Suggested min bid: if existing bid present, suggest +5%, else current starting bid
    const suggested = existingOffer
      ? Math.round(currentVal * 1.05)
      : currentVal > 0
      ? currentVal
      : 1000;
    setBidAmount(String(suggested));
    setBidNote("Escrow verified bidder ready to complete verification.");
    setIsBidModalOpen(true);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const currentVal = existingOffer
      ? Number(existingOffer.currentAmount || existingOffer.initialAmount)
      : 0;

    if (existingOffer && numericAmount <= currentVal) {
      toast.error(
        `Your new bid must be higher than your current bid of $${currentVal.toLocaleString()}`
      );
      return;
    }

    createOfferMutation.mutate(
      {
        listingId: product.id,
        amount: numericAmount,
        note: bidNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsBidModalOpen(false);
          toast.success(
            existingOffer ? "Bid increased successfully!" : "Bid placed successfully!"
          );
        },
      }
    );
  };

  // Extract images or use fallback
  const productImages =
    product?.media && product.media.length > 0
      ? product.media
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((m) => m.url)
      : [
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
        ];

  // Safely clamp selected image index
  const safeSelectedImage =
    selectedImage < productImages.length ? selectedImage : 0;

  // Price formatting
  const numericPrice = product?.askingPrice ? Number(product.askingPrice) : 0;
  const currencySymbol =
    product?.currency === "USD" || !product?.currency
      ? "$"
      : `${product.currency} `;
  const formattedPrice =
    numericPrice > 0
      ? `${currencySymbol}${numericPrice.toLocaleString()}`
      : "Price on Request";

  // Sale type classification
  const normalizedSaleType = (product?.saleType || "").toUpperCase();
  const isAuction =
    normalizedSaleType === "AUCTION" ||
    (Boolean(product?.startingBid) &&
      normalizedSaleType !== "FIXED_PRICE" &&
      normalizedSaleType !== "PRIVATE_SALE" &&
      normalizedSaleType !== "PRIVATE");
  const isPrivateSale =
    normalizedSaleType === "PRIVATE_SALE" || normalizedSaleType === "PRIVATE";
  const isFixedPrice = !isAuction && !isPrivateSale;

  // Calculations for bidding mode
  const vipFeeRate = 0.015;
  const vipFee = Math.round(numericPrice * vipFeeRate);
  const totalPayable = inclFees ? numericPrice + vipFee : numericPrice;

  // Location string
  const locationText =
    [product?.locationCity, product?.locationCountry]
      .filter(Boolean)
      .join(", ") || "Miami, United States";

  // Seller info
  const sellerName = product?.owner
    ? `${product.owner.firstName} ${product.owner.lastName}`
    : "Monaco Exotics";
  const sellerInitial = product?.owner?.firstName?.[0] || "M";

  // Dynamic specifications key-value extraction
  const dynamicSpecs: { label: string; value: string }[] = [];

  if (
    product?.buildYear &&
    !product?.specifications?.year &&
    !product?.specifications?.buildYear
  ) {
    dynamicSpecs.push({
      label: "YEAR",
      value: String(product.buildYear),
    });
  }

  if (product?.specifications && typeof product.specifications === "object") {
    Object.entries(product.specifications).forEach(([rawKey, val]) => {
      if (val !== null && val !== undefined && val !== "") {
        dynamicSpecs.push({
          label: formatSpecKey(rawKey),
          value: formatSpecValue(rawKey, val),
        });
      }
    });
  }

  // Overview / Description text
  const overviewText =
    (product as any)?.description ||
    (product as any)?.overview ||
    (product
      ? `This immaculate ${product.buildYear || ""} ${product.title} represents the pinnacle of luxury and performance. ${
          product.specifications?.engine
            ? `Powered by a ${product.specifications.engine}`
            : ""
        }${product.specifications?.horsepower ? ` generating ${product.specifications.horsepower} HP` : ""}. Meticulously maintained and stored in a climate-controlled environment, it stands ready for its next owner.`
      : "");

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
          href="/buyer/marketplace"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-medium mb-6 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Marketplace
        </Link>
      </AnimationWrapper>

      {/* ── Error State ── */}
      {isError && (
        <AnimationWrapper type="zoom" duration={0.4}>
          <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-8 mb-8 text-center max-w-3xl mx-auto">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Failed to load product details
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {(error as any)?.response?.data?.message ||
                error?.message ||
                "An unexpected error occurred while fetching product details."}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary text-black font-semibold text-sm rounded-xl transition-all shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </AnimationWrapper>
      )}

      {/* ── Skeleton Loading State ── */}
      {isLoading ? (
        <ProductDetailsSkeleton />
      ) : product ? (
        /* ── Product Layout: Image + Details ── */
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — Gallery */}
          <div className="flex-1 min-w-0">
            {/* Main Image aspect-16/10*/}
            <AnimationWrapper type="zoom" duration={0.6} delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden bg-black w-full max-h-102.25 group">
                <img
                  src={productImages[safeSelectedImage]}
                  alt={product.title}
                  className="w-full h-[409px] object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
                {/* Floating actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleToggleSave}
                    disabled={saveMutation.isPending}
                    className={`w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/10 cursor-pointer ${
                      isSaved
                        ? "text-red-500"
                        : "text-white/80 hover:text-red-400"
                    }`}
                  >
                    <Heart
                      className="w-4.5 h-4.5"
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && navigator.share) {
                        navigator.share({
                          title: product.title,
                          url: window.location.href,
                        });
                      } else if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-primary transition-colors border border-white/10 cursor-pointer"
                  >
                    <Share2 className="w-4.5 h-4.5" />
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
                      className={`relative w-25 h-18 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer ${
                        safeSelectedImage === idx
                          ? "border-primary shadow-[0_0_12px_rgba(231,143,35,0.3)]"
                          : "border-[#2C2C2E] hover:border-[#E78F23]/40 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
                        }}
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
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                  {overviewText}
                </p>
              </div>
            </AnimationWrapper>
          </div>

          {/* Right — Details Sidebar */}
          <div className="max-w-95 w-full shrink-0">
            {!isBiddingMode ? (
              <div className="space-y-5">
                {/* Auction/Category Badge & Title */}
                <AnimationWrapper type="fade-left" duration={0.5} delay={0.1}>
                  <div>
                    <span className="inline-block bg-[#E78F23]/10 text-primary text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 border border-[#E78F23]/20">
                      {product.subCategory || product.category || "EXOTIC"}
                    </span>
                    <h2 className="text-[32px] font-clash font-medium tracking-tight leading-tight text-white">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2.5 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{locationText}</span>
                    </div>
                  </div>
                </AnimationWrapper>

                {/* Price */}
                <AnimationWrapper type="fade-left" duration={0.5} delay={0.15}>
                  <div className="pt-2">
                    <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1">
                      {isAuction
                        ? "STARTING BID / CURRENT BID"
                        : isPrivateSale
                        ? "ESTIMATED VALUE / ASK"
                        : "CURRENT PRICE / ASK"}
                    </p>
                    <p className="text-3xl font-inter font-medium text-primary">
                      {formattedPrice}
                    </p>
                  </div>
                </AnimationWrapper>

                {/* Action Buttons */}
                <AnimationWrapper type="fade-left" duration={0.5} delay={0.2}>
                  {isFixedPrice && (
                    <>
                      {isUserOffersLoading ? (
                        <div className="w-full h-13 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl animate-pulse" />
                      ) : existingOffer &&
                        ["PENDING", "COUNTERED", "ACCEPTED"].includes(
                          (existingOffer.status || "").toUpperCase()
                        ) ? (
                        <button
                          onClick={() => setIsViewOfferModalOpen(true)}
                          className="w-full py-4 bg-[#E78F23]/15 border border-[#E78F23]/40 text-primary hover:bg-[#E78F23]/25 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
                        >
                          <Clock className="w-4.5 h-4.5 text-primary" />
                          Offer Sent (${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()})
                        </button>
                      ) : (
                        <button
                          onClick={handleOpenSendOfferModal}
                          className="w-full py-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Offer
                        </button>
                      )}
                    </>
                  )}

                  {isAuction && (
                    <>
                      {isUserOffersLoading ? (
                        <div className="w-full h-13 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl animate-pulse" />
                      ) : existingOffer &&
                        ["PENDING", "LEADING", "OUTBID", "COUNTERED", "ACCEPTED"].includes(
                          (existingOffer.status || "").toUpperCase()
                        ) ? (
                        <button
                          onClick={handleOpenPlaceBidModal}
                          className="w-full py-4 bg-[#E78F23]/15 border border-[#E78F23]/40 text-primary hover:bg-[#E78F23]/25 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
                        >
                          <Gavel className="w-4.5 h-4.5 text-primary" />
                          Increase Bid (${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()})
                        </button>
                      ) : (
                        <button
                          onClick={handleOpenPlaceBidModal}
                          className="w-full py-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_6px_24px_rgba(231,143,35,0.35)] hover:shadow-[0_8px_30px_rgba(231,143,35,0.5)] active:scale-[0.98] capitalize tracking-wide cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Gavel className="w-4 h-4" />
                          Place Bid
                        </button>
                      )}
                    </>
                  )}

                  {isPrivateSale && (
                    <div className="w-full py-4 px-4 bg-[#161618] border border-[#E78F23]/30 rounded-xl text-center flex items-center justify-center gap-2.5 shadow-lg">
                      <Lock className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-sm font-medium text-gray-300">
                        This item is available for <span className="text-primary font-semibold">Private Sale</span> only.
                      </p>
                    </div>
                  )}
                </AnimationWrapper>

                {/* Key Specifications (Dynamic Key & Value) */}
                <AnimationWrapper type="fade-left" duration={0.5} delay={0.25}>
                  <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-white/2">
                    <div className="flex items-center gap-2.5 mb-5">
                      <Info className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-semibold text-white">
                        Key Specifications
                      </h4>
                    </div>

                    {dynamicSpecs.length > 0 ? (
                      <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                        {dynamicSpecs.map((spec, index) => (
                          <SpecItem
                            key={index}
                            label={spec.label}
                            value={spec.value}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        No specifications listed
                      </p>
                    )}
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
                          {product.owner?.isVerified
                            ? "Verified Premium Dealer"
                            : "Registered Seller"}
                        </p>
                      </div>
                    </div>

                    {(product.owner?.email || product.owner?.phone) && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
                        {product.owner?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-primary" />
                            <span>{product.owner.email}</span>
                          </div>
                        )}
                        {product.owner?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            <span>{product.owner.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
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
                      {product.subCategory || product.category || "AUCTION"}
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
                          className={`w-10 h-5.5 rounded-full relative transition-all duration-300 cursor-pointer ${inclFees ? "bg-white" : "bg-[#2C2C2E]"}`}
                        >
                          <div
                            className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${inclFees ? "left-5.5 bg-black" : "left-1 bg-white"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm tracking-tight">
                        <span className="text-gray-400">Asking Price</span>
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
                          ${vipFee.toLocaleString()}
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
                            ${totalPayable.toLocaleString()}
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

                {/* Attributes Grid (Dynamic Key & Value) */}
                <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
                  <div className="grid grid-cols-2 gap-3">
                    {dynamicSpecs.length > 0 ? (
                      dynamicSpecs.map((spec, index) => (
                        <div
                          key={index}
                          className="bg-[#161618] rounded-xl p-4 border border-white/3"
                        >
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 truncate">
                            {spec.label}
                          </p>
                          <p
                            className="text-[15px] font-medium text-white truncate"
                            title={spec.value}
                          >
                            {spec.value}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-[#161618] rounded-xl p-4 border border-white/3 text-xs text-gray-500 italic">
                        No specifications available
                      </div>
                    )}
                  </div>
                </AnimationWrapper>

                {/* Seller */}
                <AnimationWrapper type="fade-up" duration={0.5} delay={0.3}>
                  <div className="bg-[#161618] rounded-xl p-4 flex items-center gap-3.5 border border-white/3">
                    {product.owner?.avatarUrl ? (
                      <img
                        src={product.owner.avatarUrl}
                        alt={sellerName}
                        className="w-10 h-10 rounded-full object-cover"
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
                        {product.owner?.isVerified
                          ? "Verified Dealer"
                          : "Seller"}
                      </p>
                    </div>
                  </div>
                </AnimationWrapper>

                {/* Bidding Actions */}
                <AnimationWrapper type="fade-up" duration={0.5} delay={0.4}>
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleOpenPlaceBidModal}
                      disabled={createOfferMutation.isPending}
                      className="w-full py-4.5 bg-primary hover:brightness-110 text-white text-sm font-bold rounded-xl transition-all shadow-[0_10px_30px_rgba(231,143,35,0.2)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Gavel className="w-4.5 h-4.5" />
                      {existingOffer
                        ? `Increase Bid ($${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()})`
                        : "Place Bid"}
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleToggleSave}
                        disabled={saveMutation.isPending}
                        className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Heart
                          className="w-4 h-4 text-primary"
                          fill={isSaved ? "#E78F23" : "none"}
                        />
                        {isSaved ? "Saved" : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          if (
                            typeof window !== "undefined" &&
                            navigator.share
                          ) {
                            navigator.share({
                              title: product.title,
                              url: window.location.href,
                            });
                          } else if (typeof window !== "undefined") {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                        className="flex items-center justify-center gap-2 py-4 bg-[#161618] text-white text-[13px] font-semibold rounded-xl border border-white/5 hover:bg-white/8 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                        Share
                      </button>
                    </div>
                  </div>
                </AnimationWrapper>

                {/* Cancel / Back Link */}
                <button
                  onClick={() => setIsBiddingMode(false)}
                  className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors pt-2 font-medium cursor-pointer"
                >
                  Go Back to Details
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty / Not Found State */
        <AnimationWrapper type="zoom" duration={0.4}>
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
            <h3 className="text-2xl font-clash font-semibold text-white mb-2">
              Product Not Found
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              The listing you are looking for does not exist or has been removed
              from the marketplace.
            </p>
            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary text-black font-semibold text-sm rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Return to Marketplace
            </Link>
          </div>
        </AnimationWrapper>
      )}

      {/* ── Send Offer Modal ── */}
      {isOfferModalOpen && product && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !createOfferMutation.isPending) {
              setIsOfferModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-lg bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-clash font-bold text-white">
                  Make an Offer
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Submit your offer directly to the seller for review.
                </p>
              </div>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                disabled={createOfferMutation.isPending}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item Summary Card */}
            <div className="flex items-center gap-4 bg-[#1C1C1E] border border-white/5 p-3.5 rounded-xl">
              <img
                src={productImages[0]}
                alt={product.title}
                className="w-16 h-12 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">
                  {product.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Asking Price:{" "}
                  <span className="text-primary font-medium">{formattedPrice}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-5">
              {/* Offer Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Your Offer Amount (USD) <span className="text-red-400">*</span>
                  </label>
                  {/* Quick preset percentage pills */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        numericPrice > 0 &&
                        setOfferAmount(String(numericPrice))
                      }
                      className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                    >
                      Asking
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        numericPrice > 0 &&
                        setOfferAmount(String(Math.round(numericPrice * 0.95)))
                      }
                      className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                    >
                      -5%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        numericPrice > 0 &&
                        setOfferAmount(String(Math.round(numericPrice * 0.9)))
                      }
                      className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                    >
                      -10%
                    </button>
                  </div>
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
              {Boolean(parseFloat(offerAmount)) && parseFloat(offerAmount) > 0 && (
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
                      ${Math.round(parseFloat(offerAmount) * 0.015).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 flex justify-between font-semibold">
                    <span className="text-gray-300">Total Commitment</span>
                    <span className="text-primary">
                      ${Math.round(parseFloat(offerAmount) * 1.015).toLocaleString()}
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
                  {createOfferMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Offer...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Offer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Sent Offer Modal ── */}
      {isViewOfferModalOpen && existingOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsViewOfferModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-md bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-clash font-bold text-white">
                  Your Submitted Offer
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Details of your offer for this listing
                </p>
              </div>
              <button
                onClick={() => setIsViewOfferModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-[#111111] border border-[#2C2C2E] rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Offer Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E78F23]/10 text-primary border border-[#E78F23]/20">
                  <Clock className="w-3.5 h-3.5" />
                  {existingOffer.status || "PENDING"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-gray-400">Offered Amount</span>
                <span className="text-lg font-clash font-bold text-white">
                  ${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()}
                </span>
              </div>

              {existingOffer.histories?.[0]?.note && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-400 block mb-1">
                    Buyer Note
                  </span>
                  <p className="text-xs text-gray-300 bg-[#161618] p-2.5 rounded-lg border border-white/5 italic">
                    &quot;{existingOffer.histories[0].note}&quot;
                  </p>
                </div>
              )}

              {existingOffer.createdAt && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-500">
                  <span>Submitted On</span>
                  <span>
                    {new Date(existingOffer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setIsViewOfferModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/buyer/mybids"
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg"
              >
                View in My Bids
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Place / Increase Bid Modal ── */}
      {isBidModalOpen && product && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !createOfferMutation.isPending) {
              setIsBidModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-lg bg-[#161618] border border-[#2C2C2E] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-clash font-bold text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-primary" />
                  {existingOffer ? "Increase Your Bid" : "Place a Bid"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {existingOffer
                    ? "Submit a higher bid for this auction listing."
                    : "Enter your bid amount to join the auction."}
                </p>
              </div>
              <button
                onClick={() => setIsBidModalOpen(false)}
                disabled={createOfferMutation.isPending}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item & Current Bid Summary Card */}
            <div className="flex items-center gap-4 bg-[#1C1C1E] border border-white/5 p-3.5 rounded-xl">
              <img
                src={productImages[0]}
                alt={product.title}
                className="w-16 h-12 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">
                  {product.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="text-gray-400">
                    {existingOffer ? "Your Current Bid:" : "Starting / Current Ask:"}
                  </span>
                  <span className="text-primary font-bold">
                    {existingOffer
                      ? `$${Number(existingOffer.currentAmount || existingOffer.initialAmount).toLocaleString()}`
                      : formattedPrice}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-5">
              {/* Bid Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {existingOffer ? "New Higher Bid Amount (USD)" : "Your Bid Amount (USD)"}{" "}
                    <span className="text-red-400">*</span>
                  </label>

                  {/* Increment Pills */}
                  {existingOffer && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const base = Number(
                            existingOffer.currentAmount || existingOffer.initialAmount
                          );
                          setBidAmount(String(Math.round(base * 1.05)));
                        }}
                        className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                      >
                        +5%
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const base = Number(
                            existingOffer.currentAmount || existingOffer.initialAmount
                          );
                          setBidAmount(String(Math.round(base * 1.1)));
                        }}
                        className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                      >
                        +10%
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const base = Number(
                            existingOffer.currentAmount || existingOffer.initialAmount
                          );
                          setBidAmount(String(Math.round(base * 1.15)));
                        }}
                        className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors"
                      >
                        +15%
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
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="e.g. 950000"
                    className="w-full pl-9 pr-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white font-medium text-base outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Note / Verification Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Bidder Note / Terms{" "}
                  <span className="text-gray-500 font-normal lowercase">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  placeholder="Escrow verified bidder ready to proceed..."
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2C2C2E] focus:border-primary rounded-xl text-white text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Dynamic Fee & Total Payable Summary */}
              {Boolean(parseFloat(bidAmount)) && parseFloat(bidAmount) > 0 && (
                <div className="bg-[#111111] border border-white/5 p-3.5 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-400">
                    <span>Bid Amount</span>
                    <span className="text-white font-medium">
                      ${parseFloat(bidAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>VIP Fee (1.5%)</span>
                    <span className="text-white font-medium">
                      ${Math.round(parseFloat(bidAmount) * 0.015).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 flex justify-between font-semibold">
                    <span className="text-gray-300">Total Payable</span>
                    <span className="text-primary font-bold">
                      ${Math.round(parseFloat(bidAmount) * 1.015).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBidModalOpen(false)}
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
                  {createOfferMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Bid...
                    </>
                  ) : (
                    <>
                      <Gavel className="w-4 h-4" />
                      {existingOffer ? "Increase Bid" : "Place Bid"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton Component for Product Details ─── */
function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
      {/* Left Gallery Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="w-full h-102.25 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl" />
        <div className="flex gap-3 mt-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="w-25 h-18 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl shrink-0"
            />
          ))}
        </div>
        <div className="mt-10 space-y-3">
          <div className="w-32 h-6 bg-[#1C1C1E] rounded-md" />
          <div className="w-full h-4 bg-[#1C1C1E] rounded" />
          <div className="w-5/6 h-4 bg-[#1C1C1E] rounded" />
          <div className="w-3/4 h-4 bg-[#1C1C1E] rounded" />
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <div className="max-w-95 w-full shrink-0 space-y-6">
        <div className="space-y-3">
          <div className="w-24 h-5 bg-[#1C1C1E] rounded-md" />
          <div className="w-full h-8 bg-[#1C1C1E] rounded-md" />
          <div className="w-36 h-4 bg-[#1C1C1E] rounded" />
        </div>

        <div className="space-y-2 pt-2">
          <div className="w-28 h-3 bg-[#1C1C1E] rounded" />
          <div className="w-48 h-9 bg-[#1C1C1E] rounded-md" />
        </div>

        <div className="flex gap-3">
          <div className="w-full h-12 bg-[#1C1C1E] rounded-xl" />
          <div className="w-full h-12 bg-[#1C1C1E] rounded-xl" />
        </div>

        <div className="border border-[#2C2C2E] rounded-2xl p-6 bg-[#161618] space-y-4">
          <div className="w-36 h-5 bg-[#2C2C2E] rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
            <div className="w-full h-10 bg-[#2C2C2E] rounded" />
          </div>
        </div>

        <div className="bg-[#161618] border border-[#2C2C2E] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#2C2C2E] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-32 h-4 bg-[#2C2C2E] rounded" />
            <div className="w-24 h-3 bg-[#2C2C2E] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-1.5 truncate">
        {label}
      </p>
      <p className="text-sm font-semibold text-white truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
