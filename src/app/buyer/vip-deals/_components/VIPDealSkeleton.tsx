import React from "react";

export function VIPDealSkeleton() {
  return (
    <div className="bg-[#1C1C1E] rounded-[8px] border border-[#2C2C2E] overflow-hidden animate-pulse flex flex-col justify-between h-full min-h-85">
      <div>
        <div className="h-45 sm:h-50 lg:h-54 bg-[#2C2C2E]/60 w-full" />
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-[#2C2C2E] rounded w-1/3" />
            <div className="h-3 bg-[#2C2C2E] rounded w-1/4" />
          </div>
          <div className="flex justify-between items-center pt-1">
            <div className="h-5 bg-[#2C2C2E] rounded w-1/2" />
            <div className="h-5 bg-[#2C2C2E] rounded w-1/3" />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 pt-0">
        <div className="h-10 bg-[#2C2C2E]/80 rounded-xl w-full" />
      </div>
    </div>
  );
}

export default VIPDealSkeleton;
