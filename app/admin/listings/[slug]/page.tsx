"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  BadgeCheck,
  Clock,
  User,
  Mail,
  ListOrdered,
  Handshake,
  CheckCircle2,
  XCircle,
  Copy,
  TrendingUp,
  Fuel,
  Zap,
  Gauge,
  Calendar,
  Tag,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Layers,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useListingByIdQuery,
  useUpdateAdminListingStatusMutation,
} from "@/hooks/useListings";
import RejectListingModal from "@/app/admin/listings/RejectListingModal";
import { toast } from "sonner";

const formatPrice = (priceStr?: string | number, currency = "USD") => {
  if (!priceStr) return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${symbol}${num.toLocaleString()}`;
};

const formatSubmittedDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
};

const getSpecIcon = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("mileage") || lower.includes("km") || lower.includes("odometer"))
    return Gauge;
  if (
    lower.includes("0-100") ||
    lower.includes("speed") ||
    lower.includes("acceleration")
  )
    return TrendingUp;
  if (
    lower.includes("power") ||
    lower.includes("hp") ||
    lower.includes("bhp") ||
    lower.includes("kw")
  )
    return Zap;
  if (
    lower.includes("engine") ||
    lower.includes("fuel") ||
    lower.includes("motor")
  )
    return Fuel;
  if (lower.includes("year") || lower.includes("build")) return Calendar;
  if (lower.includes("brand") || lower.includes("make") || lower.includes("model"))
    return Tag;
  if (lower.includes("category") || lower.includes("type")) return Layers;
  return ShieldCheck;
};

const getStatusBadge = (status?: string) => {
  const norm = (status || "").toUpperCase();
  if (norm === "PENDING_APPROVAL" || norm === "PENDING") {
    return {
      label: "Pending Approval",
      className: "border border-primary bg-primary/10 text-primary",
    };
  }
  if (norm === "LIVE" || norm === "APPROVED") {
    return {
      label: "Approved",
      className: "border border-green-500 bg-green-500/10 text-green-400",
    };
  }
  if (norm === "REJECTED") {
    return {
      label: "Rejected",
      className: "border border-red-500 bg-red-500/10 text-red-400",
    };
  }
  return {
    label: status || "Unknown",
    className: "border border-gray-500 bg-gray-500/10 text-gray-400",
  };
};

function ListingDetailsSkeleton() {
  return (
    <div className="min-h-screen text-white font-sans animate-in fade-in duration-300">
      <div className=" ">
        {/* Title skeleton */}
        <div className="h-8 w-48 bg-[#1F1F1F] rounded-lg animate-pulse mb-6" />

        {/* Top Header Card Skeleton */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 w-full md:w-2/3">
            <div className="h-7 w-64 md:w-80 bg-[#1F1F1F] rounded-lg animate-pulse" />
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-8 w-32 bg-[#1F1F1F] rounded-lg animate-pulse" />
              <div className="h-8 w-40 bg-[#1F1F1F] rounded-full animate-pulse" />
              <div className="h-5 w-36 bg-[#1F1F1F] rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-right w-full md:w-auto">
            <div className="h-8 w-36 bg-[#1F1F1F] rounded-lg animate-pulse" />
            <div className="h-4 w-28 bg-[#1F1F1F] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-[#262626] bg-[#141414] h-[400px] md:h-[500px] animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-[#262626] bg-[#141414] h-24 md:h-32 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Specifications Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-[#141414] border border-[#262626] p-4 rounded-xl space-y-2 h-20 animate-pulse"
                  >
                    <div className="h-3 w-16 bg-[#1F1F1F] rounded animate-pulse" />
                    <div className="h-6 w-24 bg-[#1F1F1F] rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="bg-[#141414] border border-[#262626] p-6 rounded-xl h-full min-h-[100px] animate-pulse" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-24 bg-[#1F1F1F] rounded animate-pulse" />
              <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl h-32 animate-pulse" />
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-8 h-[380px] animate-pulse" />
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-6 h-48 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminListingDetails() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const {
    data: listing,
    isLoading,
    isError,
    refetch,
  } = useListingByIdQuery(slug);

  const updateStatusMutation = useUpdateAdminListingStatusMutation();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return <ListingDetailsSkeleton />;
  }

  if (isError || !listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Failed to load listing details
        </h2>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          The requested listing could not be retrieved or does not exist.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/listings"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-[#262626] hover:bg-[#1f1f1f] text-gray-300 rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-primary text-black font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const mediaImages =
    listing.media && listing.media.length > 0
      ? [...listing.media]
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((m) => m.url)
      : [
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
        ];

  const activeImage = mediaImages[selectedImageIndex] || mediaImages[0];

  const sellerName = listing.owner
    ? `${listing.owner.firstName || ""} ${listing.owner.lastName || ""}`.trim() ||
      listing.owner.email ||
      "Unknown Seller"
    : "Unknown Seller";

  const sellerAvatar =
    listing.owner?.avatarUrl ||
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100";

  const locationStr =
    [listing.locationCity, listing.locationCountry].filter(Boolean).join(", ") ||
    "Location N/A";

  const formattedPrice = formatPrice(listing.askingPrice, listing.currency);
  const statusBadge = getStatusBadge(listing.status);
  const timeAgoStr = formatTimeAgo(listing.createdAt);
  const submittedAtStr = `Submitted ${formatSubmittedDate(listing.createdAt)}`;

  // Construct dynamic specifications list
  const specsList: { label: string; value: string; icon: React.ElementType }[] = [];

  if (listing.buildYear) {
    specsList.push({
      label: "Year",
      value: String(listing.buildYear),
      icon: getSpecIcon("year"),
    });
  }

  if (listing.brand) {
    specsList.push({
      label: "Brand",
      value: listing.brand,
      icon: getSpecIcon("brand"),
    });
  }

  if (listing.category) {
    specsList.push({
      label: "Category",
      value: listing.category,
      icon: getSpecIcon("category"),
    });
  }

  if (listing.saleType) {
    specsList.push({
      label: "Sale Type",
      value: listing.saleType,
      icon: Tag,
    });
  }

  if (listing.specifications && typeof listing.specifications === "object") {
    Object.entries(listing.specifications).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        const labelStr = k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
        const formattedLabel =
          labelStr.charAt(0).toUpperCase() + labelStr.slice(1);
        specsList.push({
          label: formattedLabel,
          value: String(v),
          icon: getSpecIcon(k),
        });
      }
    });
  }

  if (specsList.length === 0) {
    specsList.push(
      { label: "Mileage", value: "1200 mi", icon: Gauge },
      { label: "0-100", value: "5 sec", icon: TrendingUp },
      { label: "Power", value: "661 HP", icon: Zap },
      { label: "Engine", value: "3.9L V8 Twin-Turbo", icon: Fuel }
    );
  }

  const conditionText =
    (listing.specifications?.condition as string) ||
    (listing.saleType ? `${listing.saleType}` : "Excellent");

  const descriptionText =
    listing.description ||
    `A striking ${listing.brand || ""} ${listing.title} that blends luxury with high-performance engineering. Category: ${listing.category || "N/A"}. Built in ${listing.buildYear || "N/A"}, located in ${locationStr}.`;

  const handleCopyId = () => {
    if (!listing.id && !listing.slug) return;
    const valueToCopy = listing.id || listing.slug;
    navigator.clipboard.writeText(valueToCopy);
    toast.success("Listing ID copied to clipboard");
  };

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        id: listing.id,
        status: "LIVE",
      });
      toast.success("Listing approved successfully");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || "Failed to approve listing";
      toast.error(errMsg);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: listing.id,
        status: "REJECTED",
        rejectionReason: reason,
      });
      setIsRejectModalOpen(false);
      toast.success("Listing rejected");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || "Failed to reject listing";
      toast.error(errMsg);
    }
  };

  const isUpdating = updateStatusMutation.isPending;

  return (
    <div className="min-h-screen text-white font-sans">
      <div className=" ">
        {/* --- Listing Review Title --- */}
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold">Listing Review</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] hover:bg-[#1a1a1a] text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        </AnimationWrapper>

        {/* --- Top Header Card --- */}
        <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">{listing.title}</h2>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-primary text-2xl font-semibold">
                  {formattedPrice}
                </span>
                <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-primary">
                  <img
                    src={sellerAvatar}
                    alt={sellerName}
                    className="w-5 h-5 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100";
                    }}
                  />
                  <span className="text-sm text-gray-300">{sellerName}</span>
                  {listing.owner?.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{locationStr}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-right">
              <span
                className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-4 h-4" />
                <span>{timeAgoStr}</span>
              </div>
            </div>
          </div>
        </AnimationWrapper>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column (2/3) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <AnimationWrapper type="zoom" duration={0.6}>
                <div className="rounded-2xl overflow-hidden border border-primary bg-[#141414]">
                  <img
                    src={activeImage}
                    alt={listing.title}
                    className="w-full h-[400px] md:h-[500px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200";
                    }}
                  />
                </div>
              </AnimationWrapper>

              {mediaImages.length > 1 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaImages.map((img, i) => (
                    <AnimationWrapper key={i} type="fade-up" delay={0.1 * (i + 1)}>
                      <button
                        onClick={() => setSelectedImageIndex(i)}
                        className={`w-full rounded-xl overflow-hidden border transition-all h-24 md:h-32 text-left ${
                          selectedImageIndex === i
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-[#262626] opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400";
                          }}
                        />
                      </button>
                    </AnimationWrapper>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {specsList.map((spec, i) => {
                  const SpecIcon = spec.icon;
                  return (
                    <AnimationWrapper
                      key={i}
                      type="fade-up"
                      delay={0.2 + i * 0.05}
                    >
                      <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5">
                          <SpecIcon className="w-3.5 h-3.5 text-primary" />
                          <p className="text-primary text-[10px] uppercase font-bold tracking-widest">
                            {spec.label}
                          </p>
                        </div>
                        <p className="text-xl font-medium truncate">
                          {spec.value}
                        </p>
                      </div>
                    </AnimationWrapper>
                  );
                })}
              </div>

              <AnimationWrapper type="fade-up" delay={0.4}>
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col justify-center items-start h-full">
                  <p className="text-primary text-[10px] uppercase font-bold tracking-widest mb-3">
                    Condition / Type
                  </p>
                  <p className="text-2xl font-semibold text-white capitalize">
                    {conditionText}
                  </p>
                </div>
              </AnimationWrapper>
            </div>

            {/* Description */}
            <AnimationWrapper type="fade-up" delay={0.5}>
              <div className="space-y-4">
                <h3 className="text-primary text-[10px] uppercase font-bold tracking-widest">
                  Description
                </h3>
                <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl">
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {descriptionText}
                  </p>
                </div>
              </div>
            </AnimationWrapper>
          </div>

          {/* --- Right Column (1/3) --- */}
          <div className="space-y-6">
            {/* Dealer Information */}
            <AnimationWrapper type="fade-left" delay={0.2}>
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-8">
                <h2 className="text-2xl font-semibold text-center mt-2">
                  Dealer Information
                </h2>

                <div className="space-y-6">
                  {/* Dealer Meta */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                          Dealer Info
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {sellerName}
                          </p>
                          {listing.owner?.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                          Email
                        </p>
                        <p className="text-sm font-medium text-gray-300 truncate">
                          {listing.owner?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dealer Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#151C1A] border border-[#1E2E28] rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[#22C55E]">
                        <ListOrdered className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Views
                        </span>
                      </div>
                      <p className="text-3xl font-semibold text-center">
                        {listing.viewsCount ?? 0}
                      </p>
                    </div>
                    <div className="bg-[#151D24] border border-[#1E2730] rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[#3B82F6]">
                        <Handshake className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Offers
                        </span>
                      </div>
                      <p className="text-3xl font-semibold text-center">
                        {listing.offersCount ?? listing._count?.offers ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={handleApprove}
                      disabled={
                        isUpdating ||
                        listing.status === "LIVE" ||
                        listing.status === "APPROVED"
                      }
                      className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      <span>
                        {listing.status === "LIVE" || listing.status === "APPROVED"
                          ? "Listing Approved"
                          : "Approve listing"}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={isUpdating || listing.status === "REJECTED"}
                      className="w-full bg-[#1A1A1A] border border-[#262626] hover:bg-[#202020] text-gray-400 hover:text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>
                        {listing.status === "REJECTED"
                          ? "Listing Rejected"
                          : "Reject listing"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </AnimationWrapper>

            {/* Meta Information */}
            <AnimationWrapper type="fade-left" delay={0.3}>
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-6">
                <p className="text-xs text-gray-500 font-medium">
                  Meta Information
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="text-[13px]">{submittedAtStr}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 flex items-center justify-between bg-[#0F0F0F] px-4 py-2 rounded-lg border border-[#262626] min-w-0">
                      <span className="text-[11px] font-mono text-gray-500 truncate mr-2">
                        {listing.slug || listing.id}
                      </span>
                      <button
                        onClick={handleCopyId}
                        title="Copy Listing ID"
                        className="text-primary hover:text-primary/80 shrink-0 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </div>

      {/* Reject Listing Modal */}
      <RejectListingModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        listing={listing}
        isSubmitting={isUpdating}
      />
    </div>
  );
}