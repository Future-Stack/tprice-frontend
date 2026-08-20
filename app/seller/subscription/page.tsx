"use client";

import React from "react";
import {
  Sparkles,
  Check,
  CheckCircle2,
  ShieldCheck,
  Crown,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Info,
  Calendar,
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import {
  useFeaturedPricingQuery,
  useFeaturedStatusQuery,
} from "@/hooks/useListings";
import { useCreateCheckoutSessionMutation } from "@/hooks/usePayments";
import { getPaymentReturnUrl } from "@/lib/api/payments";
import { toast } from "sonner";

function formatExpiryDate(dateStr?: string | null): string {
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

export default function SellerSubscriptionPage() {
  const {
    data: pricingData,
    isLoading: isPricingLoading,
    isError: isPricingError,
    error: pricingError,
    refetch: refetchPricing,
  } = useFeaturedPricingQuery();

  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
    error: statusError,
    refetch: refetchStatus,
  } = useFeaturedStatusQuery();

  const { mutate: createCheckoutSession, isPending } =
    useCreateCheckoutSessionMutation();

  const isLoading = isPricingLoading || isStatusLoading;
  const isError = isPricingError || isStatusError;
  const error = pricingError || statusError;

  const handleRefetch = () => {
    refetchPricing();
    refetchStatus();
  };

  const handleSubscribeUnlimited = () => {
    const successUrl = getPaymentReturnUrl("/payment/success");
    const cancelUrl = getPaymentReturnUrl("/payment/cancel");

    createCheckoutSession(
      {
        type: pricingData?.unlimitedAnnual?.plan || "FEATURED_UNLIMITED_ANNUAL",
        successUrl,
        cancelUrl,
      },
      {
        onSuccess: (data) => {
          const checkoutUrl =
            data?.checkoutUrl ||
            (data as any)?.data?.checkoutUrl ||
            (data as any)?.url;

          if (checkoutUrl) {
            toast.success("Redirecting to secure Stripe checkout...");
            window.location.assign(checkoutUrl);
          } else {
            toast.error(
              "Checkout session created, but no checkout URL was returned."
            );
          }
        },
        onError: (err: any) => {
          let errorMessage = "Failed to initiate subscription checkout.";
          const rawMsg = err?.response?.data?.message;
          if (Array.isArray(rawMsg)) {
            errorMessage = rawMsg.join(", ");
          } else if (typeof rawMsg === "string" && rawMsg.trim()) {
            errorMessage = rawMsg;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          toast.error(errorMessage);
        },
      }
    );
  };

  const singlePlan = pricingData?.singleListing;
  const unlimitedPlan = pricingData?.unlimitedAnnual;
  const hasActiveSubscription = Boolean(statusData?.hasActiveSubscription);

  return (
    <div className="space-y-10 relative z-0 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Crown className="w-3.5 h-3.5" />
              Featured Placements & Subscriptions
            </div>
            <h1 className="text-3xl sm:text-4xl font-clash font-medium text-white tracking-tight">
              Seller Subscription Plans
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl font-inter leading-relaxed">
              Maximize your inventory reach. Feature your luxury assets at the top
              of marketplace searches, VIP deals, and buyer recommendations.
            </p>
          </div>

          {isError && (
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Loading
            </button>
          )}
        </div>
      </AnimationWrapper>

      {/* Active Subscription Banner (Visible when seller has purchased active plan) */}
      {!isLoading && hasActiveSubscription && (
        <AnimationWrapper type="fade-up" duration={0.4}>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#18181A] to-emerald-950/30 border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Plan
                  </span>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-emerald-400 font-semibold font-mono">
                    {statusData?.daysRemaining ?? 0} Days Remaining
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-clash font-semibold text-white flex items-center gap-2">
                  Unlimited Annual Featured Subscription
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 flex-wrap">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Valid until{" "}
                    <strong className="text-white font-medium">
                      {formatExpiryDate(statusData?.expiresAt)}
                    </strong>
                    . All current & upcoming listings automatically enjoy VIP featured placement.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10 self-stretch sm:self-center shrink-0">
              <div className="px-5 py-3 rounded-xl bg-white/[0.05] border border-emerald-500/30 text-center flex-1 sm:flex-initial">
                <span className="text-xs text-gray-400 block font-inter uppercase tracking-wider">
                  Featured Listings
                </span>
                <span className="text-lg font-bold font-clash text-emerald-400">
                  {statusData?.totalFeaturedListings ?? 0} Active
                </span>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      )}

      {/* Error Banner */}
      {isError && (
        <AnimationWrapper type="fade-up" duration={0.4}>
          <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-4 text-red-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                {(error as any)?.response?.data?.message ||
                  error?.message ||
                  "Unable to load subscription pricing and status. Please try again."}
              </p>
            </div>
            <button
              onClick={handleRefetch}
              className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer"
            >
              Reload
            </button>
          </div>
        </AnimationWrapper>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skeleton Card 1 */}
          <div className="bg-[#18181A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between animate-pulse relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-white/10 rounded-md" />
                  <div className="h-4 w-28 bg-white/5 rounded-md" />
                </div>
                <div className="h-7 w-24 bg-white/10 rounded-full" />
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="h-10 w-28 bg-white/15 rounded-lg" />
                  <div className="h-4 w-20 bg-white/10 rounded-md" />
                </div>
                <div className="h-4 w-full bg-white/5 rounded-md" />
                <div className="h-4 w-3/4 bg-white/5 rounded-md" />
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 shrink-0" />
                    <div className="h-4 w-5/6 bg-white/10 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/5">
              <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5" />
            </div>
          </div>

          {/* Skeleton Card 2 */}
          <div className="bg-[#18181A] border border-primary/40 rounded-2xl p-8 flex flex-col justify-between animate-pulse relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-primary/20 rounded-md" />
                  <div className="h-4 w-32 bg-primary/10 rounded-md" />
                </div>
                <div className="h-7 w-28 bg-primary/20 rounded-full" />
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="h-10 w-32 bg-white/15 rounded-lg" />
                  <div className="h-4 w-24 bg-white/10 rounded-md" />
                </div>
                <div className="h-4 w-full bg-white/5 rounded-md" />
                <div className="h-4 w-4/5 bg-white/5 rounded-md" />
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 shrink-0" />
                    <div className="h-4 w-5/6 bg-white/10 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/5">
              <div className="h-13 w-full bg-primary/30 rounded-xl" />
            </div>
          </div>
        </div>
      ) : (
        /* Pricing Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Single Listing Featured (NO ACTION BUTTON) */}
          <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
            <div className="h-full bg-[#18181A] border border-white/10 hover:border-white/20 rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden">
              {/* Subtle background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Header & Badge */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-montserrat font-semibold text-white">
                      Single Featured Listing
                    </h3>
                    <p className="text-xs text-gray-400 font-inter mt-1">
                      Individual Listing Promotion
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-gray-300 border border-white/10">
                    Pay-Per-Item
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold font-clash text-white tracking-tight">
                      ${singlePlan?.price ?? 99}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">
                      / {singlePlan?.duration || singlePlan?.billingInterval || "lifetime"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                    {singlePlan?.description ||
                      "One-time payment for lifetime featured placement of 1 listing"}
                  </p>
                </div>

                {/* Included Features */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-3.5 text-sm text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        <strong className="text-white font-medium">Lifetime featured placement</strong> for 1 selected asset listing
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Prominent <strong className="text-white font-medium">Gold Featured Badge</strong> displayed on listing card</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Elevated search ranking in luxury categories</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Direct lead & inquiry notification routing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Standard seller analytics & view tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Informational Footer Note (Strictly no action button per requirement) */}
              <div className="pt-6 mt-8 border-t border-white/10">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 text-xs leading-relaxed">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    This plan is applied directly when adding or upgrading individual listings from your <strong className="text-gray-300">My Listings</strong> page.
                  </span>
                </div>
              </div>
            </div>
          </AnimationWrapper>

          {/* Card 2: Unlimited Annual Featured Plan (HIGHLIGHTED AS PURCHASED WHEN hasActiveSubscription IS TRUE) */}
          <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
            <div
              className={`h-full rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                hasActiveSubscription
                  ? "bg-gradient-to-b from-[#0e271a] via-[#14231b] to-[#18181A] border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.25)]"
                  : "bg-gradient-to-b from-[#1E1A14] to-[#18181A] border-2 border-primary/80 shadow-[0_0_40px_rgba(231,143,35,0.15)]"
              }`}
            >
              {/* Decorative Ambient Glow */}
              <div
                className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
                  hasActiveSubscription ? "bg-emerald-500/15" : "bg-primary/10"
                }`}
              />
              <div
                className={`absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
                  hasActiveSubscription ? "bg-emerald-500/10" : "bg-primary/5"
                }`}
              />

              <div>
                {/* Header & Badges */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-montserrat font-semibold text-white flex items-center gap-2 flex-wrap">
                      Unlimited Annual Featured
                      {hasActiveSubscription ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
                          <Check className="w-3 h-3" /> Subscribed
                        </span>
                      ) : (
                        <Sparkles className="w-5 h-5 text-primary" />
                      )}
                    </h3>
                    <p
                      className={`text-xs font-inter mt-1 font-medium ${
                        hasActiveSubscription
                          ? "text-emerald-400"
                          : "text-primary/90"
                      }`}
                    >
                      {hasActiveSubscription
                        ? "Currently Active & Protecting All Listings"
                        : "All-Inclusive Seller Power Plan"}
                    </p>
                  </div>

                  {hasActiveSubscription ? (
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Plan
                    </span>
                  ) : (
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-black shadow-lg shadow-primary/20 shrink-0">
                      Best Value
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-4xl sm:text-5xl font-bold font-clash tracking-tight ${
                        hasActiveSubscription ? "text-emerald-400" : "text-primary"
                      }`}
                    >
                      ${unlimitedPlan?.price ?? 399}
                    </span>
                    <span className="text-gray-300 text-sm font-medium">
                      / {unlimitedPlan?.billingInterval || "year"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    {hasActiveSubscription
                      ? `Active subscription plan. Valid until ${formatExpiryDate(
                          statusData?.expiresAt
                        )} (${statusData?.daysRemaining ?? 0} days remaining).`
                      : unlimitedPlan?.description ||
                        "Yearly $399 subscription for unlimited featured placement for all seller listings for 1 year"}
                  </p>
                </div>

                {/* Included Features */}
                <div className="space-y-4">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      hasActiveSubscription ? "text-emerald-400" : "text-primary"
                    }`}
                  >
                    Premium VIP Advantages:
                  </p>
                  <ul className="space-y-3.5 text-sm text-gray-200">
                    <li className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          hasActiveSubscription
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-primary/20 border border-primary/40 text-primary"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        <strong className="text-white font-medium">
                          Unlimited featured placement
                        </strong>{" "}
                        for all current and future listings
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          hasActiveSubscription
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-primary/20 border border-primary/40 text-primary"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        <strong className="text-white font-medium">Full 365 Days</strong> of nonstop top-tier marketplace exposure
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          hasActiveSubscription
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-primary/20 border border-primary/40 text-primary"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Exclusive direct exposure to verified{" "}
                        <strong className="text-white font-medium">VIP Buyers</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          hasActiveSubscription
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-primary/20 border border-primary/40 text-primary"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Priority 1st page ranking across all categories & search filters
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          hasActiveSubscription
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-primary/20 border border-primary/40 text-primary"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Instant listing moderation queue & expedited approvals
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          hasActiveSubscription
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-primary/20 border border-primary/40 text-primary"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        Dedicated account manager & 24/7 priority concierge support
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button Section */}
              <div className="pt-6 mt-8 border-t border-white/10">
                {hasActiveSubscription ? (
                  <div className="space-y-2">
                    <div className="w-full py-4 px-6 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold font-montserrat text-sm tracking-wide flex items-center justify-center gap-2 select-none shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Plan Purchased & Active</span>
                    </div>
                    <p className="text-center text-xs text-gray-400 font-inter">
                      Subscription is active until {formatExpiryDate(statusData?.expiresAt)}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleSubscribeUnlimited}
                    disabled={isPending || isLoading}
                    className="w-full py-4 px-6 rounded-xl bg-primary text-black font-semibold font-montserrat text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Redirecting to Checkout...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Subscribe to Unlimited Annual (${unlimitedPlan?.price ?? 399}/yr)
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </AnimationWrapper>
        </div>
      )}
    </div>
  );
}
