"use client";

import React from "react";
import Image from "next/image";
import { User, Mail, BadgeCheck, ListOrdered, Handshake, Clock, Copy } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { formatSubmittedDate, type ListingSellerCardProps } from "./types";
import { toast } from "sonner";

export function ListingSellerCard({ listing, children }: ListingSellerCardProps) {
  const sellerName =
    [listing.owner?.firstName, listing.owner?.lastName].filter(Boolean).join(" ").trim() ||
    listing.owner?.email ||
    "Unknown Seller";

  const submittedAtStr = `Submitted ${formatSubmittedDate(listing.createdAt)}`;

  const handleCopyId = () => {
    const val = listing.id || listing.slug;
    if (val) {
      navigator.clipboard.writeText(val);
      toast.success("Listing ID copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      {/* Dealer Information */}
      <AnimationWrapper type="fade-left" delay={0.2}>
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-8">
          <h2 className="text-2xl font-semibold text-center mt-2">Dealer Information</h2>

          <div className="space-y-6">
            {/* Dealer Meta */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] overflow-hidden flex items-center justify-center shrink-0">
                  {listing.owner?.avatarUrl ? (
                    <Image
                      src={listing.owner.avatarUrl}
                      alt={sellerName}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    Dealer Info
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{sellerName}</p>
                    {listing.owner?.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-300 truncate">
                    {listing.owner?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Dealer Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#151C1A] border border-[#1E2E28] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <ListOrdered className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Views</span>
                </div>
                <p className="text-3xl font-semibold text-center">{listing.viewsCount ?? 0}</p>
              </div>
              <div className="bg-[#151D24] border border-[#1E2730] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#3B82F6]">
                  <Handshake className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Offers</span>
                </div>
                <p className="text-3xl font-semibold text-center">
                  {listing.offersCount ?? listing._count?.offers ?? 0}
                </p>
              </div>
            </div>

            {/* Action Buttons Slot */}
            {children}
          </div>
        </div>
      </AnimationWrapper>

      {/* Meta Information */}
      <AnimationWrapper type="fade-left" delay={0.3}>
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-6">
          <p className="text-xs text-gray-500 font-medium">Meta Information</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-[13px]">{submittedAtStr}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 flex items-center justify-between bg-[#0F0F0F] px-4 py-2 rounded-lg border border-[#262626] min-w-0">
                <span className="text-[11px] font-mono text-gray-500 truncate mr-2">
                  {listing.slug || listing.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Listing ID"
                  className="text-primary hover:text-primary/80 shrink-0 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
