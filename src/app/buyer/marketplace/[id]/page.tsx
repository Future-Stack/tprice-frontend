"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, RefreshCw } from "lucide-react";
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
  ProductDetailsSkeleton,
  BuyerListingGallery,
  BuyerListingSidebar,
  BuyerBiddingSidebar,
  parseHighestBid,
  getErrorMessage,
  getProductImages,
  getDynamicSpecs,
} from "./_components";

const SendOfferModal = dynamic(
  () => import("./_components/SendOfferModal").then((m) => m.SendOfferModal),
  { ssr: false }
);
const ViewOfferModal = dynamic(
  () => import("./_components/ViewOfferModal").then((m) => m.ViewOfferModal),
  { ssr: false }
);
const PlaceBidModal = dynamic(
  () => import("./_components/PlaceBidModal").then((m) => m.PlaceBidModal),
  { ssr: false }
);

export default function BuyerListingDetailPage() {
  const params = useParams();
  const idOrSlug = (params?.id as string) || "";

  const { data: product, isLoading, isError, error, refetch } = useListingByIdQuery(idOrSlug);
  const saveMutation = useSaveListingMutation();
  const { token } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isBiddingMode, setIsBiddingMode] = useState(false);
  const [activeModal, setActiveModal] = useState<"offer" | "view-offer" | "bid" | null>(null);

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );
  const { data: userOffersData, isLoading: isUserOffersLoading } = useOffersQuery(
    { limit: 100 },
    { enabled: Boolean(token) }
  );

  if (isLoading) return <ProductDetailsSkeleton />;

  if (isError || !product) {
    return (
      <div className="mx-auto relative z-0 py-8">
        <AnimationWrapper type="zoom" duration={0.4}>
          <div className="bg-[#2A1616] border border-red-500/30 rounded-2xl p-8 mb-8 text-center max-w-3xl mx-auto">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Failed to load product details
            </h3>
            <p className="text-sm text-gray-400 mb-6">{getErrorMessage(error)}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary text-black font-semibold text-sm rounded-xl transition-all shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <Link
                href="/buyer/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1E] border border-[#2C2C2E] text-white font-semibold text-sm rounded-xl hover:bg-white/5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Marketplace
              </Link>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    );
  }

  const existingOffer = userOffersData?.data?.find(
    (offer) => offer.listingId === product.id || offer.listing?.id === product.id
  );

  const productImages = getProductImages(product);
  const safeSelectedImage = selectedImage < productImages.length ? selectedImage : 0;

  const numericPrice = product.askingPrice ? Number(product.askingPrice) : 0;
  const currencySymbol =
    product.currency === "USD" || !product.currency ? "$" : `${product.currency} `;
  const formattedPrice =
    numericPrice > 0 ? `${currencySymbol}${numericPrice.toLocaleString()}` : "Price on Request";

  const askingPriceVal =
    product.askingPrice && !isNaN(Number(product.askingPrice)) ? Number(product.askingPrice) : null;
  const startingBidVal =
    product.startingBid && !isNaN(Number(product.startingBid)) ? Number(product.startingBid) : null;
  const highestBidVal = parseHighestBid(product.highestBid);
  const totalBidsCountVal =
    typeof product.totalBidsCount === "number" ? product.totalBidsCount : null;

  const normalizedSaleType = (product.saleType || "").toUpperCase();
  const isAuction =
    normalizedSaleType === "AUCTION" ||
    (Boolean(product.startingBid) &&
      !["FIXED_PRICE", "PRIVATE_SALE", "PRIVATE"].includes(normalizedSaleType));
  const isPrivateSale = normalizedSaleType === "PRIVATE_SALE" || normalizedSaleType === "PRIVATE";
  const isFixedPrice = !isAuction && !isPrivateSale;

  const locationText =
    [product.locationCity, product.locationCountry].filter(Boolean).join(", ") ||
    "Miami, United States";
  const sellerName = product.owner
    ? `${product.owner.firstName} ${product.owner.lastName}`
    : "Monaco Exotics";
  const sellerInitial = product.owner?.firstName?.[0] || "M";

  const isSavedInListings =
    savedResponse?.data?.some((savedItem) => savedItem.id === product.id) ?? false;
  const isSaved = product.isSaved !== undefined ? product.isSaved : isSavedInListings;

  const handleToggleSave = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!token) return toast.error("Please sign in to save listings to your favorites.");
    saveMutation.mutate(product.id);
  };

  const verifyAuth = (action: () => void, message: string) => {
    if (!token) return toast.error(message);
    action();
  };

  const dynamicSpecs = getDynamicSpecs(product);
  const prodExtra = product as typeof product & { description?: string; overview?: string };
  const overviewText =
    prodExtra.description ||
    prodExtra.overview ||
    `This immaculate ${product.buildYear || ""} ${product.title} represents the pinnacle of luxury and performance. Meticulously maintained and stored in a climate-controlled environment, it stands ready for its next owner.`;

  return (
    <div className="mx-auto relative z-0">
      <div className="flex items-start justify-between mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-[40px] font-clash font-semibold">Exclusive Collection</h2>
            <p className="text-white text-[20px] mt-1 font-medium">
              Discover the world&apos;s finest assets available for acquisition.
            </p>
          </div>
        </AnimationWrapper>
      </div>

      <AnimationWrapper type="fade-right" duration={0.4} delay={0.15}>
        <Link
          href="/buyer/marketplace"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-medium mb-6 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Marketplace
        </Link>
      </AnimationWrapper>

      <div className="flex flex-col lg:flex-row gap-8">
        <BuyerListingGallery
          product={product}
          productImages={productImages}
          safeSelectedImage={safeSelectedImage}
          onSelectImage={setSelectedImage}
          isSaved={isSaved}
          isSaving={saveMutation.isPending}
          onToggleSave={handleToggleSave}
          overviewText={overviewText}
        />

        <div className="max-w-95 w-full shrink-0">
          {!isBiddingMode ? (
            <BuyerListingSidebar
              product={product}
              locationText={locationText}
              formattedPrice={formattedPrice}
              currencySymbol={currencySymbol}
              askingPriceVal={askingPriceVal}
              startingBidVal={startingBidVal}
              highestBidVal={highestBidVal}
              totalBidsCountVal={totalBidsCountVal}
              isAuction={isAuction}
              isFixedPrice={isFixedPrice}
              isPrivateSale={isPrivateSale}
              existingOffer={existingOffer}
              isUserOffersLoading={isUserOffersLoading}
              dynamicSpecs={dynamicSpecs}
              sellerName={sellerName}
              sellerInitial={sellerInitial}
              onOpenSendOffer={() =>
                verifyAuth(() => setActiveModal("offer"), "Please sign in to send an offer.")
              }
              onOpenViewOffer={() => setActiveModal("view-offer")}
              onOpenPlaceBid={() =>
                verifyAuth(() => {
                  if (isAuction) setActiveModal("bid");
                  else setIsBiddingMode(true);
                }, "Please sign in to place a bid.")
              }
            />
          ) : (
            <BuyerBiddingSidebar
              product={product}
              locationText={locationText}
              formattedPrice={formattedPrice}
              numericPrice={numericPrice}
              existingOffer={existingOffer}
              isSaving={saveMutation.isPending}
              isSaved={isSaved}
              dynamicSpecs={dynamicSpecs}
              sellerName={sellerName}
              sellerInitial={sellerInitial}
              onOpenPlaceBid={() =>
                verifyAuth(() => setActiveModal("bid"), "Please sign in to place a bid.")
              }
              onToggleSave={handleToggleSave}
              onExitBiddingMode={() => setIsBiddingMode(false)}
            />
          )}
        </div>
      </div>

      <SendOfferModal
        isOpen={activeModal === "offer"}
        onClose={() => setActiveModal(null)}
        product={product}
        productImages={productImages}
        numericPrice={numericPrice}
        formattedPrice={formattedPrice}
        onSuccess={() => refetch()}
      />
      {existingOffer && (
        <ViewOfferModal
          isOpen={activeModal === "view-offer"}
          onClose={() => setActiveModal(null)}
          existingOffer={existingOffer}
        />
      )}
      <PlaceBidModal
        isOpen={activeModal === "bid"}
        onClose={() => setActiveModal(null)}
        product={product}
        productImages={productImages}
        existingOffer={existingOffer}
        formattedPrice={formattedPrice}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
