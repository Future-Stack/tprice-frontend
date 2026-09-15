import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  Mail,
  Phone,
  Heart,
  Wrench,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { InventorySidebarProps } from "./types";

export function InventorySidebar({
  item,
  ownerName,
  locationText,
  isSaved,
  isSaving,
  onToggleSave,
  biddingSection,
}: InventorySidebarProps) {
  const router = useRouter();

  return (
    <AnimationWrapper type="fade-left" delay={0.2}>
      <div className="bg-[#101216] border border-white/5 p-8 rounded-sm sticky top-12 space-y-8">
        {/* Dealer / Owner Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            {item.owner?.avatarUrl ? (
              <Image
                src={item.owner.avatarUrl}
                alt={ownerName}
                className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold font-serif">
                {ownerName.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="text-lg font-serif text-white leading-tight">{ownerName}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                {item.owner?.role || "Verified Dealer"}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <MapPin size={14} className="text-[#D4AF37]" />
              <span>{locationText}</span>
            </div>
            {item.owner?.isVerified && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-widest font-medium">
                <CheckCircle2 size={14} />
                <span>Verified Concierge Seller</span>
              </div>
            )}
            {item.owner?.email && (
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Mail size={14} className="text-white/30" />
                <span>{item.owner.email}</span>
              </div>
            )}
            {item.owner?.phone && (
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Phone size={14} className="text-white/30" />
                <span>{item.owner.phone}</span>
              </div>
            )}
          </div>

          <p className="text-white/50 text-xs leading-relaxed italic pt-1">
            Premier luxury asset offering verified provenance and immediate concierge acquisition.
          </p>
        </div>

        {/* Bidding / Offers Actions */}
        {biddingSection}

        {/* Global Listing Actions */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <button
            onClick={() => router.push("/inventory")}
            className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm"
          >
            View All Listings
          </button>
          <button
            onClick={onToggleSave}
            disabled={isSaving}
            className={`w-full py-4 bg-transparent border text-sm font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm ${
              isSaved
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                : "border-white/10 text-white hover:bg-white hover:text-black"
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
            ) : (
              <Heart
                size={16}
                fill={isSaved ? "currentColor" : "none"}
                className={isSaved ? "text-[#D4AF37]" : ""}
              />
            )}
            {isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
          </button>
        </div>

        {/* Additional Trust Assurances */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
            <Wrench size={16} className="group-hover:text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest">Certified Inspection</span>
          </div>
          <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer group">
            <ShieldCheck size={16} className="group-hover:text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest">Warranty & Provenance</span>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
