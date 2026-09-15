import type { OfferDetailItem } from "@/lib/api/offers";
import type { DealStage } from "@/lib/api/deals";

export type { OfferDetailItem, DealStage };

export interface TimelineChatItem {
  id: string;
  type: "history" | "chat";
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string | null;
  text: string;
  amount?: string;
  action?: string;
  createdAt: string;
}

export function formatPrice(priceStr?: string | number | null): string {
  if (priceStr === undefined || priceStr === null || priceStr === "") return "$0";
  const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
  if (isNaN(num)) return `${priceStr}`;
  return `${num.toLocaleString()}`;
}

export function formatDate(dateString?: string): string {
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
}

export interface BuyerOfferSummaryProps {
  offer: OfferDetailItem;
  sellerName: string;
  sellerAvatar: string;
}

export interface BuyerOfferActionsProps {
  offer: OfferDetailItem;
  imageUrl: string;
  statusUpper: string;
  showCounterButton: boolean;
  isAccepting: boolean;
  isWithdrawing: boolean;
  onAccept: () => void;
  onOpenCounterModal: () => void;
  onWithdraw: () => void;
}

export interface BuyerOfferConversationProps {
  offer: OfferDetailItem;
  combinedTimeline: TimelineChatItem[];
  messageInput: string;
  isSending: boolean;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
  onMessageInputChange: (val: string) => void;
  onSendMessage: () => void;
}

export interface BuyerOfferSidebarProps {
  offer: OfferDetailItem;
  isAccepted: boolean;
  currentStage: DealStage | "";
  updatingStage: DealStage | null;
  isUpdatingStage: boolean;
  onUpdateStage: (stage: DealStage) => void;
}

export interface BuyerCounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferDetailItem | null;
}
