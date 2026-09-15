import React from "react";
import { Tag, Sparkles, MapPin, Eye } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import type { InventoryHeaderCardProps } from "./types";

export function InventoryHeaderCard({
  item,
  locationText,
  formattedPrice,
}: InventoryHeaderCardProps) {
  return (
    <AnimationWrapper type="fade-up">
      <div className="bg-[#101216] border border-white/5 p-8 rounded-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.category && (
            <span className="px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] uppercase font-bold tracking-widest rounded-sm flex items-center gap-1">
              <Tag size={10} />
              {item.category}
            </span>
          )}
          {item.subCategory && (
            <span className="px-2.5 py-0.5 bg-white/5 text-white/60 border border-white/10 text-[10px] uppercase font-bold tracking-widest rounded-sm">
              {item.subCategory}
            </span>
          )}
          {item.isFeatured && (
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold tracking-widest rounded-sm flex items-center gap-1">
              <Sparkles size={10} />
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-[28px] font-serif text-white font-semibold tracking-wide">
              {item.buildYear ? `${item.buildYear} ` : ""}
              {item.title}
            </h1>

            <div className="flex items-center gap-4 text-white/40 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#D4AF37]" />
                <span>{locationText}</span>
              </div>
              {item.viewsCount !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  <Eye size={14} />
                  <span>
                    {item.viewsCount} {item.viewsCount === 1 ? "view" : "views"}
                  </span>
                </div>
              )}
            </div>

            <div className="text-[#D4AF37] text-4xl md:text-[36px] font-semibold font-montserrat pt-1">
              {formattedPrice}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-white/70 uppercase tracking-widest rounded-sm font-semibold">
              {item.saleType ? item.saleType.replace(/_/g, " ") : item.status || "LIVE"}
            </span>
            {item.allowCounterOffers && (
              <span className="text-[10px] text-emerald-400/80 font-medium tracking-wide">
                Counter offers accepted
              </span>
            )}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
