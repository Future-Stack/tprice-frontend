import React from "react";
import { Crown, RefreshCw } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { SubscriptionHeaderProps } from "./types";

export function SubscriptionHeader({
  title = "Dealer Subscription Plans",
  badgeLabel = "Featured Placements & Subscriptions",
  description = "Maximize your inventory reach. Feature your luxury assets at the top of marketplace searches, VIP deals, and buyer recommendations.",
  isError,
  onRefresh,
}: SubscriptionHeaderProps) {
  return (
    <AnimationWrapper type="fade-down" duration={0.5}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5" />
            {badgeLabel}
          </div>
          <h1 className="text-3xl sm:text-4xl font-clash font-medium text-white tracking-tight">
            {title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl font-inter leading-relaxed">
            {description}
          </p>
        </div>

        {isError && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Loading
          </button>
        )}
      </div>
    </AnimationWrapper>
  );
}

export default SubscriptionHeader;
