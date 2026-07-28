"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Mail,
  Phone,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useAdminContactInquiriesQuery,
  useUpdateAdminContactInquiryMutation,
} from "@/hooks/useContact";
import {
  ContactInquiryItem,
  UpdateContactInquiryPayload,
} from "@/lib/api/contact";
import InquiryDetailModal from "./InquiryDetailModal";
import UpdateInquiryModal from "./UpdateInquiryModal";
import { toast } from "sonner";

const LIMIT_OPTIONS = [10, 20, 50, 100];

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const normalized = status?.toUpperCase();
  switch (normalized) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          NEW
        </span>
      );
    case "RESPONDED":
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <CheckCircle2 className="w-3 h-3" />
          {normalized}
        </span>
      );
    case "READ":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/30">
          <Clock className="w-3 h-3" />
          READ
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-500/10 text-gray-300 border border-gray-500/30">
          <AlertCircle className="w-3 h-3" />
          {status || "UNKNOWN"}
        </span>
      );
  }
};

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-20 h-3 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="w-36 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-28 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-48 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-5 bg-white/10 rounded-full" />
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="w-24 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminInquiriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] =
    useState<ContactInquiryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedInquiryForUpdate, setSelectedInquiryForUpdate] =
    useState<ContactInquiryItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const updateMutation = useUpdateAdminContactInquiryMutation();

  // Fetch inquiries from API endpoint /admin/contact/inquiries
  const {
    data: inquiriesResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminContactInquiriesQuery({
    page,
    limit,
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    ...(search.trim() !== "" ? { search: search.trim() } : {}),
  });

  const rawInquiries = inquiriesResponse?.data || [];
  const meta = inquiriesResponse?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Client-side search fallback filter if search parameter isn't supported server-side
  const filteredInquiries = rawInquiries.filter((inquiry) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      inquiry.fullName?.toLowerCase().includes(query) ||
      inquiry.email?.toLowerCase().includes(query) ||
      inquiry.phone?.toLowerCase().includes(query) ||
      inquiry.message?.toLowerCase().includes(query)
    );
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  const handleViewDetails = (inquiry: ContactInquiryItem) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const handleOpenUpdateModal = (inquiry: ContactInquiryItem) => {
    setSelectedInquiryForUpdate(inquiry);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateInquiry = async (
    id: string,
    payload: UpdateContactInquiryPayload
  ) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      toast.success("Inquiry updated successfully");
      setIsUpdateModalOpen(false);
      setSelectedInquiryForUpdate(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update inquiry"
      );
    }
  };

  const newCount = rawInquiries.filter(
    (i) => i.status?.toUpperCase() === "NEW"
  ).length;

  return (
    <div className="min-h-screen text-white font-sans pb-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h1 className="text-3xl font-bold font-montserrat flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              Inquiries Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              View and manage customer contact messages and inquiries
            </p>
          </div>
        </AnimationWrapper>

        {/* Stats Summary Badge */}
        <AnimationWrapper type="fade-down" duration={0.5} delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="bg-[#141416] border border-[#262626] rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  Total Inquiries
                </p>
                <p className="text-sm font-bold text-white">{meta.total}</p>
              </div>
            </div>

            <div className="bg-[#141416] border border-[#262626] rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  New Status
                </p>
                <p className="text-sm font-bold text-emerald-400">
                  {newCount}
                </p>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      </div>

      {/* Filter & Controls Bar */}
      <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <AnimationWrapper type="fade-up" duration={0.4} delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-auto bg-[#141416] border border-[#262626] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-primary/60 cursor-pointer"
              >
                <option value="ALL" className="bg-[#141416]">
                  All Statuses
                </option>
                <option value="NEW" className="bg-[#141416]">
                  New
                </option>
                <option value="READ" className="bg-[#141416]">
                  Read
                </option>
                <option value="RESPONDED" className="bg-[#141416]">
                  Responded
                </option>
                <option value="RESOLVED" className="bg-[#141416]">
                  Resolved
                </option>
              </select>
            </div>
          </div>
        </AnimationWrapper>

        {/* Limit Selector & Refresh Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#141416] border border-[#262626] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-primary/60 cursor-pointer"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#141416]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {isFetching && !isLoading && (
              <span className="text-xs text-primary animate-pulse hidden sm:inline">
                Updating...
              </span>
            )}
            <button
              onClick={() => refetch()}
              className="p-2.5 bg-[#141416] border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full">
              <thead>
                <tr className="bg-[#151515] border-b border-primary/20">
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Full Name
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Phone
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Message
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {isLoading ? (
                  <TableSkeleton />
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-red-400"
                    >
                      Failed to load inquiries. {(error as Error)?.message}
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <Inbox className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No inquiries found
                        </p>
                        <p className="text-xs text-gray-500">
                          {search || statusFilter !== "ALL"
                            ? "No contact inquiries match your filter criteria."
                            : "There are currently no contact inquiries submitted."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Full Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {inquiry.fullName
                              ? inquiry.fullName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors block">
                              {inquiry.fullName || "Anonymous"}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {inquiry.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5 text-xs text-gray-300">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                          <span>{inquiry.email}</span>
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-5 text-xs text-gray-300">
                        {inquiry.phone ? (
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                            <span>{inquiry.phone}</span>
                          </a>
                        ) : (
                          <span className="text-gray-600 italic">N/A</span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="px-6 py-5 text-xs text-gray-300 max-w-xs">
                        <p className="line-clamp-1 truncate text-gray-300">
                          {inquiry.message || "No message content"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {getStatusBadge(inquiry.status)}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(inquiry)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1C] hover:bg-white/10 text-gray-300 rounded-lg border border-[#262626] transition-all text-xs font-medium cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          <button
                            onClick={() => handleOpenUpdateModal(inquiry)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary hover:text-black text-primary rounded-lg border border-primary/30 transition-all text-xs font-medium cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && filteredInquiries.length > 0 && (
            <div className="px-6 py-4 bg-[#141416] border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <div>
                Showing{" "}
                <span className="font-semibold text-white">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-white">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">{meta.total}</span>{" "}
                inquiries
              </div>

              {/* Page Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                        pageNum === meta.page
                          ? "bg-primary text-black border-primary font-bold shadow-[0_2px_10px_rgba(231,143,35,0.3)]"
                          : "bg-[#1A1A1C] border-[#262626] text-gray-300 hover:text-white hover:border-primary/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="p-2 rounded-lg border border-[#262626] bg-[#1A1A1C] text-gray-300 hover:text-white hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </AnimationWrapper>

      {/* Inquiry Details Modal */}
      <InquiryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        inquiry={selectedInquiry}
        onOpenUpdateModal={handleOpenUpdateModal}
      />

      {/* Update Inquiry Status & Notes Modal */}
      <UpdateInquiryModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedInquiryForUpdate(null);
        }}
        inquiry={selectedInquiryForUpdate}
        onUpdate={handleUpdateInquiry}
        isUpdating={updateMutation.isPending}
      />
    </div>
  );
}
