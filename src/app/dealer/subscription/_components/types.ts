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

export interface SubscriptionHeaderProps {
  title?: string;
  badgeLabel?: string;
  description?: string;
  isError: boolean;
  onRefresh: () => void;
}

export interface ActiveSubscriptionBannerProps {
  daysRemaining?: number | null;
  expiresAt?: string | null;
  totalFeaturedListings?: number | null;
}

export interface SubscriptionErrorAlertProps {
  errorMessage?: string;
  onReload: () => void;
}

export interface SinglePlanCardProps {
  price?: number;
  duration?: string;
  billingInterval?: string;
  description?: string;
}

export interface UnlimitedPlanCardProps {
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
