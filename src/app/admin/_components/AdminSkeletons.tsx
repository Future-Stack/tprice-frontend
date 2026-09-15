import React from "react";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[#111113] border border-white/5 rounded-2xl p-6 animate-pulse space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl shrink-0" />
            <div className="h-4 bg-white/10 rounded w-28" />
          </div>
          <div className="space-y-2">
            <div className="h-10 bg-white/10 rounded-lg w-16" />
            <div className="h-3 bg-white/5 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PendingApprovalsSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#111113] border border-white/5 rounded-2xl animate-pulse"
        >
          <div className="w-full md:w-44 h-28 bg-white/10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3 py-1 w-full">
            <div className="h-5 bg-white/10 rounded w-3/4" />
            <div className="flex items-center gap-4">
              <div className="h-3.5 bg-white/5 rounded w-24" />
              <div className="h-3.5 bg-white/5 rounded w-20" />
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
            <div className="h-7 bg-white/10 rounded w-24" />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="h-9 bg-white/10 rounded-lg w-24" />
              <div className="h-9 bg-white/5 rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DealersSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/10 rounded-full shrink-0" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-28" />
              <div className="h-3 bg-white/5 rounded w-36" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="h-5 bg-white/10 rounded w-8 ml-auto" />
            <div className="h-2.5 bg-white/5 rounded w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start justify-between py-4 animate-pulse">
          <div className="flex items-start gap-5">
            <div className="w-3 h-3 rounded-full bg-white/10 mt-1.5 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-36" />
              <div className="h-3 bg-white/5 rounded w-52" />
            </div>
          </div>
          <div className="space-y-1 text-right ml-4">
            <div className="h-4 bg-white/10 rounded w-20 ml-auto" />
            <div className="h-3 bg-white/5 rounded w-14 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActiveDealsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between animate-pulse gap-4"
        >
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
          <div className="h-6 bg-white/10 rounded-lg w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}
