"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  Handshake,
  Info,
  Send,
  RefreshCcw,
  X,
  Check,
  ChevronDown,
  Circle,
  AlertCircle,
  DollarSign,
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Flag,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useOfferDetailQuery,
  useAcceptOfferMutation,
  useCreateOfferMutation,
  useWithdrawOfferMutation,
  useCounterOfferMutation,
} from "@/hooks/useOffers";
import {
  useDealsQuery,
  useDealDetailQuery,
  useDealMessagesQuery,
  useSendDealMessageMutation,
  useUpdateDealStageMutation,
} from "@/hooks/useDeals";
import { DealMessage, DealStage } from "@/lib/api/deals";
import { toast } from "sonner";
import { OfferDetailItem } from "@/lib/api/offers";

/* ─── Helper Functions ─── */
const formatPrice = (priceStr?: string | number | null) => {
  if (priceStr === undefined || priceStr === null || priceStr === "")
    return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;

  return `${num.toLocaleString()}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/* ─── Counter Offer Modal ─── */
interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferDetailItem | null;
}

const CounterOfferModal = ({
  isOpen,
  onClose,
  offer,
}: CounterOfferModalProps) => {
  const [counterAmount, setCounterAmount] = useState("");
  const [note, setNote] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const counterOfferMutation = useCounterOfferMutation();

  useEffect(() => {
    if (isOpen) {
      setCounterAmount("");
      setNote("");
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250);
  };

  const handleSendCounter = async () => {
    if (!offer) return;
    const amountNum = parseFloat(counterAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid counter offer amount");
      return;
    }

    try {
      await counterOfferMutation.mutateAsync({
        offerId: offer.id,
        payload: {
          amount: amountNum,
          note: note.trim() || undefined,
        },
      });
      handleClose();
    } catch {
      // Handled in mutation onError toast
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md bg-[#111113] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-clash text-white">
            Send Counter Offer
          </h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Counter Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                placeholder="Enter amount..."
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-9 pr-4 text-sm text-white focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add a note for the seller..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-hidden focus:border-[#D4AF37] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSendCounter}
            disabled={counterOfferMutation.isPending}
            className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#c4a132] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {counterOfferMutation.isPending ? "Sending..." : "Submit Counter"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Skeleton Loader Component ─── */
const OfferDetailsSkeleton = () => (
  <div className="min-h-screen bg-black text-white font-inter animate-pulse p-6">
    <div className="w-full space-y-8">
      <div className="h-8 w-64 bg-white/10 rounded-md" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-8">
            <div className="md:col-span-5 space-y-6">
              <div className="h-9 w-64 bg-white/10 rounded-md" />
              <div className="bg-[#111113] rounded-2xl border border-white/5 p-4 h-20 bg-white/5" />
              <div className="bg-[#111113] rounded-3xl border border-white/5 p-6 h-64 bg-white/5" />
              <div className="bg-white/5 rounded-xl p-4 h-16" />
            </div>

            <div className="md:col-span-6 space-y-6">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="aspect-16/10 rounded-[2rem] bg-white/10" />
              <div className="space-y-3 pt-4">
                <div className="h-12 w-full bg-white/10 rounded-xl" />
                <div className="h-12 w-full bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="h-8 w-40 bg-white/10 rounded-md" />
          <div className="bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 h-120 bg-white/5" />
        </div>
      </div>
    </div>
  </div>
);

const OfferDetails = () => {
  const params = useParams();
  const rawId = params?.offer_id;
  const offerId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const {
    data: offer,
    isLoading: isLoadingOffer,
    isError,
    error,
    refetch,
  } = useOfferDetailQuery(offerId);
  const { data: dealsResponse, isLoading: isLoadingDeals } = useDealsQuery({
    page: 1,
    limit: 10,
  });
  const dealsList = dealsResponse?.data || [];
  const matchedDeal = dealsList.find(
    (d) => d.offerId === offerId || d.id === offerId,
  );
  const targetDealId = matchedDeal?.id || offer?.deal?.id || offer?.id || "";

  const { data: dealDetail } = useDealDetailQuery(targetDealId);
  const { data: dealMessages = [] } = useDealMessagesQuery(targetDealId);

  const acceptOfferMutation = useAcceptOfferMutation();
  const createOfferMutation = useCreateOfferMutation();
  const withdrawOfferMutation = useWithdrawOfferMutation();
  const counterOfferMutation = useCounterOfferMutation();
  const sendDealMessageMutation = useSendDealMessageMutation();
  const updateDealStageMutation = useUpdateDealStageMutation();

  const [updatingStage, setUpdatingStage] = useState<DealStage | null>(null);

  const currentStage = (
    dealDetail?.stage ||
    offer?.deal?.stage ||
    matchedDeal?.stage ||
    ""
  ).toUpperCase() as DealStage | "";

  const handleUpdateStage = async (stage: DealStage) => {
    if (!targetDealId) {
      toast.error("No active deal found associated with this offer yet.");
      return;
    }

    setUpdatingStage(stage);
    try {
      const adminNotesMap: Record<DealStage, string> = {
        COMPLETED: "Escrow verification complete. Title transfer confirmed.",
        CANCELLED: "Deal cancelled by buyer.",
        FLAGGED: "Deal flagged for review by buyer.",
      };

      await updateDealStageMutation.mutateAsync({
        dealId: targetDealId,
        payload: {
          stage,
          adminNotes: adminNotesMap[stage],
          isFlagged: stage === "FLAGGED",
        },
      });
    } catch {
      // Handled in mutation onError toast
    } finally {
      setUpdatingStage(null);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [offer?.histories, dealMessages, dealDetail]);

  if (isLoadingOffer || isLoadingDeals) {
    return <OfferDetailsSkeleton />;
  }

  if (isError || !offer) {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-inter flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold font-clash">
          Failed to load offer details
        </h2>
        <p className="text-gray-400 text-sm max-w-md text-center">
          {(error as any)?.message ||
            "The requested offer detail could not be loaded."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const listing = offer.listing;
  const seller = offer.seller;
  const histories = offer.histories || [];

  const saleType = (listing?.saleType || "").toUpperCase();
  const allowCounterOffers = listing?.allowCounterOffers ?? false;
  const isFixedWithCounter = saleType === "FIXED_PRICE" && allowCounterOffers;
  const statusUpper = (offer.status || "").toUpperCase();
  const isAccepted =
    statusUpper === "ACCEPTED" ||
    Boolean(offer?.deal) ||
    Boolean(matchedDeal);
  const isTerminalStatus =
    statusUpper === "ACCEPTED" ||
    statusUpper === "REJECTED" ||
    statusUpper === "DECLINED" ||
    statusUpper === "WITHDRAWN" ||
    statusUpper === "CANCELLED" ||
    statusUpper === "EXPIRED";

  const showCounterButton =
    (statusUpper === "COUNTERED" || isFixedWithCounter) && !isTerminalStatus;

  const imageUrl =
    listing?.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200";

  const sellerName = seller
    ? `${seller.firstName || ""} ${seller.lastName || ""}`.trim() || "Dealer"
    : "Dealer";
  const sellerAvatar =
    seller?.avatarUrl || "https://i.pravatar.cc/150?u=seller";

  const formattedHistories = histories.map((h) => {
    const isBuyer = h.senderId === offer.buyerId;
    return {
      id: `history-${h.id}`,
      type: "history" as const,
      senderId: h.senderId,
      senderName: isBuyer
        ? "Buyer"
        : `${h.sender?.firstName || sellerName} ${h.sender?.lastName || ""}`.trim(),
      senderRole: isBuyer ? "BUYER" : "SELLER",
      senderAvatar: isBuyer ? undefined : sellerAvatar,
      text: h.note || `Offer updated to ${formatPrice(h.amount)}`,
      amount: h.amount as string | undefined,
      action: h.action as string | undefined,
      createdAt: h.createdAt,
    };
  });

  const embeddedDealMessages: DealMessage[] = [
    ...((matchedDeal as any)?.messages || []),
    ...((offer?.deal as any)?.messages || []),
    ...((dealDetail as any)?.messages || []),
  ];

  const rawDealMessagesList = [
    ...embeddedDealMessages,
    ...(dealMessages || []),
  ];

  const uniqueMessagesMap = new Map<string, DealMessage>();
  rawDealMessagesList.forEach((m) => {
    if (m && m.id) {
      uniqueMessagesMap.set(m.id, m);
    }
  });
  const combinedDealMessages = Array.from(uniqueMessagesMap.values());

  const formattedDealMessages = combinedDealMessages.map((m) => {
    const isBuyer = m.senderId === offer.buyerId || m.sender?.role === "BUYER";
    const senderFirstName =
      m.sender?.firstName ||
      (isBuyer
        ? offer.buyer?.firstName || "Buyer"
        : seller?.firstName || "Seller");
    const senderLastName =
      m.sender?.lastName ||
      (isBuyer ? offer.buyer?.lastName || "" : seller?.lastName || "");
    const senderFullName = `${senderFirstName} ${senderLastName}`.trim();
    const senderRole = m.sender?.role || (isBuyer ? "BUYER" : "SELLER");

    return {
      id: `chat-${m.id}`,
      type: "chat" as const,
      senderId: m.senderId,
      senderName: senderFullName,
      senderRole: senderRole,
      senderAvatar:
        m.sender?.avatarUrl ||
        (isBuyer ? offer.buyer?.avatarUrl : sellerAvatar),
      text: m.message,
      amount: undefined as string | undefined,
      action: undefined as string | undefined,
      createdAt: m.createdAt,
    };
  });

  const combinedTimeline = [
    ...formattedHistories,
    ...formattedDealMessages,
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const handleAccept = () => {
    acceptOfferMutation.mutate(offer.id);
  };

  const handleWithdraw = () => {
    withdrawOfferMutation.mutate(offer.id);
  };

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    const targetDealId = offer.deal?.id || offer.id;
    if (!targetDealId) {
      toast.error("Unable to send message: Deal identifier is missing.");
      return;
    }

    try {
      await sendDealMessageMutation.mutateAsync({
        dealId: targetDealId,
        message: trimmed,
      });
      setMessageInput("");
    } catch {
      // Handled in mutation onError toast
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="w-full space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-white/60 text-sm md:text-[32px] font-medium font-clash">
          <Link
            href="/buyer/my-offer"
            className="hover:text-white transition-colors"
          >
            My Offers
          </Link>
          <ChevronRight size={16} />
          <span className="text-white">Negotiation Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left & Middle Container */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-8">
              {/* Left Column (Seller & Summary) */}
              <div className="md:col-span-5 space-y-6">
                <AnimationWrapper type="fade-right">
                  <h1 className="text-3xl md:text-[32px] font-medium font-clash tracking-tight mb-6">
                    {listing?.title || "Untitled Listing"}
                  </h1>

                  {/* Seller Card */}
                  <div className="bg-[#111113] rounded-2xl border border-white/5 p-4 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={sellerAvatar}
                          alt={sellerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white/90">
                          {sellerName}
                        </div>
                        <div className="text-[10px] text-green-500/80 flex items-center gap-1">
                          <Check size={10} /> Verified Dealer
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E78F23] shadow-[0_0_8px_rgba(231,143,35,0.5)]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                        {offer.status || "Negotiation"}
                      </span>
                    </div>
                  </div>

                  {/* Deal Summary Card */}
                  <div className="bg-[#111113] rounded-3xl border border-white/5 p-6 md:p-8 space-y-8 mb-3">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                      Deal Summary
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 mb-1">
                          Current Offer
                        </div>
                        <div className="flex text-[32px] md:text-[40px] font-black text-[#D4AF37] leading-none tracking-tight">
                          <DollarSign />
                          {formatPrice(
                            offer.currentAmount || offer.initialAmount,
                          )}
                        </div>
                        {listing?.askingPrice && (
                          <div className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
                            Asking: {formatPrice(listing.askingPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-gray-500 uppercase tracking-widest">
                          Last Updated
                        </span>
                        <span className="text-white/80">
                          {formatDate(offer.updatedAt || offer.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-gray-500 uppercase tracking-widest">
                          Offer ID
                        </span>
                        <span className="text-white/80 font-mono tracking-normal">
                          {offer.id}
                        </span>
                      </div>
                      {listing?.askingPrice && (
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-gray-500 uppercase tracking-widest">
                            Listed Price
                          </span>
                          <span className="text-white/80">
                            {formatPrice(listing.askingPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Smart Insight */}
                  <div className="bg-[#E78F23]/10 border border-[#E78F23]/20 rounded-xl p-4 flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E78F23] flex items-center justify-center shrink-0 mt-0.5">
                      <Info size={12} className="text-black font-bold" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-[#E78F23] uppercase tracking-wider">
                        Smart Insight
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#E78F23]/90">
                        {offer.roundsCount && offer.roundsCount > 1
                          ? `${offer.roundsCount} negotiation rounds recorded — active conversation with seller.`
                          : "Initial offer placed — awaiting seller counter or acceptance."}
                      </p>
                    </div>
                  </div>
                </AnimationWrapper>
              </div>

              {/* Middle Column (Image & Actions) */}
              <div className="md:col-span-6 space-y-6">
                <AnimationWrapper type="fade-left">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <MapPin size={14} className="text-gray-600" />
                    Verified Listing
                  </div>

                  {/* Main Product Image */}
                  <div className="relative aspect-16/10 rounded-[2rem] overflow-hidden border border-white/5 group">
                    <Image
                      src={imageUrl}
                      alt={listing?.title || "Listing image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    {statusUpper === "COUNTERED" && (
                      <button
                        onClick={handleAccept}
                        disabled={acceptOfferMutation.isPending}
                        className="w-full py-4.5 bg-[#D4AF37] hover:bg-[#c4a132] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                        <Handshake size={18} />
                        {acceptOfferMutation.isPending
                          ? "Accepting..."
                          : "Accept offer"}
                      </button>
                    )}

                    {showCounterButton && (
                      <button
                        onClick={() => setCounterModalOpen(true)}
                        className="w-full py-4.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                        <RefreshCcw size={16} />
                        Send Counter Offer
                      </button>
                    )}

                    {statusUpper !== "ACCEPTED" &&
                      statusUpper !== "REJECTED" &&
                      statusUpper !== "WITHDRAWN" && (
                        <button
                          onClick={handleWithdraw}
                          disabled={withdrawOfferMutation.isPending}
                          className="w-full py-4.5 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 disabled:opacity-50 text-[#FF4D4D] font-bold text-xs uppercase tracking-[0.15em] rounded-xl border border-[#8B0000]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                          <X
                            size={16}
                            className={
                              withdrawOfferMutation.isPending
                                ? "animate-spin"
                                : ""
                            }
                          />
                          {withdrawOfferMutation.isPending
                            ? "Withdrawing..."
                            : "Withdraw Offer"}
                        </button>
                      )}
                  </div>
                </AnimationWrapper>
              </div>
            </div>

            {/* Conversation Section */}
            {statusUpper === "ACCEPTED" && (
              <AnimationWrapper type="fade-up">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold font-clash flex items-center gap-3">
                      Conversation
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-sans font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Chat
                      </span>
                    </h2>
                    <span className="text-xs text-gray-400">
                      {combinedTimeline.length} message
                      {combinedTimeline.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="bg-[#111113] rounded-[2rem] border border-white/5 p-6 md:p-8 space-y-6">
                    <div
                      ref={chatScrollRef}
                      className="space-y-6 max-h-100 overflow-y-auto pr-2 custom-scrollbar"
                    >
                      {combinedTimeline.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm flex flex-col items-center gap-2">
                          <MessageSquare size={24} className="text-gray-600" />
                          No conversation messages recorded yet. Start the
                          conversation below.
                        </div>
                      ) : (
                        combinedTimeline.map((item) => {
                          const isSelf =
                            item.senderId === offer.buyerId ||
                            item.senderRole === "BUYER";
                          return (
                            <div
                              key={item.id}
                              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] p-5 rounded-2xl text-sm leading-relaxed ${
                                  item.type === "history"
                                    ? isSelf
                                      ? "bg-[#2D2D20] border border-[#D4AF37]/30 text-white/90 rounded-br-none"
                                      : "bg-white/5 border border-white/10 text-white/90 rounded-bl-none"
                                    : isSelf
                                      ? "bg-[#2D2D20] border border-[#D4AF37]/40 text-white rounded-br-none"
                                      : "bg-white/5 border border-white/15 text-white/90 rounded-bl-none"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                                    {isSelf ? "You" : item.senderName}
                                    {item.senderRole && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-gray-300">
                                        {item.senderRole}
                                      </span>
                                    )}
                                  </div>
                                  {item.amount && (
                                    <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                      {formatPrice(item.amount)}
                                    </span>
                                  )}
                                </div>
                                <p className="whitespace-pre-wrap">
                                  {item.text}
                                </p>
                                <div className="text-[10px] text-gray-500 mt-2.5 uppercase tracking-tight flex items-center justify-between">
                                  <span>{formatDate(item.createdAt)}</span>
                                  {item.type === "history" && item.action && (
                                    <span className="text-[9px] text-gray-400 font-mono">
                                      ({item.action})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="relative group/input mt-8">
                      <input
                        type="text"
                        placeholder="Type a message to seller..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !sendDealMessageMutation.isPending
                          ) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-14 text-sm focus:outline-hidden focus:border-[#D4AF37]/50 transition-all placeholder:text-gray-600"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={
                          sendDealMessageMutation.isPending ||
                          !messageInput.trim()
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center hover:bg-[#c4a132] disabled:opacity-50 transition-colors"
                      >
                        {sendDealMessageMutation.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </AnimationWrapper>
            )}
          </div>

          {/* Right Column (Deal Stage & Order History) */}
          <div className="lg:col-span-4">
            <AnimationWrapper type="fade-left">
              <div className="space-y-6">
                {/* Deal Stage Card */}
                {(isAccepted || Boolean(offer?.deal)) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold font-clash">
                        Deal Stage
                      </h2>
                      {currentStage && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/80">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              currentStage === "COMPLETED"
                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                : currentStage === "CANCELLED"
                                ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                                : currentStage === "FLAGGED"
                                ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                : "bg-[#D4AF37]"
                            }`}
                          />
                          {currentStage}
                        </div>
                      )}
                    </div>

                    <div className="bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 md:p-8 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {/* COMPLETED Button */}
                        <button
                          onClick={() => handleUpdateStage("COMPLETED")}
                          disabled={
                            updateDealStageMutation.isPending ||
                            currentStage === "COMPLETED"
                          }
                          title="Mark deal as COMPLETED"
                          className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                            currentStage === "COMPLETED"
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                              : "bg-white/5 hover:bg-emerald-500/10 border-white/10 text-gray-300 hover:text-emerald-400 hover:border-emerald-500/30"
                          } disabled:opacity-50 cursor-pointer active:scale-95`}
                        >
                          {updatingStage === "COMPLETED" ? (
                            <Loader2 size={18} className="animate-spin text-emerald-400" />
                          ) : (
                            <CheckCircle2 size={18} />
                          )}
                          <span className="text-[10px]">Completed</span>
                        </button>

                        {/* CANCELLED Button */}
                        <button
                          onClick={() => handleUpdateStage("CANCELLED")}
                          disabled={
                            updateDealStageMutation.isPending ||
                            currentStage === "CANCELLED"
                          }
                          title="Mark deal as CANCELLED"
                          className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                            currentStage === "CANCELLED"
                              ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                              : "bg-white/5 hover:bg-red-500/10 border-white/10 text-gray-300 hover:text-red-400 hover:border-red-500/30"
                          } disabled:opacity-50 cursor-pointer active:scale-95`}
                        >
                          {updatingStage === "CANCELLED" ? (
                            <Loader2 size={18} className="animate-spin text-red-400" />
                          ) : (
                            <XCircle size={18} />
                          )}
                          <span className="text-[10px]">Cancelled</span>
                        </button>

                        {/* FLAGGED Button */}
                        <button
                          onClick={() => handleUpdateStage("FLAGGED")}
                          disabled={
                            updateDealStageMutation.isPending ||
                            currentStage === "FLAGGED"
                          }
                          title="Mark deal as FLAGGED"
                          className={`py-3.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all border ${
                            currentStage === "FLAGGED"
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                              : "bg-white/5 hover:bg-amber-500/10 border-white/10 text-gray-300 hover:text-amber-400 hover:border-amber-500/30"
                          } disabled:opacity-50 cursor-pointer active:scale-95`}
                        >
                          {updatingStage === "FLAGGED" ? (
                            <Loader2 size={18} className="animate-spin text-amber-400" />
                          ) : (
                            <Flag size={18} />
                          )}
                          <span className="text-[10px]">Flagged</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order History */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold font-clash">
                    Order History
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white/60 cursor-pointer hover:text-white transition-colors">
                    recent <ChevronDown size={14} />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-px bg-linear-to-b from-[#D4AF37]/10 to-transparent rounded-[2rem] opacity-50 pointer-events-none" />

                  <div className="relative bg-[#0A0A0B] rounded-[2.5rem] border border-white/5 p-6 md:p-8 space-y-6 h-full min-h-150">
                    <div className="space-y-4">
                      {histories.map((item, idx) => {
                        const isBuyer = item.senderId === offer.buyerId;
                        const isLatest = idx === histories.length - 1;
                        return (
                          <div
                            key={item.id}
                            className={`relative group p-5 rounded-2xl border transition-all duration-300 ${
                              isLatest
                                ? "bg-white/5 border-[#D4AF37]/30 ring-1 ring-[#D4AF37]/20"
                                : "bg-white/2 border-white/5 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <div className="relative">
                                <Circle
                                  size={10}
                                  fill={isBuyer ? "#3B82F6" : "#D4AF37"}
                                  className={
                                    isBuyer ? "text-blue-500" : "text-[#D4AF37]"
                                  }
                                />
                              </div>

                              <div className="grow flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    {item.action || "Offer"}
                                  </div>
                                  <div className="font-bold text-sm text-white/90">
                                    {isBuyer ? "Buyer Offer" : "Dealer Counter"}
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-medium">
                                    {formatDate(item.createdAt)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div
                                    className={`text-lg md:text-xl font-black tracking-tight ${
                                      isLatest ? "text-white" : "text-white/80"
                                    }`}
                                  >
                                    {formatPrice(item.amount)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </div>

      {/* Counter Offer Modal */}
      <CounterOfferModal
        isOpen={counterModalOpen}
        onClose={() => setCounterModalOpen(false)}
        offer={offer}
      />
    </div>
  );
};

export default OfferDetails;
