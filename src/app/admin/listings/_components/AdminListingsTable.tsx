import React from "react";
import { Building2 } from "lucide-react";
import { AdminListingsTableProps } from "./types";
import { AdminListingsTableRow } from "./AdminListingsTableRow";

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
          <td className="px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-24 h-14 bg-white/10 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-40 h-4 bg-white/10 rounded" />
                <div className="w-24 h-3 bg-white/5 rounded" />
              </div>
            </div>
          </td>
          <td className="px-6 py-5">
            <div className="w-28 h-4 bg-white/10 rounded" />
          </td>
          <td className="px-6 py-5">
            <div className="w-24 h-4 bg-white/10 rounded" />
          </td>
          <td className="px-6 py-5">
            <div className="w-20 h-4 bg-white/10 rounded" />
          </td>
          <td className="px-6 py-5">
            <div className="w-20 h-4 bg-white/10 rounded" />
          </td>
          <td className="px-6 py-5">
            <div className="w-24 h-7 bg-white/10 rounded-lg" />
          </td>
          <td className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-white/10 rounded-lg" />
              <div className="w-16 h-8 bg-white/10 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function AdminListingsTable({
  listings,
  isLoading,
  searchQuery,
  activeTab,
  deletingId,
  updatingId,
  isDeletePending,
  isUpdatePending,
  updateTargetStatus,
  onApprove,
  onOpenRejectModal,
  onOpenEditModal,
  onOpenDeleteModal,
}: AdminListingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-250">
        <thead>
          <tr className="bg-[#151515] border-b border-primary/30">
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Listing
            </th>
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Dealer
            </th>
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Price
            </th>
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Category
            </th>
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Submitted
            </th>
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A1A1A]">
          {isLoading ? (
            <TableSkeleton />
          ) : listings.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-16 text-center">
                <div className="max-w-md mx-auto space-y-3">
                  <Building2 className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-base font-semibold text-gray-300">No listings found</p>
                  <p className="text-xs text-gray-500">
                    {searchQuery
                      ? `No listings match "${searchQuery}"`
                      : activeTab !== "All listings"
                        ? `No ${activeTab} listings at the moment.`
                        : "No listings available."}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            listings.map((listing) => (
              <AdminListingsTableRow
                key={listing.id}
                listing={listing}
                deletingId={deletingId}
                updatingId={updatingId}
                isDeletePending={isDeletePending}
                isUpdatePending={isUpdatePending}
                updateTargetStatus={updateTargetStatus}
                onApprove={onApprove}
                onOpenRejectModal={onOpenRejectModal}
                onOpenEditModal={onOpenEditModal}
                onOpenDeleteModal={onOpenDeleteModal}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminListingsTable;
