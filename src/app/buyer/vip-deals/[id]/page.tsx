"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronLeft, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useListingByIdQuery,
  useSaveListingMutation,
  useSavedListingsQuery,
} from "@/hooks/useListings";
import { useOffersQuery } from "@/hooks/useOffers";
import { useAuth } from "@/hooks/useAuth";

import {
  VIPDetailsSkeleton,
  VIPDetailsGallery,
  VIPDetailsSidebar,
  VIPBiddingSidebar,
  formatPrice,
  parseHighestBid,
  getErrorMessage,
  getSpecItems,
  getProductImages,
} from "./_components";

const VIPOfferModal = dynamic(
  () => import("./_components/VIPOfferModal"),
  { ssr: false }
);

export default function VIPDetailsPage() {
  const params = useParams();
  const pathname = usePathname();
  const idOrSlug = (params?.id as string) || "";

  const isDealerPath = pathname?.startsWith("/dealer");
  const backLink = isDealerPath ? "/dealer/vip-deals" : "/buyer/vip-deals";

  const { data: product, isLoading, isError, error, refetch } = useListingByIdQuery(idOrSlug);
  const { token } = useAuth();
  const saveMutation = useSaveListingMutation();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isBiddingMode, setIsBiddingMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const { data: offersResponse, refetch: refetchOffers } = useOffersQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const existingOffer = offersResponse?.data?.find(
    (off) =>
      String(off.listingId) === String(product?.id) ||
      String(off.listing?.id) === String(product?.id)
  );

  const isSavedInListings =
    savedResponse?.data?.some((savedItem) => savedItem.id === product?.id) ?? false;
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
    setIsOfferModalOpen(true);
  };

  if (isLoading) return <VIPDetailsSkeleton />;

  if (isError || !product) {
    return (
      <div className="mx-auto relative z-0 py-16 text-center">
        <AnimationWrapper type="fade-up" duration={0.5}>
          <div className="bg-[#161618] border border-[#2C2C2E] rounded-3xl p-10 max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-clash font-semibold text-white">VIP Listing Not Found</h3>
              <p className="text-gray-400 text-sm mt-2">{getErrorMessage(error)}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition-all border border-white/10 inline-flex items-center gap-2 cursor-pointer"
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

  const productImages = getProductImages(product);
  const safeSelectedImage = selectedImage < productImages.length ? selectedImage : 0;
  const rawPrice = product.askingPrice ? Number(product.askingPrice) : 0;
  const formattedPrice = formatPrice(product.askingPrice, product.currency);
  const currencySymbol = product.currency === "USD" || !product.currency ? "$" : `${product.currency} `;
  const askingPriceVal = rawPrice > 0 ? rawPrice : null;
  const startingBidVal = product.startingBid ? Number(product.startingBid) : null;
  const highestBidVal = parseHighestBid(product.highestBid);
  const totalBidsCountVal = typeof product.totalBidsCount === "number" ? product.totalBidsCount : null;
  const locationParts = [product.locationCity, product.locationCountry].filter(Boolean);
  const locationText = locationParts.length > 0 ? locationParts.join(", ") : "Worldwide VIP";
  const specItems = getSpecItems(product);
  const badgeLabel = (product as typeof product & { badgeText?: string }).badgeText || product.saleType || "VIP ASSET";
  const sellerName = product.owner
    ? `${product.owner.firstName || ""} ${product.owner.lastName || ""}`.trim() || "TPrice Concierge"
    : "TPrice Concierge";

  return (
    <div className="mx-auto relative z-0">
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

      <div className="flex flex-col lg:flex-row gap-8">
        <VIPDetailsGallery
          product={product}
          productImages={productImages}
          safeSelectedImage={safeSelectedImage}
          onSelectImage={setSelectedImage}
          badgeLabel={badgeLabel}
          isSaved={isSaved}
          isSaving={saveMutation.isPending}
          onToggleSave={handleToggleSave}
        />

        <div className="max-w-95 w-full shrink-0">
          {!isBiddingMode ? (
            <VIPDetailsSidebar
              product={product}
              badgeLabel={badgeLabel}
              locationText={locationText}
              formattedPrice={formattedPrice}
              currencySymbol={currencySymbol}
              askingPriceVal={askingPriceVal}
              startingBidVal={startingBidVal}
              highestBidVal={highestBidVal}
              totalBidsCountVal={totalBidsCountVal}
              existingOffer={existingOffer}
              specItems={specItems}
              sellerName={sellerName}
              sellerInitial={sellerName.charAt(0).toUpperCase()}
              sellerBadge="Verified VIP Seller"
              isSaved={isSaved}
              isSaving={saveMutation.isPending}
              copied={copied}
              onOpenOfferModal={handleOpenOfferModal}
              onStartBidding={() => setIsBiddingMode(true)}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
            />
          ) : (
            <VIPBiddingSidebar
              product={product}
              badgeLabel={badgeLabel}
              locationText={locationText}
              formattedPrice={formattedPrice}
              rawPrice={rawPrice}
              specItems={specItems}
              existingOffer={existingOffer}
              sellerName={sellerName}
              sellerInitial={sellerName.charAt(0).toUpperCase()}
              sellerBadge="Verified VIP Seller"
              isSaved={isSaved}
              isSaving={saveMutation.isPending}
              copied={copied}
              onOpenOfferModal={handleOpenOfferModal}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
              onExitBiddingMode={() => setIsBiddingMode(false)}
            />
          )}
        </div>
      </div>

      <VIPOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        product={product}
        existingOffer={existingOffer}
        rawPrice={rawPrice}
        onSuccess={() => refetchOffers()}
      />
    </div>
  );
}
