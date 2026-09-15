import React from "react";
import { Check, Info } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { SellerSinglePlanCardProps } from "./types";

export function SellerSinglePlanCard({
  price = 99,
  duration,
  billingInterval,
  description = "One-time payment for lifetime featured placement of 1 listing",
}: SellerSinglePlanCardProps) {
  const interval = duration || billingInterval || "lifetime";

  return (
    <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
      <div className="h-full bg-[#18181A] border border-white/10 hover:border-white/20 rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/2 rounded-full blur-3xl pointer-events-none" />

        <div>
          {/* Header & Badge */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-montserrat font-semibold text-white">
                Single Featured Listing
              </h3>
              <p className="text-xs text-gray-400 font-inter mt-1">Individual Listing Promotion</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-gray-300 border border-white/10">
              Pay-Per-Item
            </span>
          </div>

          {/* Price Display */}
          <div className="mt-6 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-clash text-white tracking-tight">
                ${price}
              </span>
              <span className="text-gray-400 text-sm font-medium">/ {interval}</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">{description}</p>
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
                  <strong className="text-white font-medium">Lifetime featured placement</strong>{" "}
                  for 1 selected asset listing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  Prominent <strong className="text-white font-medium">Gold Featured Badge</strong>{" "}
                  displayed on listing card
                </span>
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
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/3 border border-white/5 text-gray-400 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              This plan is applied directly when adding or upgrading individual listings from your{" "}
              <strong className="text-gray-300">My Listings</strong> page.
            </span>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default SellerSinglePlanCard;
