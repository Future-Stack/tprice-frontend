import React from "react";
import { ShieldCheck, CheckCircle2, Calendar } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { SellerActiveSubscriptionBannerProps, formatExpiryDate } from "./types";

export function SellerActiveSubscriptionBanner({
  daysRemaining = 0,
  expiresAt,
  totalFeaturedListings = 0,
}: SellerActiveSubscriptionBannerProps) {
  return (
    <AnimationWrapper type="fade-up" duration={0.4}>
      <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-950/50 via-[#18181A] to-emerald-950/30 border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
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
                {daysRemaining ?? 0} Days Remaining
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
                <strong className="text-white font-medium">{formatExpiryDate(expiresAt)}</strong>.
                All current & upcoming listings automatically enjoy VIP featured placement.
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-stretch sm:self-center shrink-0">
          <div className="px-5 py-3 rounded-xl bg-white/5 border border-emerald-500/30 text-center flex-1 sm:flex-initial">
            <span className="text-xs text-gray-400 block font-inter uppercase tracking-wider">
              Featured Listings
            </span>
            <span className="text-lg font-bold font-clash text-emerald-400">
              {totalFeaturedListings ?? 0} Active
            </span>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default SellerActiveSubscriptionBanner;
