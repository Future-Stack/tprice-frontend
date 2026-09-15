import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { DealersSkeleton } from "./AdminSkeletons";
import { AdminDealersSummaryProps } from "./types";

export function AdminDealersSummary({ dealersSummary, isLoading }: AdminDealersSummaryProps) {
  return (
    <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-[2rem] p-8 h-fit shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-clash font-medium text-white">Dealers</h2>
        <Link
          href="/admin/users"
          className="text-[10px] font-bold text-primary flex items-center gap-1.5 group bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-all uppercase tracking-widest"
        >
          Manage{" "}
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <DealersSkeleton />
      ) : !dealersSummary || dealersSummary.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-4">No dealers found.</div>
      ) : (
        <div className="space-y-8">
          {dealersSummary.map((dealer, i) => {
            const avatar =
              dealer.avatarUrl ||
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop";
            const fullName = `${dealer.firstName} ${dealer.lastName}`.trim();

            return (
              <div
                key={dealer.id || i}
                className="flex items-center justify-between group cursor-pointer hover:bg-white/2 -mx-4 px-4 py-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10 group-hover:border-[#E78F23]/50 transition-all ring-offset-2 ring-offset-[#111113] group-hover:ring-1 ring-[#E78F23]/30">
                    <Image src={avatar} alt={fullName} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {fullName}{" "}
                      {dealer.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/10 text-xs shrink-0" />
                      )}
                    </span>
                    <span className="text-[11px] text-gray-500 truncate max-w-35 font-medium">
                      {dealer.email}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-white group-hover:text-primary transition-colors">
                    {dealer.activeDealsCount}
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">
                    active deals
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminDealersSummary;
