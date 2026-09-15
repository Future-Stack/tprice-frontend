import React from "react";
import { Sparkles, Check, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { UnlimitedPlanCardProps, formatExpiryDate } from "./types";

export function UnlimitedPlanCard({
  price = 399,
  billingInterval = "year",
  description,
  hasActiveSubscription,
  expiresAt,
  daysRemaining = 0,
  isPending,
  isLoading,
  onSubscribe,
}: UnlimitedPlanCardProps) {
  const planDescription = hasActiveSubscription
    ? `Active subscription plan. Valid until ${formatExpiryDate(expiresAt)} (${daysRemaining ?? 0} days remaining).`
    : description ||
      `Yearly $${price} subscription for unlimited featured placement for all dealer listings for 1 year`;

  return (
    <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
      <div
        className={`h-full rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
          hasActiveSubscription
            ? "bg-linear-to-b from-[#0e271a] via-[#14231b] to-[#18181A] border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.25)]"
            : "bg-linear-to-b from-[#1E1A14] to-[#18181A] border-2 border-primary/80 shadow-[0_0_40px_rgba(231,143,35,0.15)]"
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
                  hasActiveSubscription ? "text-emerald-400" : "text-primary/90"
                }`}
              >
                {hasActiveSubscription
                  ? "Currently Active & Protecting All Listings"
                  : "All-Inclusive Dealer Power Plan"}
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
                ${price}
              </span>
              <span className="text-gray-300 text-sm font-medium">/ {billingInterval}</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed">
              {planDescription}
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
                  <strong className="text-white font-medium">Unlimited featured placement</strong>{" "}
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
                  <strong className="text-white font-medium">Full 365 Days</strong> of nonstop
                  top-tier marketplace exposure
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
                <span>Priority 1st page ranking across all categories & search filters</span>
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
                <span>Instant listing moderation queue & expedited approvals</span>
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
                <span>Dedicated account manager & 24/7 priority concierge support</span>
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
                Subscription is active until {formatExpiryDate(expiresAt)}
              </p>
            </div>
          ) : (
            <button
              onClick={onSubscribe}
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
                  <span>Subscribe to Unlimited Annual (${price}/yr)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default UnlimitedPlanCard;
