"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, ChevronLeft, RefreshCw } from "lucide-react";
import ProductGallery from "../components/details/ProductGallery";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useListingByIdQuery, useSaveListingMutation, useSavedListingsQuery } from "@/hooks/useListings";
import { useOffersQuery } from "@/hooks/useOffers";
import {
  InventorySkeleton,
  InventoryHeaderCard,
  InventoryOverviewSection,
  InventoryBiddingCard,
  InventorySidebar,
  getMediaList,
  parseHighestBid,
  getErrorMessage,
} from "./_components";

const PlaceBidModal = dynamic(
  () => import("./_components/PlaceBidModal").then((m) => m.PlaceBidModal),
  { ssr: false }
);
const MakeOfferModal = dynamic(
  () => import("./_components/MakeOfferModal").then((m) => m.MakeOfferModal),
  { ssr: false }
);
const CounterOfferModal = dynamic(
  () => import("./_components/CounterOfferModal").then((m) => m.CounterOfferModal),
  { ssr: false }
);

export default function InventoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const listingId = Array.isArray(id) ? id[0] : id;

  const { data: item, isLoading, isError, error, refetch } = useListingByIdQuery(listingId || "");
  const saveMutation = useSaveListingMutation();
  const { token } = useAuth();

  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );
  const { data: offersResponse, isLoading: isOffersLoading } = useOffersQuery(
    { limit: 100 },
    { enabled: Boolean(token) }
  );

  const [activeModal, setActiveModal] = useState<"bid" | "offer" | "counter" | null>(null);

  if (isLoading) return <InventorySkeleton />;

  if (isError || !item) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
        <AnimationWrapper type="zoom">
          <div className="bg-[#0A0A0A] border border-red-500/20 p-8 md:p-12 rounded-sm max-w-md w-full shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-2 text-white">Asset Not Found</h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">{getErrorMessage(error)}</p>
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

  const existingOffer = offersResponse?.data?.find(
    (off) => String(off.listingId) === String(item.id) || String(off.listing?.id) === String(item.id)
  );

  const numericPrice = item.askingPrice ? Number(item.askingPrice) : 0;
  const currencySymbol = item.currency === "USD" || !item.currency ? "$" : `${item.currency} `;
  const formattedPrice = numericPrice > 0 ? `${currencySymbol}${numericPrice.toLocaleString()}` : "Price on Request";
  const locationText = [item.locationCity, item.locationCountry].filter(Boolean).join(", ") || "Worldwide Collection";
  const ownerName = item.owner ? `${item.owner.firstName} ${item.owner.lastName}` : item.brand || "Elite Motors Collection";

  const normalizedSaleType = (item.saleType || "").toUpperCase();
  const isAuction = normalizedSaleType === "AUCTION" || (Boolean(item.startingBid) && !["FIXED_PRICE", "FIXED", "PRIVATE_SALE", "PRIVATE"].includes(normalizedSaleType));
  const isFixedPrice = !isAuction;
  const allowCounterOffers = Boolean(item.allowCounterOffers);

  const startingBidVal = item.startingBid && !isNaN(Number(item.startingBid)) ? Number(item.startingBid) : null;
  const highestBidVal = parseHighestBid(item.highestBid);
  const totalBidsCountVal = typeof item.totalBidsCount === "number" ? item.totalBidsCount : null;

  const isSaved = item.isSaved !== undefined ? item.isSaved : (savedResponse?.data?.some((s) => s.id === item.id) ?? false);
  const handleToggleSave = () => {
    if (!token) return toast.error("Please sign in to save listings to your favorites.");
    saveMutation.mutate(item.id);
  };

  const verifyAuth = (action: () => void, message: string) => {
    if (!token) return toast.error(message);
    action();
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden">
      <section className="relative w-full">
        <ProductGallery media={getMediaList(item.media)} />
      </section>

      <div className="container mx-auto px-6 md:px-0 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <InventoryHeaderCard item={item} locationText={locationText} formattedPrice={formattedPrice} />
            <InventoryOverviewSection item={item} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <InventorySidebar
              item={item}
              ownerName={ownerName}
              locationText={locationText}
              isSaved={isSaved}
              isSaving={saveMutation.isPending}
              onToggleSave={handleToggleSave}
              biddingSection={
                <InventoryBiddingCard
                  item={item}
                  currencySymbol={currencySymbol}
                  isAuction={isAuction}
                  isFixedPrice={isFixedPrice}
                  allowCounterOffers={allowCounterOffers}
                  highestBidVal={highestBidVal}
                  startingBidVal={startingBidVal}
                  totalBidsCountVal={totalBidsCountVal}
                  existingOffer={existingOffer}
                  isOffersLoading={isOffersLoading}
                  onOpenPlaceBid={() => verifyAuth(() => setActiveModal("bid"), "Please sign in to place a bid.")}
                  onOpenSendOffer={() => verifyAuth(() => setActiveModal("offer"), "Please sign in to send an offer.")}
                  onOpenCounterOffer={() => verifyAuth(() => setActiveModal("counter"), "Please sign in to submit a counter offer.")}
                />
              }
            />
          </div>
        </div>
      </div>

      <PlaceBidModal
        isOpen={activeModal === "bid"}
        onClose={() => setActiveModal(null)}
        item={item}
        existingOffer={existingOffer}
        highestBidVal={highestBidVal}
        startingBidVal={startingBidVal}
        formattedPrice={formattedPrice}
        currencySymbol={currencySymbol}
        onSuccess={() => refetch()}
      />
      <MakeOfferModal
        isOpen={activeModal === "offer"}
        onClose={() => setActiveModal(null)}
        item={item}
        numericPrice={numericPrice}
        formattedPrice={formattedPrice}
        onSuccess={() => refetch()}
      />
      <CounterOfferModal
        isOpen={activeModal === "counter"}
        onClose={() => setActiveModal(null)}
        item={item}
        existingOffer={existingOffer}
        numericPrice={numericPrice}
        formattedPrice={formattedPrice}
        currencySymbol={currencySymbol}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
