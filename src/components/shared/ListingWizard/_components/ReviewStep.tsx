import React from "react";
import Image from "next/image";
import { CheckCircle2, Circle } from "lucide-react";
import type { ReviewStepProps } from "./types";

export function ReviewStep({
  title,
  category,
  brand,
  model,
  trim,
  buildYear,
  specifications,
  mediaList,
  saleType,
  askingPrice,
  currency,
  selectedPlan,
  setSelectedPlan,
  hasActiveSubscription,
}: Omit<ReviewStepProps, "onStepSelect"> & {
  setSelectedPlan: (plan: "standard" | "featured") => void;
}) {
  const coverItem = mediaList.find((m) => m.isCover) || mediaList[0];
  const coverUrl = coverItem?.url;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/20 text-primary">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-clash font-medium text-white mb-1">
          Review & Confirm Listing
        </h3>
        <p className="text-gray-400 text-xs max-w-md mx-auto">
          Review listing details and choose visibility package before submission.
        </p>
      </div>

      {/* Listing Details Card Summary */}
      <div className="p-5 bg-[#1c1c1e] border border-[#2C2C2E] rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2C2C2E] pb-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {coverUrl && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-primary/40 shrink-0 bg-black">
                <Image
                  src={coverUrl}
                  alt="Cover Preview"
                  width={48}
                  height={48}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-primary text-[8px] font-bold text-black text-center py-0.2">
                  COVER
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-base font-bold text-white truncate">
                {title || "Untitled Listing"}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                Category: <span className="text-primary font-semibold">{category || "Unassigned"}</span>{" "}
                {brand && `• Brand: ${brand}`}
                {model && ` • Model: ${model}`}
                {trim && ` • Trim: ${trim}`}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-lg shrink-0">
            {currency} {askingPrice ? Number(askingPrice).toLocaleString() : "0"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-500 block">Sale Type</span>
            <span className="text-white font-semibold">{saleType}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Build Year</span>
            <span className="text-white font-semibold">{buildYear || "N/A"}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Specifications</span>
            <span className="text-white font-semibold">
              {specifications.filter((s) => s.key).length} keys
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Uploaded Media</span>
            <span className="text-white font-semibold">{mediaList.length} files</span>
          </div>
        </div>
      </div>

      {/* Plans Selection Grid */}
      {!hasActiveSubscription && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Standard Plan */}
          <div
            onClick={() => setSelectedPlan("standard")}
            className={`relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
              selectedPlan === "standard"
                ? "bg-[#1c1c1e] border-primary ring-1 ring-primary/30"
                : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 transition-colors ${
                  selectedPlan === "standard" ? "text-primary" : "text-gray-600"
                }`}
              >
                {selectedPlan === "standard" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-clash font-medium text-white">
                  Standard Listing (Free)
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  List your luxury item on marketplace standard queue.
                </p>
              </div>
            </div>
          </div>

          {/* Featured Plan */}
          <div
            onClick={() => setSelectedPlan("featured")}
            className={`relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
              selectedPlan === "featured"
                ? "bg-[#1c1c1e] border-primary ring-1 ring-primary/30"
                : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 transition-colors ${
                  selectedPlan === "featured" ? "text-primary" : "text-gray-600"
                }`}
              >
                {selectedPlan === "featured" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-clash font-medium text-white">
                  Featured Listing (VIP)
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  Priority placement for higher buyer conversion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
