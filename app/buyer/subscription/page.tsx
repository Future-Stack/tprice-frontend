"use client";

import React, { useState } from "react";
import {
  Crown,
  Sparkles,
  Check,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Lock,
  Zap,
  Star,
  Flame,
  Calendar
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useVipStatusQuery, useClaimVipTrialMutation } from "@/hooks/useUsers";
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

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const FAQS = [
  {
    q: "How does the 3-Month Free VIP Trial work?",
    a: "Eligible buyers receive 90 days of full, unrestricted VIP membership at zero initial charge ($0). You get instant access to private off-market listings, direct dealer bidding, and VIP deals.",
  },
  {
    q: "What happens after the 90-day free trial concludes?",
    a: "After your 3-month trial ends, your VIP membership transitions to the standard VIP Premium plan ($200/month) so you continue enjoying exclusive off-market access without interruption.",
  },
  {
    q: "Can I cancel or change my subscription at any time?",
    a: "Yes! There are no lock-in contracts. You can manage or cancel your subscription anytime with 1-click directly from your settings or via the Stripe customer portal.",
  },
  {
    q: "What makes VIP Deals and Off-Market Listings special?",
    a: "Off-market vehicles are rare, collector-grade, and limited-edition luxury assets whose owners prefer private transactions rather than public exposure. VIP members get exclusive, first-look privileges before any public announcement.",
  },
];

export default function BuyerSubscriptionPage() {
  const {
    data: vipData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useVipStatusQuery();

  const { mutate: claimTrial, isPending: isClaimingTrial } =
    useClaimVipTrialMutation();

  const { mutate: createCheckoutSession, isPending: isCheckingOut } =
    useCreateCheckoutSessionMutation();

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isVip = Boolean(vipData?.isVip);
  const trialEligible = Boolean(vipData?.trialEligible);
  const activeSub = vipData?.activeSubscription;
  const pricing = vipData?.pricing;

  const monthlyPrice = pricing?.monthlyPriceAfterTrial ?? 200;
  const trialMonths = pricing?.freeTrialMonths ?? 3;
  const trialDays = pricing?.freeTrialDays ?? 90;
  const currency = pricing?.currency ?? "USD";

  const isCurrentPlanTrial =
    Boolean(isVip && (activeSub?.plan?.includes("TRIAL") || activeSub?.amount === 0));

  const isCurrentPlanPremium =
    Boolean(isVip && activeSub && !activeSub.plan?.includes("TRIAL") && activeSub.amount > 0);

  const handleClaimTrial = () => {
    if (!trialEligible) {
      toast.error("You are not currently eligible for the free trial.");
      return;
    }

    claimTrial(undefined, {
      onSuccess: () => {
        toast.success(
          "🎉 Welcome to VIP! Your 3-Month Free Trial has been activated."
        );
      },
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to claim 3-month free trial. Please try again.";
        toast.error(errorMsg);
      },
    });
  };

  const handleSubscribePremium = () => {
    const successUrl = getPaymentReturnUrl("/payment/success");
    const cancelUrl = getPaymentReturnUrl("/payment/cancel");

    createCheckoutSession(
      {
        type: "VIP_BUYER_MONTHLY_MEMBERSHIP",
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
            toast.success("Redirecting to secure checkout...");
            window.location.assign(checkoutUrl);
          } else {
            toast.error(
              "Checkout session created, but no checkout URL was returned."
            );
          }
        },
        onError: (err: any) => {
          let errorMessage = "Failed to initiate VIP checkout session.";
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

  return (
    <div className="space-y-10 relative z-0   mx-auto pb-16">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.4}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-2">
          <div>
           
            <h1 className="text-3xl sm:text-4xl font-clash font-medium text-white tracking-tight">
              Buyer Subscription Plans
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl font-inter leading-relaxed">
              Unlock exclusive access to off-market inventory, private VIP deals, direct dealer negotiation, and dedicated luxury concierge assistance.
            </p>
          </div>
 
        </div>
      </AnimationWrapper>

      {/* Active Subscription Banner */}
      {!isLoading && isVip && (
        <AnimationWrapper type="fade-up" duration={0.4}>
          <div className="p-6 rounded-2xl bg-linear-to-r from-[#2A1D0B] via-[#18181A] to-[#1F170D] border-2 border-primary/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          

            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="w-13 h-13 rounded-2xl bg-[#E78F23]/15 border border-primary/40 text-primary flex items-center justify-center shrink-0 shadow-lg shadow-[#E78F23]/20">
                <Crown className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E78F23]/20 text-primary border border-primary/40 uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Active VIP Membership
                  </span>
                  {vipData?.daysRemaining !== undefined && vipData.daysRemaining !== null && (
                    <>
                      <span className="text-xs text-white/40">•</span>
                      <span className="text-xs text-primary font-semibold font-mono bg-black/40 px-2 py-0.5 rounded-md border border-[#E78F23]/20">
                        {vipData.daysRemaining} Days Remaining
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white flex items-center gap-2">
                  {activeSub?.plan
                    ? activeSub.plan.replace(/_/g, " ")
                    : "VIP Buyer Membership"}
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 flex-wrap">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    Valid until{" "}
                    <strong className="text-white font-medium">
                      {formatExpiryDate(
                        vipData?.vipExpiresAt || activeSub?.expiresAt
                      )}
                    </strong>
                    . You enjoy 100% unrestricted access to all VIP off-market deals and private listings.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10 self-stretch sm:self-center shrink-0">
              <div className="px-5 py-3 rounded-xl bg-white/4 border border-primary/30 text-center flex-1 sm:flex-initial">
                <span className="text-[11px] text-gray-400 block font-inter uppercase tracking-wider">
                  Member Status
                </span>
                <span className="text-base font-bold font-clash text-primary flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  VIP Verified
                </span>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      )}

      {/* Error State Banner */}
      {isError && (
        <AnimationWrapper type="fade-up" duration={0.4}>
          <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-4 text-red-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                {(error as any)?.response?.data?.message ||
                  error?.message ||
                  "Unable to load subscription details. Please check your connection."}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </AnimationWrapper>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#18181A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between animate-pulse relative overflow-hidden"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 w-40 bg-white/10 rounded-md" />
                    <div className="h-4 w-28 bg-white/5 rounded-md" />
                  </div>
                  <div className="h-7 w-24 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-32 bg-white/15 rounded-lg" />
                  <div className="h-4 w-full bg-white/5 rounded-md" />
                  <div className="h-4 w-3/4 bg-white/5 rounded-md" />
                </div>
                <div className="pt-6 border-t border-white/10 space-y-3.5">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 shrink-0" />
                      <div className="h-4 w-5/6 bg-white/10 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="h-12 w-full bg-white/10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Plans Grid - 2 Cards: Free Trial (3 Months) & VIP Premium */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: 3-Month Free Trial Plan */}
          <AnimationWrapper type="fade-up" duration={0.4} delay={0.1}>
            <div
              className={`h-full bg-[#18181A] rounded-2xl p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                isCurrentPlanTrial
                  ? "border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                  : "border border-white/10 hover:border-white/20 hover:shadow-xl"
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-300 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Introductory Offer
                </div>
                {isCurrentPlanTrial && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Check className="w-3.5 h-3.5" />
                    Active Plan
                  </span>
                )}
              </div>

              {/* Title & Pricing */}
              <div>
                <h3 className="text-2xl font-inter font-semibold text-white">
                  3-Month Free Trial
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-inter">
                  Full VIP access for {trialDays} days. Experience all premium features with zero upfront payment.
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-clash font-semibold text-white tracking-tight">
                      $0
                    </span>
                    <span className="text-sm font-medium text-gray-400 font-inter">
                      for {trialMonths} Months ({trialDays} Days)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ${monthlyPrice}/month after {trialMonths}-month trial • No contract commitment
                  </p>
                </div>

            
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                {isCurrentPlanTrial ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Currently Active Plan ({vipData?.daysRemaining ?? 0} Days Left)
                  </button>
                ) : trialEligible ? (
                  <button
                    onClick={handleClaimTrial}
                    disabled={isClaimingTrial}
                    className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-95 transition-all   flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isClaimingTrial ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Activating Free Trial...</span>
                      </>
                    ) : (
                      <>
                        <span>Claim 3 Months Free Trial</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4 text-gray-500" />
                    {isVip
                      ? "Trial Claimed"
                      : "Introductory Trial Unavailable"}
                  </button>
                )}
                {!trialEligible && !isCurrentPlanTrial && (
                  <p className="text-[11px] text-gray-500 text-center mt-2 font-inter">
                    {isVip
                      ? "You are currently enjoying VIP membership privileges."
                      : "This account has already claimed the 3-month free trial."}
                  </p>
                )}
              </div>
            </div>
          </AnimationWrapper>

          {/* Card 2: VIP Premium Membership (Monthly) */}
          <AnimationWrapper type="fade-up" duration={0.4} delay={0.2}>
            <div
              className={`h-full bg-linear-to-b from-[#1C1A17] via-[#18181A] to-[#18181A] rounded-2xl p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-300 border-2 ${
                isCurrentPlanPremium
                  ? "border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                  : "border-primary "
              }`}
            >
              {/* Highlight Tag */}
              <div className="absolute -top-3.5 right-6 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 fill-current" />
                Recommended • Full Access
              </div>

              {/* Badge */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E78F23]/15 text-primary border border-[#E78F23]/30">
                  <Flame className="w-3.5 h-3.5 text-primary" />
                  Premium VIP Membership
                </div>
                {isCurrentPlanPremium && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Check className="w-3.5 h-3.5" />
                    Active Plan
                  </span>
                )}
              </div>

              {/* Title & Pricing */}
              <div>
                <h3 className="text-2xl font-inter font-semibold text-white flex items-center gap-2">
                  VIP Premium
                  <Crown className="w-5 h-5 text-primary" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 font-inter">
                  Continuous, unrestricted VIP privileges for high-net-worth buyers and serious collectors.
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-clash font-semibold text-white tracking-tight">
                      {formatCurrency(monthlyPrice, currency)}
                    </span>
                    <span className="text-sm font-medium text-gray-400 font-inter">
                      / month
                    </span>
                  </div>
                  <p className="text-xs text-primary/90 mt-2 font-medium">
                    Continuous billing • Instant 1-click cancellation anytime
                  </p>
                </div>

           
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                {isCurrentPlanPremium ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Active Premium Membership
                  </button>
                ) : (
                  <button
                    onClick={handleSubscribePremium}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 px-4 rounded-xl bg-primary  text-[#111113] font-bold text-sm transition-all shadow-[0_4px_25px_rgba(231,143,35,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#111113]" />
                        <span>Preparing Checkout...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 fill-current text-[#111113]" />
                        <span>
                          Subscribe to VIP Premium ({formatCurrency(monthlyPrice, currency)}/mo)
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#111113]" />
                      </>
                    )}
                  </button>
                )}
                <p className="text-[11px] text-gray-400 text-center mt-2 font-inter">
                  Secured by Stripe with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      )}


    </div>
  );
}
