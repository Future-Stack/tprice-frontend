import React from "react";
import Image from "next/image";
import { Loader2, Edit3, Trash2 } from "lucide-react";
import {
  AdminListingsTableRowProps,
  formatPrice,
  formatSubmittedDate,
  getDealerName,
  getStatusBadge,
} from "./types";

export function AdminListingsTableRow({
  listing,
  deletingId,
  updatingId,
  isDeletePending,
  isUpdatePending,
  updateTargetStatus,
  onApprove,
  onOpenRejectModal,
  onOpenEditModal,
  onOpenDeleteModal,
}: AdminListingsTableRowProps) {
  const badge = getStatusBadge(listing.status);
  const mainImage =
    listing.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";

  const isRowDeleting = deletingId === listing.id || (isDeletePending && deletingId === listing.id);
  const isRowUpdating = updatingId === listing.id || (isUpdatePending && updatingId === listing.id);

  return (
    <tr
      className={`group hover:bg-[#151515] transition-all duration-300 ${
        isRowDeleting ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-base text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
              {listing.title}
            </span>
            {listing.brand && <span className="text-xs text-gray-500">{listing.brand}</span>}
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-400 font-medium">{getDealerName(listing)}</td>
      <td className="px-6 py-5 font-bold text-base text-white">
        {formatPrice(listing.askingPrice, listing.currency)}
      </td>
      <td className="px-6 py-5 text-sm text-gray-400">{listing.category || "Uncategorized"}</td>
      <td className="px-6 py-5 text-sm text-gray-400">{formatSubmittedDate(listing.createdAt)}</td>
      <td className="px-6 py-5">
        <div
          className={`inline-flex px-4 py-1.5 rounded-lg text-xs font-bold capitalize tracking-wide ${badge.className}`}
        >
          {badge.label}
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          {(badge.label.toLowerCase() === "pending" || listing.status === "PENDING_APPROVAL") && (
            <>
              <button
                onClick={() => onApprove(listing.id, listing.title)}
                disabled={isRowUpdating || isRowDeleting}
                className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-yellow-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isRowUpdating && updateTargetStatus === "LIVE" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Approve</span>
              </button>
              <button
                onClick={() => onOpenRejectModal(listing)}
                disabled={isRowUpdating || isRowDeleting}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isRowUpdating && updateTargetStatus === "REJECTED" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                ) : null}
                <span>Reject</span>
              </button>
            </>
          )}
          {(badge.label.toLowerCase() === "rejected" || listing.status === "REJECTED") && (
            <button
              onClick={() => onApprove(listing.id, listing.title)}
              disabled={isRowUpdating || isRowDeleting}
              className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-yellow-400 cursor-pointer text-black text-xs font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isRowUpdating && updateTargetStatus === "LIVE" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              <span>Approve</span>
            </button>
          )}
          <button
            onClick={() => onOpenEditModal(listing)}
            disabled={isRowDeleting || isRowUpdating}
            className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-lg border border-primary/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Edit listing"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onOpenDeleteModal(listing)}
            disabled={isDeletePending || isRowDeleting || isRowUpdating}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Delete listing"
          >
            {isRowDeleting ? (
              <Loader2 size={18} className="animate-spin text-red-400" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AdminListingsTableRow;
