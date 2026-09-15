export interface SpecItemData {
  label: string;
  value: string;
}

export interface VIPViewModel {
  productImages: string[];
  locationText: string;
  badgeLabel: string;
  formattedPrice: string;
  currentBidLabel: string;
  sellerName: string;
  sellerBadge: string;
  sellerInitial: string;
  specItems: SpecItemData[];
  overviewText: string;
  formattedVipFee: string;
  formattedTotalPayable: string;
}

export interface VIPGallerySectionProps {
  title: string;
  images: string[];
  selectedImage: number;
  onSelectImage: (idx: number) => void;
  isSaved: boolean;
  onToggleSave: (e?: React.MouseEvent) => void;
  copied: boolean;
  onShare: () => void;
}

export interface VIPOverviewSectionProps {
  overviewText: string;
}

export interface VIPDetailsSidebarProps {
  vm: VIPViewModel;
  title: string;
  sellerAvatarUrl?: string | null;
  onPlaceBid: () => void;
  onSendOffer: () => void;
}

export interface VIPBiddingSidebarProps {
  vm: VIPViewModel;
  title: string;
  categoryFallback: string;
  sellerAvatarUrl?: string | null;
  inclFees: boolean;
  onToggleInclFees: () => void;
  isSaved: boolean;
  onToggleSave: (e?: React.MouseEvent) => void;
  copied: boolean;
  onShare: () => void;
  onSubmitBid: () => void;
  onCancelBidding: () => void;
}

export interface VIPErrorStateProps {
  errorMessage?: string;
  onRetry: () => void;
  backLink: string;
}
