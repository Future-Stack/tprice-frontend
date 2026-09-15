import React from "react";
import Link from "next/link";
import { Lock, Crown } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";

export function NonVipRestrictedCard() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <AnimationWrapper type="zoom" duration={0.5}>
        <div className="bg-[#1C1C1E] border border-[#E78F23]/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E78F23]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="w-16 h-16 bg-[#E78F23]/10 border border-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E78F23]/10 border border-[#E78F23]/30 rounded-full text-xs font-semibold text-primary mb-4">
            <Crown className="w-3.5 h-3.5" fill="currentColor" /> VIP Membership Required
          </div>

          <h2 className="text-2xl sm:text-3xl font-clash font-semibold text-white mb-3">
            VIP Review Access Restricted
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            The Reviews section is exclusively reserved for VIP Members of ExoticWorld. Upgrade your
            account to leave official member reviews and gain access to luxury off-market deals.
          </p>

          <Link href="/buyer/settings">
            <button className="px-6 py-3 bg-primary hover:bg-primary text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#E78F23]/20 flex items-center gap-2 mx-auto cursor-pointer">
              Upgrade to VIP Membership <Crown className="w-4 h-4" fill="currentColor" />
            </button>
          </Link>
        </div>
      </AnimationWrapper>
    </div>
  );
}
