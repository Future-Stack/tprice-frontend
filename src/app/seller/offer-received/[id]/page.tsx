"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useOfferDetailQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} from "@/hooks/useOffers";
import {
  useDealsQuery,
  useDealDetailQuery,
  useDealMessagesQuery,
  useSendDealMessageMutation,
  useUpdateDealStageMutation,
} from "@/hooks/useDeals";
import { DealMessage, DealStage } from "@/lib/api/deals";

import {
  OfferDetailSkeleton,
  OfferHeaderCard,
  OfferStatsGrid,
  OfferTimelineSection,
  OfferConversationSection,
  OfferSidebarSection,
  formatCurrency,
} from "./_components";

const CounterOfferModal = dynamic(() => import("../CounterOfferModal"), {
  ssr: false,
});

export default function OfferDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const offerId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [updatingStage, setUpdatingStage] = useState<DealStage | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { data: offer, isLoading, isError, refetch } = useOfferDetailQuery(offerId);
  const { data: dealsResponse } = useDealsQuery({ page: 1, limit: 10 });
  const matchedDeal = dealsResponse?.data?.find((d) => d.offerId === offerId || d.id === offerId);
  const targetDealId = matchedDeal?.id || offer?.deal?.id || offer?.id || "";

  const { data: dealDetail } = useDealDetailQuery(targetDealId);
  const { data: dealMessages = [] } = useDealMessagesQuery(targetDealId);

  const { mutate: acceptOffer } = useAcceptOfferMutation();
  const { mutate: rejectOffer } = useRejectOfferMutation();
  const sendDealMessageMutation = useSendDealMessageMutation();
  const updateDealStageMutation = useUpdateDealStageMutation();

  const currentStage = (dealDetail?.stage || offer?.deal?.stage || matchedDeal?.stage || "").toUpperCase() as DealStage | "";

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [offer?.histories, dealMessages, dealDetail]);

  const handleAccept = () => {
    if (!offerId) return;
    setAccepting(true);
    acceptOffer(offerId, { onSettled: () => setAccepting(false) });
  };

  const handleReject = () => {
    if (!offerId) return;
    setRejecting(true);
    rejectOffer(offerId, { onSettled: () => setRejecting(false) });
  };

  const handleCopyId = () => {
    if (!offerId) return;
    navigator.clipboard.writeText(offerId);
    setCopiedId(true);
    toast.success("Offer ID copied to clipboard");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleUpdateStage = async (stage: DealStage) => {
    if (!targetDealId) {
      toast.error("No active deal found associated with this offer yet.");
      return;
    }
    setUpdatingStage(stage);
    try {
      const notes: Record<DealStage, string> = {
        COMPLETED: "Escrow verification complete. Title transfer confirmed.",
        CANCELLED: "Deal cancelled by seller.",
        FLAGGED: "Deal flagged for review by seller.",
      };
      await updateDealStageMutation.mutateAsync({
        dealId: targetDealId,
        payload: { stage, adminNotes: notes[stage], isFlagged: stage === "FLAGGED" },
      });
      refetch();
    } catch {
      // Handled in mutation onError toast
    } finally {
      setUpdatingStage(null);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    const activeDealId = targetDealId || offer?.deal?.id || offer?.id;
    if (!activeDealId) {
      toast.error("Unable to send message: Deal identifier is missing.");
      return;
    }
    try {
      await sendDealMessageMutation.mutateAsync({ dealId: activeDealId, message: trimmed });
      setMessageInput("");
    } catch {
      // Handled in mutation onError toast
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8">
        <OfferDetailSkeleton />
      </div>
    );
  }

  if (isError || !offer) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="p-10 rounded-2xl bg-[#111113] border border-white/5 shadow-2xl space-y-5">
          <AlertCircle size={56} className="mx-auto text-rose-500 stroke-[1.5]" />
          <h2 className="text-2xl font-bold text-white">Offer Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            We couldn&apos;t load the details for this offer. It may have been deleted or the URL might be invalid.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/seller/offer-received" className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:border-white/30 transition-all">
              Back to Offers
            </Link>
            <button onClick={() => refetch()} className="px-6 py-2.5 rounded-xl bg-[#E78F23] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E78F23]/90 transition-all cursor-pointer">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPending = offer.status?.toUpperCase() === "PENDING" || offer.status?.toUpperCase() === "ACTION REQUIRED" || offer.status?.toUpperCase() === "COUNTERED";
  const isAccepted = offer.status?.toUpperCase() === "ACCEPTED";
  const allowCounterOffers = offer.listing?.allowCounterOffers === true;
  const currency = offer.listing?.currency || "USD";
  const buyerName = [offer.buyer?.firstName, offer.buyer?.lastName].filter(Boolean).join(" ").trim() || "Buyer";
  const sellerName = [offer.seller?.firstName, offer.seller?.lastName].filter(Boolean).join(" ").trim() || "Seller";

  let priceDiffPercent: number | null = null;
  if (offer.listing?.askingPrice && offer.currentAmount) {
    const asking = parseFloat(offer.listing.askingPrice);
    const current = parseFloat(offer.currentAmount);
    if (!isNaN(asking) && !isNaN(current) && asking > 0) {
      priceDiffPercent = Math.round(((current - asking) / asking) * 100);
    }
  }

  const rawMessages = [
    ...((matchedDeal as { messages?: DealMessage[] })?.messages || []),
    ...((offer.deal as { messages?: DealMessage[] })?.messages || []),
    ...((dealDetail as { messages?: DealMessage[] })?.messages || []),
    ...(dealMessages || []),
  ];
  const uniqueMessagesMap = new Map<string, DealMessage>();
  rawMessages.forEach((m) => { if (m?.id) uniqueMessagesMap.set(m.id, m); });

  const formattedDealMessages = Array.from(uniqueMessagesMap.values()).map((m) => {
    const isSeller = m.senderId === offer.sellerId || m.sender?.role === "SELLER";
    return {
      id: `chat-${m.id}`,
      type: "chat" as const,
      senderId: m.senderId,
      senderName: `${m.sender?.firstName || (isSeller ? offer.seller?.firstName || "Seller" : offer.buyer?.firstName || "Buyer")} ${m.sender?.lastName || ""}`.trim(),
      senderRole: m.sender?.role || (isSeller ? "SELLER" : "BUYER"),
      senderAvatar: m.sender?.avatarUrl || (isSeller ? offer.seller?.avatarUrl : offer.buyer?.avatarUrl),
      text: m.message,
      createdAt: m.createdAt,
    };
  });

  const formattedHistories = (offer.histories || []).map((h) => ({
    id: `history-${h.id}`,
    type: "history" as const,
    senderId: h.senderId,
    senderName: h.senderId === offer.buyerId ? buyerName : `${h.sender?.firstName || sellerName} ${h.sender?.lastName || ""}`.trim(),
    senderRole: h.senderId === offer.buyerId ? "BUYER" : "SELLER",
    senderAvatar: h.senderId === offer.buyerId ? offer.buyer?.avatarUrl : offer.seller?.avatarUrl,
    text: h.note || `Offer updated to ${formatCurrency(h.amount, currency)}`,
    amount: h.amount,
    action: h.action,
    createdAt: h.createdAt,
  }));

  const combinedTimeline = [...formattedHistories, ...formattedDealMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="w-full max-w-full mx-auto">
      <AnimationWrapper type="fade-up">
        <div className="mb-6">
          <Link href="/seller/offer-received" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Offers Received</span>
          </Link>
        </div>

        <OfferHeaderCard
          offer={offer}
          isPending={isPending}
          allowCounterOffers={allowCounterOffers}
          accepting={accepting}
          rejecting={rejecting}
          copiedId={copiedId}
          onCopyId={handleCopyId}
          onAccept={handleAccept}
          onOpenCounterModal={() => setCounterModalOpen(true)}
          onReject={handleReject}
        />

        <OfferStatsGrid
          formattedCurrentAmount={formatCurrency(offer.currentAmount, currency)}
          formattedInitialAmount={formatCurrency(offer.initialAmount, currency)}
          formattedAskingPrice={offer.listing?.askingPrice ? formatCurrency(offer.listing.askingPrice, currency) : "N/A"}
          priceDiffPercent={priceDiffPercent}
          roundsCount={offer.roundsCount}
          updatedAt={offer.updatedAt}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <OfferTimelineSection
              offer={offer}
              currency={currency}
              formattedAskingPrice={offer.listing?.askingPrice ? formatCurrency(offer.listing.askingPrice, currency) : "N/A"}
              buyerName={buyerName}
              sellerName={sellerName}
            />

            {(isAccepted || Boolean(offer.deal)) && (
              <OfferConversationSection
                offer={offer}
                combinedTimeline={combinedTimeline}
                currency={currency}
                messageInput={messageInput}
                isSending={sendDealMessageMutation.isPending}
                chatScrollRef={chatScrollRef}
                onMessageInputChange={setMessageInput}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            <OfferSidebarSection
              offer={offer}
              isAccepted={isAccepted}
              currentStage={currentStage}
              updatingStage={updatingStage}
              isUpdatingStage={updateDealStageMutation.isPending}
              buyerInitial={(offer.buyer?.firstName || offer.buyer?.lastName || "B").charAt(0).toUpperCase()}
              buyerName={buyerName}
              sellerName={sellerName}
              onUpdateStage={handleUpdateStage}
            />
          </div>
        </div>
      </AnimationWrapper>

      <CounterOfferModal
        isOpen={counterModalOpen}
        onClose={() => setCounterModalOpen(false)}
        offer={offer}
      />
    </div>
  );
}
