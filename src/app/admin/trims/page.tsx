"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  RefreshCw,
  Filter,
  Calendar,
  Layers,
  Car,
  Award,
  FolderTree,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useGetTrimsQuery, useDeleteTrimMutation } from "@/hooks/useTrims";
import { useGetModelsQuery } from "@/hooks/useModels";
import { TrimItem } from "@/lib/api/trims";
import CreateTrimModal from "./CreateTrimModal";
import EditTrimModal from "./EditTrimModal";
import DeleteTrimModal from "./DeleteTrimModal";
import TrimDetailModal from "./TrimDetailModal";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import Image from "next/image";

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

const TableSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="border-b border-[#1A1A1A] animate-pulse">
        {/* Trim */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-36 h-4 bg-white/10 rounded" />
              <div className="w-24 h-3 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        {/* Model */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="w-28 h-3.5 bg-white/10 rounded" />
              <div className="w-16 h-2.5 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        {/* Brand & Category */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-md shrink-0" />
            <div className="space-y-1">
              <div className="w-20 h-3.5 bg-white/10 rounded" />
              <div className="w-14 h-2.5 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        {/* Years */}
        <td className="px-6 py-5">
          <div className="w-24 h-6 bg-white/10 rounded-lg" />
        </td>
        {/* Created At */}
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        {/* Actions */}
        <td className="px-6 py-5 text-right">
          <div className="w-24 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminTrimsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelIdFilter, setModelIdFilter] = useState("ALL");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrimForView, setSelectedTrimForView] = useState<TrimItem | null>(null);
  const [editingTrim, setEditingTrim] = useState<TrimItem | null>(null);
  const [trimToDelete, setTrimToDelete] = useState<TrimItem | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch models for dropdown filter
  const { data: modelsResponse } = useGetModelsQuery({ limit: 100 });
  const models = modelsResponse?.data || [];

  // Fetch trims
  const {
    data: trimsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetTrimsQuery({
    page,
    limit,
    search: debouncedSearch,
    modelId: modelIdFilter,
  });

  const deleteTrimMutation = useDeleteTrimMutation();

  const trims = trimsResponse?.data || [];
  const meta = trimsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const handleDeleteConfirm = async () => {
    if (!trimToDelete) return;
    try {
      await deleteTrimMutation.mutateAsync(trimToDelete.id);
      toast.success(`Trim "${trimToDelete.name}" deleted successfully`);
      setTrimToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete trim");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans pb-12">
      {/* Header & Create Button Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h1 className="text-3xl font-bold font-montserrat flex items-center gap-3">
              Trims Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Configure vehicle trim packages, specification levels, and model year ranges
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-left" duration={0.5}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(231,143,35,0.4)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Trim
          </button>
        </AnimationWrapper>
      </div>

      {/* Controls & Search Bar */}
      <div className="mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <AnimationWrapper type="fade-up" duration={0.4} delay={0.2}>
          <div className="w-full flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 min-w-60 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search trims by name..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Model Dropdown Filter */}
            <div className="relative min-w-48">
              <select
                value={modelIdFilter}
                onChange={(e) => {
                  setModelIdFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141416] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="ALL" className="bg-[#141416] text-white">
                  All Models
                </option>
                {models.map((model) => (
                  <option
                    key={model.id}
                    value={model.id}
                    className="bg-[#141416] text-white"
                  >
                    {model.name} {model.brand ? `(${model.brand.name})` : ""}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Limit Selector */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="hidden sm:inline">Per page:</span>
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
          </div>
        </AnimationWrapper>

        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </div>
          )}
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-[#141416] border border-[#262626] rounded-xl text-gray-400 hover:text-white hover:border-primary/40 transition-colors cursor-pointer"
            title="Refresh trims list"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
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
                    Trim Name
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Vehicle Model
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Brand & Category
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Model Years
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Created At
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {isLoading ? (
                  <TableSkeleton />
                ) : trims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <Layers className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No trims found
                        </p>
                        <p className="text-xs text-gray-500">
                          {searchQuery
                            ? `No trims matching "${searchQuery}"`
                            : modelIdFilter !== "ALL"
                            ? "No trims found for the selected model."
                            : "Click 'Create Trim' to add your first trim variant."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  trims.map((trim) => (
                    <tr
                      key={trim.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Trim Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors block">
                              {trim.name}
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              ID: {trim.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Model Info */}
                      <td className="px-6 py-5">
                        {trim.model ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/5 border border-[#262626] flex items-center justify-center text-gray-300 shrink-0">
                              <Car className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-medium text-xs text-gray-200 block">
                                {trim.model.name}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                /{trim.model.slug}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            No Model
                          </span>
                        )}
                      </td>

                      {/* Brand & Category Info */}
                      <td className="px-6 py-5">
                        {trim.model?.brand ? (
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0 p-0.5 flex items-center justify-center">
                              {trim.model.brand.logoUrl ? (
                                <Image
                                  src={trim.model.brand.logoUrl}
                                  alt={trim.model.brand.name}
                                  width={50}
                                  height={30}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                                  }}
                                />
                              ) : (
                                <span className="text-primary font-bold text-[10px]">
                                  {trim.model.brand.name.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-xs text-gray-200 block">
                                {trim.model.brand.name}
                              </span>
                              {trim.model.brand.category && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                                  <FolderTree className="w-3 h-3" />
                                  {trim.model.brand.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            No Brand
                          </span>
                        )}
                      </td>

                      {/* Model Years */}
                      <td className="px-6 py-5">
                        {trim.yearStart || trim.yearEnd ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="w-3.5 h-3.5" />
                            {trim.yearStart || "—"} - {trim.yearEnd || "Present"}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            All Years
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(trim.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTrimForView(trim)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg border border-[#262626] transition-all cursor-pointer active:scale-95"
                            title="View trim details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingTrim(trim)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all cursor-pointer active:scale-95"
                            title="Edit trim"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTrimToDelete(trim)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer active:scale-95"
                            title="Delete trim"
                          >
                            <Trash2 className="w-4 h-4" />
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
          {!isLoading && trims.length > 0 && (
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
                trims
              </div>

              {/* Page Buttons */}
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
                  ),
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

      {/* Trim Detail Modal */}
      <TrimDetailModal
        isOpen={!!selectedTrimForView}
        onClose={() => setSelectedTrimForView(null)}
        trim={selectedTrimForView}
      />

      {/* Create Trim Modal */}
      <CreateTrimModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultModelId={modelIdFilter !== "ALL" ? modelIdFilter : undefined}
      />

      {/* Edit Trim Modal */}
      <EditTrimModal
        isOpen={!!editingTrim}
        onClose={() => setEditingTrim(null)}
        trim={editingTrim}
      />

      {/* Delete Trim Modal */}
      <DeleteTrimModal
        isOpen={!!trimToDelete}
        onClose={() => setTrimToDelete(null)}
        onConfirm={handleDeleteConfirm}
        trim={trimToDelete}
        isDeleting={deleteTrimMutation.isPending}
      />
    </div>
  );
}
