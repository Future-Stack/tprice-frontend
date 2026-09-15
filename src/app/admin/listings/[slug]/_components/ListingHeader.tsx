"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, BadgeCheck, Clock, ArrowLeft, Edit3 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { formatPrice, formatTimeAgo, getStatusBadge, type Listing } from "./types";

interface ListingHeaderProps {
  listing: Listing;
  onOpenEditModal: () => void;
}

export function ListingHeader({ listing, onOpenEditModal }: ListingHeaderProps) {
  const router = useRouter();

  const sellerName =
    [listing.owner?.firstName, listing.owner?.lastName].filter(Boolean).join(" ").trim() ||
    listing.owner?.email ||
    "Unknown Seller";
  const sellerAvatar =
    listing.owner?.avatarUrl ||
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100";
  const locationStr =
    [listing.locationCity, listing.locationCountry].filter(Boolean).join(", ") || "Location N/A";
  const formattedPrice = formatPrice(listing.askingPrice, listing.currency);
  const statusBadge = getStatusBadge(listing.status);
  const timeAgoStr = formatTimeAgo(listing.createdAt);

  return (
    <>
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Listing Review</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenEditModal}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/30 hover:bg-primary text-primary hover:text-black rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Listing</span>
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] hover:bg-[#1a1a1a] text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        </div>
      </AnimationWrapper>

      <AnimationWrapper type="fade-up" duration={0.5} delay={0.1}>
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-medium">{listing.title}</h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-primary text-2xl font-semibold">{formattedPrice}</span>
              <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-primary">
                <Image
                  src={sellerAvatar}
                  alt={sellerName}
                  width={20}
                  height={20}
                  unoptimized
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-sm text-gray-300">{sellerName}</span>
                {listing.owner?.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{locationStr}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-right">
            <span
              className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock className="w-4 h-4" />
              <span>{timeAgoStr}</span>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </>
  );
}
