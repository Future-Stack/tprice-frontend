"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import ProductGallery from "../components/details/ProductGallery";
import ProductSpecsGrid from "../components/details/ProductSpecsGrid";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useListingByIdQuery,
  useSaveListingMutation,
  useSavedListingsQuery,
} from "@/hooks/useListings";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  MapPin,
  ChevronLeft,
  Calendar,
  Gauge,
  Cog,
  Zap,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Tag,
  Eye,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

// Helper to format specification key names nicely (e.g. exteriorColor -> Exterior Color)
function formatSpecKey(key: string): string {
  const formatted = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Helper to format specification values nicely
function formatSpecValue(key: string, val: any): string {
  if (val === null || val === undefined || val === "") return "N/A";
  if (typeof val === "boolean") return val ? "Yes" : "No";

  const lowerKey = key.toLowerCase();
  if (typeof val === "number") {
    if (lowerKey.includes("mileage")) return `${val.toLocaleString()} mi`;
    if (
      lowerKey.includes("horsepower") ||
      lowerKey.includes("power") ||
      lowerKey === "hp"
    )
      return `${val.toLocaleString()} hp`;
    if (lowerKey.includes("sqft") || lowerKey.includes("squarefeet"))
      return `${val.toLocaleString()} sq ft`;
    return val.toLocaleString();
  }

  const strVal = String(val);
  if (lowerKey.includes("mileage") && !strVal.toLowerCase().includes("mi"))
    return `${strVal} mi`;
  if (
    (lowerKey.includes("horsepower") || lowerKey.includes("power")) &&
    !strVal.toLowerCase().includes("hp")
  )
    return `${strVal} hp`;

  return strVal;
}

const DEFAULT_HISTORY = [
  "Full service history available",
  "Single owner from new",
  "No accidents reported",
  "Verified documentation & certificate of authenticity",
];

export default function InventoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const listingId = Array.isArray(id) ? id[0] : id;

  const {
    data: item,
    isLoading,
    isError,
    error,
    refetch,
  } = useListingByIdQuery(listingId || "");

  const saveMutation = useSaveListingMutation();
  const token =
    Cookies.get("accessToken") ||
    Cookies.get("token") ||
    useAuthStore((state) => state.token);

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) },
  );

  const isSavedInListings =
    savedResponse?.data?.some((savedItem) => savedItem.id === item?.id) ??
    false;
  const isSaved =
    item?.isSaved !== undefined ? item.isSaved : isSavedInListings;

  const handleToggleSave = () => {
    if (!item?.id) return;
    if (!token) {
      toast.error("Please sign in to save listings to your favorites.");
      return;
    }
    saveMutation.mutate(item.id);
  };

  // Smooth Skeleton Loading State
  if (isLoading) {
    return <InventoryDetailsSkeleton />;
  }

  // Error / Not Found State
  if (isError || !item) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
        <AnimationWrapper type="zoom">
          <div className="bg-[#0A0A0A] border border-red-500/20 p-8 md:p-12 rounded-sm max-w-md w-full shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-2 text-white">
              Asset Not Found
            </h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              {(error as any)?.response?.data?.message ||
                "The requested luxury listing could not be retrieved or has been removed."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Retry Loading
              </button>
              <button
                onClick={() => router.push("/inventory")}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-semibold text-xs rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Return to Inventory
              </button>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    );
  }

  // Specifications formatting
  const specs = item.specifications || {};
  const formattedSpecsList: { label: string; value: string }[] = [];

  // Standard keys priority
  if (specs.engine)
    formattedSpecsList.push({
      label: "Engine",
      value: formatSpecValue("engine", specs.engine),
    });
  if (specs.mileage)
    formattedSpecsList.push({
      label: "Mileage",
      value: formatSpecValue("mileage", specs.mileage),
    });
  if (specs.horsepower)
    formattedSpecsList.push({
      label: "Horsepower",
      value: formatSpecValue("horsepower", specs.horsepower),
    });
  if (specs.transmission)
    formattedSpecsList.push({
      label: "Transmission",
      value: formatSpecValue("transmission", specs.transmission),
    });
  if (specs.exteriorColor)
    formattedSpecsList.push({
      label: "Exterior Color",
      value: formatSpecValue("exteriorColor", specs.exteriorColor),
    });
  if (specs.interiorColor)
    formattedSpecsList.push({
      label: "Interior Color",
      value: formatSpecValue("interiorColor", specs.interiorColor),
    });

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

  const displaySpecs =
    formattedSpecsList.length > 0
      ? formattedSpecsList
      : [
          { label: "Engine", value: "High-Performance V8 / Electric Hybrid" },
          { label: "Transmission", value: "Automatic Dual-Clutch" },
          { label: "Exterior Color", value: "Rosso Corsa" },
          { label: "Interior Color", value: "Premium Leather" },
        ];

  // Price formatting
  const numericPrice = item.askingPrice ? Number(item.askingPrice) : 0;
  const currencySymbol =
    item.currency === "USD" || !item.currency ? "$" : `${item.currency} `;
  const formattedPrice =
    numericPrice > 0
      ? `${currencySymbol}${numericPrice.toLocaleString()}`
      : "Price on Request";

  // Location & Owner text
  const locationText =
    [item.locationCity, item.locationCountry].filter(Boolean).join(", ") ||
    "Worldwide Collection";

  const ownerName = item.owner
    ? `${item.owner.firstName} ${item.owner.lastName}`
    : item.brand || "Elite Motors Collection";

  // Media items list
  const mediaList =
    item.media && item.media.length > 0
      ? [...item.media]
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((m) => ({
            type: (m.type?.toLowerCase() === "video" ? "video" : "image") as
              | "video"
              | "image",
            url: m.url,
          }))
      : [
          {
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
          },
        ];

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden">
      {/* Product Gallery Section */}
      <section className="relative w-full  ">
        <ProductGallery media={mediaList} />
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <AnimationWrapper type="fade-up">
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {item.category && (
                    <span className="px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] uppercase font-bold tracking-widest rounded-sm flex items-center gap-1">
                      <Tag size={10} />
                      {item.category}
                    </span>
                  )}
                  {item.subCategory && (
                    <span className="px-2.5 py-0.5 bg-white/5 text-white/60 border border-white/10 text-[10px] uppercase font-bold tracking-widest rounded-sm">
                      {item.subCategory}
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold tracking-widest rounded-sm flex items-center gap-1">
                      <Sparkles size={10} />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3">
                    <h1 className="text-3xl md:text-[28px] font-serif text-white font-semibold tracking-wide">
                      {item.buildYear ? `${item.buildYear} ` : ""}
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/40 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-[#D4AF37]" />
                        <span>{locationText}</span>
                      </div>
                      {item.viewsCount !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs text-white/30">
                          <Eye size={14} />
                          <span>
                            {item.viewsCount}{" "}
                            {item.viewsCount === 1 ? "view" : "views"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-[#D4AF37] text-4xl md:text-[36px] font-semibold font-serif pt-1">
                      {formattedPrice}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-white/70 uppercase tracking-widest rounded-sm font-semibold">
                      {item.saleType
                        ? item.saleType.replace(/_/g, " ")
                        : item.status || "LIVE"}
                    </span>
                    {item.allowCounterOffers && (
                      <span className="text-[10px] text-emerald-400/80 font-medium tracking-wide">
                        Counter offers accepted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AnimationWrapper>

            {/* Description */}
            <AnimationWrapper type="fade-up" delay={0.2}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-4">
                <h3 className="text-xl font-serif text-white border-b border-white/5 pb-4">
                  Description
                </h3>
                <p className="text-white/70 leading-relaxed font-light text-sm md:text-base italic">
                  {(item as any).description ||
                    `${item.buildYear ? `${item.buildYear} ` : ""}${item.title} — An exceptional masterpiece of engineering and craftsmanship, meticulously maintained and available for immediate acquisition.`}
                </p>
              </div>
            </AnimationWrapper>

            {/* Specifications */}
            <AnimationWrapper type="fade-up" delay={0.3}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/5 pb-4">
                  Specifications
                </h3>
                <ProductSpecsGrid specs={displaySpecs} />
              </div>
            </AnimationWrapper>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <AnimationWrapper type="fade-left" delay={0.2}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm sticky top-12 space-y-8">
                {/* Dealer / Owner Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    {item.owner?.avatarUrl ? (
                      <Image
                        src={item.owner.avatarUrl}
                        alt={ownerName}
                        className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold font-serif">
                        {ownerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-serif text-white leading-tight">
                        {ownerName}
                      </h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">
                        {item.owner?.role || "Verified Dealer"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <MapPin size={14} className="text-[#D4AF37]" />
                      <span>{locationText}</span>
                    </div>
                    {item.owner?.isVerified && (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-widest font-medium">
                        <CheckCircle2 size={14} />
                        <span>Verified Concierge Seller</span>
                      </div>
                    )}
                    {item.owner?.email && (
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Mail size={14} className="text-white/30" />
                        <span>{item.owner.email}</span>
                      </div>
                    )}
                    {item.owner?.phone && (
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Phone size={14} className="text-white/30" />
                        <span>{item.owner.phone}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-white/50 text-xs leading-relaxed italic pt-1">
                    Premier luxury asset offering verified provenance and
                    immediate concierge acquisition.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => router.push("/inventory")}
                    className="w-full py-4 bg-[#D4AF37] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#B8962E] transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm"
                  >
                    View All Listings
                  </button>
                  <button
                    onClick={handleToggleSave}
                    disabled={saveMutation.isPending}
                    className={`w-full py-4 bg-transparent border text-sm font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm ${
                      isSaved
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-white/10 text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={isSaved ? "currentColor" : "none"}
                      className={isSaved ? "text-[#D4AF37]" : ""}
                    />
                    {isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
                  </button>
                </div>

                {/* Additional Sidebar Info */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                    <Wrench size={16} className="group-hover:text-[#D4AF37]" />
                    <span className="text-xs uppercase tracking-widest">
                      Certified Inspection
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
                    <ShieldCheck
                      size={16}
                      className="group-hover:text-[#D4AF37]"
                    />
                    <span className="text-xs uppercase tracking-widest">
                      Warranty & Provenance
                    </span>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickSpecBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm space-y-4 hover:border-[#D4AF37]/30 transition-all group">
      <div className="flex justify-center">{icon}</div>
      <div className="text-center space-y-1">
        <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
          {label}
        </div>
        <div
          className="text-white text-sm font-bold group-hover:text-white transition-colors truncate"
          title={value}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ─── Smooth Skeleton Component for Inventory Details ─── */
function InventoryDetailsSkeleton() {
  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden animate-pulse">
      {/* Back Button Bar Skeleton */}
      <div className="container mx-auto px-6 pt-6">
        <div className="w-36 h-4 bg-white/10 rounded-sm" />
      </div>

      {/* Hero Gallery Skeleton */}
      <section className="relative w-full mt-4">
        <div className="h-125 md:h-175 w-full bg-white/5 border-b border-white/5" />
        <div className="container mx-auto px-6 flex justify-center gap-4 -mt-24 relative z-30">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-30 md:min-w-40 h-20 md:h-28 rounded-sm bg-white/10 border border-white/10"
            />
          ))}
        </div>
      </section>

      {/* Main Grid Skeleton */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card Skeleton */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-4">
              <div className="flex gap-2">
                <div className="w-20 h-5 bg-white/10 rounded-sm" />
                <div className="w-20 h-5 bg-white/10 rounded-sm" />
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="h-8 w-3/4 bg-white/10 rounded-sm" />
                  <div className="h-4 w-1/3 bg-white/10 rounded-sm" />
                  <div className="h-10 w-1/2 bg-white/10 rounded-sm mt-3" />
                </div>
                <div className="h-6 w-24 bg-white/10 rounded-sm" />
              </div>
            </div>

            {/* Quick Specs Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#0A0A0A] border border-white/5 p-6 rounded-sm space-y-3 text-center"
                >
                  <div className="w-6 h-6 bg-white/10 rounded-full mx-auto" />
                  <div className="w-14 h-3 bg-white/10 rounded mx-auto" />
                  <div className="w-20 h-4 bg-white/10 rounded mx-auto" />
                </div>
              ))}
            </div>

            {/* Description Skeleton */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-4">
              <div className="h-6 w-32 bg-white/10 rounded-sm pb-4 border-b border-white/5" />
              <div className="h-4 w-full bg-white/10 rounded-sm" />
              <div className="h-4 w-5/6 bg-white/10 rounded-sm" />
              <div className="h-4 w-2/3 bg-white/10 rounded-sm" />
            </div>

            {/* Specifications Skeleton */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
              <div className="h-6 w-40 bg-white/10 rounded-sm pb-4 border-b border-white/5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center gap-4"
                  >
                    <div className="w-24 h-4 bg-white/10 rounded" />
                    <div className="flex-1 border-b border-dotted border-white/10" />
                    <div className="w-28 h-4 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-white/10 rounded-sm" />
                  <div className="h-3 w-20 bg-white/10 rounded-sm" />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="h-4 w-36 bg-white/10 rounded-sm" />
                <div className="h-4 w-28 bg-white/10 rounded-sm" />
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="h-12 w-full bg-white/10 rounded-sm" />
                <div className="h-12 w-full bg-white/5 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
