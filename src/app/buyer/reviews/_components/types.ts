import type { ReviewItem } from "@/lib/api/reviews";

export type { ReviewItem };

export const RECOMMENDED_TAGS = [
  "BUGATTI CHIRON",
  "MONACO PENTHOUSE",
  "SUPERCAR ACCESS",
  "OFF-MARKET ASSETS",
  "PRIVATE YACHT",
  "VIP SERVICE",
];

export interface ReviewCardProps {
  review: ReviewItem;
}

export interface ReviewFormProps {
  userFullName?: string;
  userAvatarUrl?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface UpdateReviewModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
}
