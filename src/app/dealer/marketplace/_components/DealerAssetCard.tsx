import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Eye } from "lucide-react";
import { DealerAssetCardProps } from "./types";

export function DealerAssetCard({ asset }: DealerAssetCardProps) {
  return (
    <Link href={`/buyer/marketplace/${asset.slug || asset.id}`} className="block h-full">
      <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden group hover:border-[#E78F23]/20 transition-all shadow-xl hover:shadow-[#E78F23]/5 flex flex-col justify-between h-full">
        <div>
          <div className="relative h-45 sm:h-50 lg:h-54.25 overflow-hidden bg-black">
            <Image
              src={asset.image}
              alt={asset.title}
              width={400}
              height={220}
              unoptimized
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
            />
          </div>

          <div className="p-4 sm:p-5 relative mt-4 sm:mt-6">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-gray-400 mb-2 font-medium">
              <span className="flex items-center gap-1 sm:gap-1.5">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {asset.location}
              </span>
              <span className="tracking-widest uppercase text-gray-500">Price</span>
            </div>
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h4 className="font-semibold font-inter text-sm sm:text-[15px] truncate pr-3 text-white">
                {asset.title}
              </h4>
              <span className="font-bold font-inter text-base sm:text-[17px] text-white whitespace-nowrap">
                {asset.price}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <button className="w-full py-2 sm:py-2.5 cursor-pointer bg-[#D98728] hover:bg-[#E6983A] text-white text-xs sm:text-[13px] font-semibold rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#D98728]/20 active:scale-[0.98]">
            View Details <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default DealerAssetCard;
