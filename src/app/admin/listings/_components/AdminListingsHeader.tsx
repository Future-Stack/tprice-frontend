import React from "react";
import { RefreshCw } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { AdminListingsHeaderProps } from "./types";

export function AdminListingsHeader({
  isFetching,
  isLoading,
  onRefresh,
}: AdminListingsHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <AnimationWrapper type="fade-down" duration={0.5}>
        <h1 className="text-3xl font-bold mb-2">Manage and review all listings</h1>
        <p className="text-gray-400 text-sm">
          Review submitted marketplace assets, approve pending listings, and manage status
        </p>
      </AnimationWrapper>

      <div className="flex items-center gap-3 shrink-0">
        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Updating...
          </div>
        )}
        <button
          onClick={onRefresh}
          className="p-2.5 bg-[#141416] border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
          title="Refresh listings"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

export default AdminListingsHeader;
