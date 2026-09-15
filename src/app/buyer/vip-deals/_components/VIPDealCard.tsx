import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, MapPin } from "lucide-react";
import { VIPDealCardProps } from "./types";

export function VIPDealCard({ asset }: VIPDealCardProps) {
  const image =
    asset.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";
  const location = [asset.locationCity, asset.locationCountry].filter(Boolean).join(", ") || "N/A";
  const formattedPrice = asset.askingPrice
    ? `${asset.currency || "$"}${Number(asset.askingPrice).toLocaleString()}`
    : "Price on Request";

  return (
    <Link href={`/buyer/vip-deals/${asset.slug || asset.id}`} className="block h-full">
      <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden group hover:border-primary/40 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col justify-between h-full">
        <div>
          <div className="relative h-45 sm:h-50 lg:h-54 overflow-hidden bg-black">
            <Image
              src={image}
              alt={asset.title}
              width={400}
              height={220}
              unoptimized
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
            />
            {asset.isFeatured && (
              <span className="absolute top-2.5 right-2.5 bg-primary text-black font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
                VIP Featured
              </span>
            )}
          </div>

          <div className="p-4 sm:p-5 relative mt-2">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 mb-2 font-medium">
              <span className="flex items-center gap-1 sm:gap-1.5 truncate pr-2">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-primary" /> {location}
              </span>
              <span className="tracking-widest uppercase text-gray-500 shrink-0">Asking Price</span>
            </div>
            <div className="flex justify-between items-center mb-4 sm:mb-5 gap-2">
              <h4
                className="font-semibold font-inter text-sm sm:text-[15px] truncate text-white group-hover:text-primary transition-colors"
                title={asset.title}
              >
                {asset.title}
              </h4>
              <span className="font-bold font-inter text-base sm:text-[17px] text-primary whitespace-nowrap">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <button className="w-full py-2 sm:py-2.5 cursor-pointer bg-primary hover:bg-primary text-white text-xs sm:text-[13px] font-semibold rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
            View Details <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default VIPDealCard;
