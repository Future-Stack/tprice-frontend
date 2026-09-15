import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { formatRelativeTime, formatPrice } from "./helpers";
import { PendingApprovalsSkeleton } from "./AdminSkeletons";
import { AdminPendingApprovalsProps } from "./types";

export function AdminPendingApprovals({
  pendingApprovals,
  isLoading,
  processingId,
  onApprove,
  onReject,
}: AdminPendingApprovalsProps) {
  return (
    <div className="lg:col-span-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-clash font-medium text-white">Pending Approvals</h2>
      </div>

      {isLoading ? (
        <PendingApprovalsSkeleton />
      ) : !pendingApprovals || pendingApprovals.length === 0 ? (
        <div className="p-8 bg-[#111113] min-h-36.25 flex justify-center items-center border border-white/5 rounded-2xl text-center text-gray-400 text-sm">
          No pending approvals at the moment.
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {pendingApprovals.map((item, i) => {
              const imageUrl =
                item.media?.[0]?.url ||
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
              const ownerName = item.owner
                ? `${item.owner.firstName} ${item.owner.lastName}`.trim()
                : "Seller";
              const isItemProcessing = processingId === item.id;

              return (
                <motion.div
                  key={item.id || i}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#111113] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/2 transition-all group"
                >
                  <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="flex-1 space-y-2 py-1">
                    <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        By {ownerName}{" "}
                        {item.owner?.isVerified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                    <span className="text-2xl font-clash font-bold text-primary">
                      {formatPrice(item.askingPrice, item.currency)}
                    </span>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => onApprove(item.id)}
                        disabled={isItemProcessing}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-black font-bold text-xs rounded-lg transition-all active:scale-95 shadow-[0_4px_12px_rgba(231,143,35,0.2)] disabled:opacity-50 cursor-pointer"
                      >
                        {isItemProcessing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Approving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onReject(item)}
                        disabled={isItemProcessing}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <Link
                        href={`/admin/listings/${item.slug}`}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-lg border border-white/10 transition-all active:scale-95 text-center"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AdminPendingApprovals;
