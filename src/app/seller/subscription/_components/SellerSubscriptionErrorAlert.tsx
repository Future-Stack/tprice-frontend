import React from "react";
import { AlertCircle } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { SellerSubscriptionErrorAlertProps } from "./types";

export function SellerSubscriptionErrorAlert({
  errorMessage = "Unable to load subscription pricing and status. Please try again.",
  onReload,
}: SellerSubscriptionErrorAlertProps) {
  return (
    <AnimationWrapper type="fade-up" duration={0.4}>
      <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-4 text-red-400">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
        <button
          onClick={onReload}
          className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer"
        >
          Reload
        </button>
      </div>
    </AnimationWrapper>
  );
}

export default SellerSubscriptionErrorAlert;
