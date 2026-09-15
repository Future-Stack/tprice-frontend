"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useOffersQuery,
  useAcceptOfferMutation,
  useWithdrawOfferMutation,
} from "@/hooks/useOffers";
import { OfferItem } from "@/lib/api/offers";
import { BuyerOfferList, BuyerOfferPagination } from "./_components";

const BuyerCounterOfferModal = dynamic(() => import("./_components/BuyerCounterOfferModal"), {
  ssr: false,
});

export default function BuyerOfferPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterOffer, setCounterOffer] = useState<OfferItem | null>(null);

  const { data, isLoading, isError, error, refetch } = useOffersQuery({
    page,
    limit,
  });

  const acceptOfferMutation = useAcceptOfferMutation();
  const withdrawOfferMutation = useWithdrawOfferMutation();

  const offers: OfferItem[] = data?.data || [];
  const meta = data?.meta;

  const handleToggleExpand = (id: string) => {
    setExpandedOfferId((prev) => (prev === id ? null : id));
  };

  const handleOpenCounter = (offer: OfferItem) => {
    setCounterOffer(offer);
    setCounterModalOpen(true);
  };

  const handleCloseCounter = () => {
    setCounterModalOpen(false);
    setCounterOffer(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-inter">
      <AnimationWrapper type="fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-4xl font-medium font-montserrat tracking-wide">
              My Offers
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage and track all offers you have submitted on listings
            </p>
          </div>
        </div>

        {/* Offers Container */}
        <div className="relative group">
          <div className="absolute -inset-px bg-linear-to-b from-white/10 to-transparent rounded-[2rem] pointer-events-none opacity-50" />

          <div className="relative bg-[#0A0A0B] rounded-[2rem] border border-white/5 overflow-hidden p-4 md:p-6 space-y-6">
            <BuyerOfferList
              offers={offers}
              isLoading={isLoading}
              isError={isError}
              errorMessage={(error as { message?: string })?.message}
              onRetry={() => refetch()}
              expandedOfferId={expandedOfferId}
              onToggleExpand={handleToggleExpand}
              onAccept={(id) => acceptOfferMutation.mutate(id)}
              onWithdraw={(id) => withdrawOfferMutation.mutate(id)}
              onOpenCounter={handleOpenCounter}
              isAcceptPending={acceptOfferMutation.isPending}
              isWithdrawPending={withdrawOfferMutation.isPending}
            />

            {meta && (
              <BuyerOfferPagination
                page={page}
                limit={limit}
                total={meta.total}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>

        {/* Code-split Counter Offer Modal */}
        <BuyerCounterOfferModal
          isOpen={counterModalOpen}
          onClose={handleCloseCounter}
          offer={counterOffer}
        />
      </AnimationWrapper>
    </div>
  );
}
