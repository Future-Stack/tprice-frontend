export function formatExpiryDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export interface SellerSubscriptionHeaderProps {
  title?: string;
  badgeLabel?: string;
  description?: string;
  isError: boolean;
  onRefresh: () => void;
}

export interface SellerActiveSubscriptionBannerProps {
  daysRemaining?: number | null;
  expiresAt?: string | null;
  totalFeaturedListings?: number | null;
}

export interface SellerSubscriptionErrorAlertProps {
  errorMessage?: string;
  onReload: () => void;
}

export interface SellerSinglePlanCardProps {
  price?: number;
  duration?: string;
  billingInterval?: string;
  description?: string;
}

export interface SellerUnlimitedPlanCardProps {
  price?: number;
  billingInterval?: string;
  description?: string;
  hasActiveSubscription: boolean;
  expiresAt?: string | null;
  daysRemaining?: number | null;
  isPending: boolean;
  isLoading: boolean;
  onSubscribe: () => void;
}
