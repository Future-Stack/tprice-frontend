import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPErrorStateProps } from "./types";

export function VIPErrorState({ errorMessage, onRetry, backLink }: VIPErrorStateProps) {
  return (
    <div className="mx-auto relative z-0 py-16 text-center">
      <AnimationWrapper type="fade-up" duration={0.5}>
        <div className="bg-[#161618] border border-[#2C2C2E] rounded-3xl p-10 max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-clash font-semibold text-white">VIP Listing Not Found</h3>
            <p className="text-gray-400 text-sm mt-2">
              {errorMessage ||
                "The VIP listing you are looking for is currently unavailable or does not exist."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition-all border border-white/10 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href={backLink}
              className="px-5 py-2.5 bg-[#E78F23] hover:bg-[#E78F23]/90 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_16px_rgba(231,143,35,0.3)]"
            >
              Back to VIP Deals
            </Link>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}

export default VIPErrorState;
