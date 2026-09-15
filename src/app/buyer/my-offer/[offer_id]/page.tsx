"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  useOfferDetailQuery,
  useAcceptOfferMutation,
  useWithdrawOfferMutation,
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
  BuyerOfferSkeleton,
  BuyerOfferSummary,
  BuyerOfferActions,
  BuyerOfferConversation,
  BuyerOfferSidebar,
  formatPrice,
} from "./_components";

const BuyerCounterOfferModal = dynamic(
  () => import("./_components/BuyerCounterOfferModal"),
  { ssr: false }
);

export default function BuyerOfferDetailsPage() {
  const params = useParams();
  const rawId = params?.offer_id;
  const offerId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [updatingStage, setUpdatingStage] = useState<DealStage | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { data: offer, isLoading: isLoadingOffer, isError, error, refetch } = useOfferDetailQuery(offerId);
  const { data: dealsResponse, isLoading: isLoadingDeals } = useDealsQuery({ page: 1, limit: 10 });
  const dealsList = dealsResponse?.data || [];
  const matchedDeal = dealsList.find((d) => d.offerId === offerId || d.id === offerId);
  const targetDealId = matchedDeal?.id || offer?.deal?.id || offer?.id || "";

  const { data: dealDetail } = useDealDetailQuery(targetDealId);
  const { data: dealMessages = [] } = useDealMessagesQuery(targetDealId);

  const acceptOfferMutation = useAcceptOfferMutation();
  const withdrawOfferMutation = useWithdrawOfferMutation();
  const sendDealMessageMutation = useSendDealMessageMutation();
  const updateDealStageMutation = useUpdateDealStageMutation();

  const currentStage = (dealDetail?.stage || offer?.deal?.stage || matchedDeal?.stage || "").toUpperCase() as DealStage | "";

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [offer?.histories, dealMessages, dealDetail]);

  const handleUpdateStage = async (stage: DealStage) => {
    if (!targetDealId) {
      toast.error("No active deal found associated with this offer yet.");
      return;
    }
    setUpdatingStage(stage);
    try {
      const notesMap: Record<DealStage, string> = {
        COMPLETED: "Escrow verification complete. Title transfer confirmed.",
        CANCELLED: "Deal cancelled by buyer.",
        FLAGGED: "Deal flagged for review by buyer.",
      };
      await updateDealStageMutation.mutateAsync({
        dealId: targetDealId,
        payload: { stage, adminNotes: notesMap[stage], isFlagged: stage === "FLAGGED" },
      });
    } catch {
      // Handled in mutation onError toast
    } finally {
      setUpdatingStage(null);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    const activeDealId = offer?.deal?.id || offer?.id;
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

  if (isLoadingOffer || isLoadingDeals) return <BuyerOfferSkeleton />;

  if (isError || !offer) {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-inter flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold font-clash">Failed to load offer details</h2>
        <p className="text-gray-400 text-sm max-w-md text-center">
          {(error as { message?: string })?.message || "The requested offer detail could not be loaded."}
        </p>
        <button onClick={() => refetch()} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer">
          Try Again
        </button>
      </div>
    );
  }

  const listing = offer.listing;
  const seller = offer.seller;
  const statusUpper = (offer.status || "").toUpperCase();
  const allowCounterOffers = listing?.allowCounterOffers ?? false;
  const isFixedWithCounter = (listing?.saleType || "").toUpperCase() === "FIXED_PRICE" && allowCounterOffers;
  const isAccepted = statusUpper === "ACCEPTED" || Boolean(offer?.deal) || Boolean(matchedDeal);
  const isTerminal = ["ACCEPTED", "REJECTED", "DECLINED", "WITHDRAWN", "CANCELLED", "EXPIRED"].includes(statusUpper);
  const showCounterButton = (statusUpper === "COUNTERED" || isFixedWithCounter) && !isTerminal;

  const imageUrl = listing?.media?.[0]?.url || "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200";
  const sellerName = [seller?.firstName, seller?.lastName].filter(Boolean).join(" ").trim() || "Dealer";
  const sellerAvatar = seller?.avatarUrl || "https://i.pravatar.cc/150?u=seller";

  const rawMessages = [
    ...(matchedDeal?.messages || []),
    ...((offer?.deal as { messages?: DealMessage[] } | undefined)?.messages || []),
    ...(dealDetail?.messages || []),
    ...(dealMessages || []),
  ];
  const uniqueMessagesMap = new Map<string, DealMessage>();
  rawMessages.forEach((m) => { if (m?.id) uniqueMessagesMap.set(m.id, m); });

  const formattedDealMessages = Array.from(uniqueMessagesMap.values()).map((m) => {
    const isBuyer = m.senderId === offer.buyerId || m.sender?.role === "BUYER";
    return {
      id: `chat-${m.id}`,
      type: "chat" as const,
      senderId: m.senderId,
      senderName: `${m.sender?.firstName || (isBuyer ? offer.buyer?.firstName || "Buyer" : seller?.firstName || "Seller")} ${m.sender?.lastName || ""}`.trim(),
      senderRole: m.sender?.role || (isBuyer ? "BUYER" : "SELLER"),
      senderAvatar: m.sender?.avatarUrl || (isBuyer ? offer.buyer?.avatarUrl : sellerAvatar),
      text: m.message,
      createdAt: m.createdAt,
    };
  });

  const formattedHistories = (offer.histories || []).map((h) => ({
    id: `history-${h.id}`,
    type: "history" as const,
    senderId: h.senderId,
    senderName: h.senderId === offer.buyerId ? "Buyer" : `${h.sender?.firstName || sellerName} ${h.sender?.lastName || ""}`.trim(),
    senderRole: h.senderId === offer.buyerId ? "BUYER" : "SELLER",
    senderAvatar: h.senderId === offer.buyerId ? undefined : sellerAvatar,
    text: h.note || `Offer updated to ${formatPrice(h.amount)}`,
    amount: h.amount,
    action: h.action,
    createdAt: h.createdAt,
  }));

  const combinedTimeline = [...formattedHistories, ...formattedDealMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="w-full space-y-8">
        <div className="flex items-center gap-2 text-white/60 text-sm md:text-[32px] font-medium font-clash">
          <Link href="/buyer/my-offer" className="hover:text-white transition-colors">My Offers</Link>
          <ChevronRight size={16} />
          <span className="text-white">Negotiation Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-8">
              <BuyerOfferSummary offer={offer} sellerName={sellerName} sellerAvatar={sellerAvatar} />
              <BuyerOfferActions
                offer={offer}
                imageUrl={imageUrl}
                statusUpper={statusUpper}
                showCounterButton={showCounterButton}
                isAccepting={acceptOfferMutation.isPending}
                isWithdrawing={withdrawOfferMutation.isPending}
                onAccept={() => acceptOfferMutation.mutate(offer.id)}
                onOpenCounterModal={() => setCounterModalOpen(true)}
                onWithdraw={() => withdrawOfferMutation.mutate(offer.id)}
              />
            </div>

            {statusUpper === "ACCEPTED" && (
              <BuyerOfferConversation
                offer={offer}
                combinedTimeline={combinedTimeline}
                messageInput={messageInput}
                isSending={sendDealMessageMutation.isPending}
                chatScrollRef={chatScrollRef}
                onMessageInputChange={setMessageInput}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>

          <BuyerOfferSidebar
            offer={offer}
            isAccepted={isAccepted}
            currentStage={currentStage}
            updatingStage={updatingStage}
            isUpdatingStage={updateDealStageMutation.isPending}
            onUpdateStage={handleUpdateStage}
          />
        </div>
      </div>

      <BuyerCounterOfferModal
        isOpen={counterModalOpen}
        onClose={() => setCounterModalOpen(false)}
        offer={offer}
      />
    </div>
  );
}
