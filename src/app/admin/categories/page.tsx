"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  RefreshCw,
  Filter,
  FolderTree,
  Tag,
  ListOrdered,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/hooks/useCategories";
import { Category } from "@/lib/api/categories";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

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
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-14 bg-white/10 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-36 h-4 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="w-48 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-20 h-6 bg-white/10 rounded-full" />
        </td>
        <td className="px-6 py-5 text-center">
          <div className="w-10 h-6 bg-white/10 rounded mx-auto" />
        </td>
        <td className="px-6 py-5 text-center">
          <div className="w-12 h-6 bg-white/10 rounded mx-auto" />
        </td>
        <td className="px-6 py-5 text-center">
          <div className="w-12 h-6 bg-white/10 rounded mx-auto" />
        </td>
        <td className="px-6 py-5">
          <div className="w-16 h-6 bg-white/10 rounded-full" />
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="w-10 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetCategoriesQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
  });

  const deleteCategoryMutation = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data || [];
  const meta = categoriesResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      setCategoryToDelete(null);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to delete category");
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
            <h1 className="text-3xl font-bold font-montserrat">
              Categories Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Organize, monitor, and create luxury marketplace categories
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-left" duration={0.5}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(231,143,35,0.4)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Category
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
                placeholder="Search categories by name or description..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative min-w-37.5">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141416] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer appearance-none pr-8"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option
                    key={st.value}
                    value={st.value}
                    className="bg-[#141416] text-white"
                  >
                    {st.label}
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
              Syncing...
            </div>
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

      {/* Table Section */}
      <AnimationWrapper type="fade-up" duration={0.6} delay={0.3}>
        <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full">
              <thead>
                <tr className="bg-[#151515] border-b border-primary/20">
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Description
                  </th>

                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-center">
                    Order
                  </th>

                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-center">
                    Listings
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Status
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
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <FolderTree className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No categories found
                        </p>
                        <p className="text-xs text-gray-500">
                          {searchQuery
                            ? `No categories matching "${searchQuery}"`
                            : "Click 'Create Category' to add your first category."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Name & Image */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-14 rounded-lg overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0">
                            {category.imageUrl ? (
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1583121274602-3e2820c69888";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                <Tag className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors block">
                              {category.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-5 text-xs text-gray-400 max-w-xs">
                        <p className="line-clamp-2">
                          {category.description || (
                            <span className="text-gray-600 italic">
                              No description
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-[#1C1C1E] border border-[#262626] text-gray-300">
                          {category.displayOrder}
                        </span>
                      </td>

                      {/* Listings Count */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-300 bg-[#1A1A1C] px-2.5 py-1 rounded-lg border border-[#262626]">
                          <ListOrdered className="w-3.5 h-3.5 text-primary" />
                          {category._count?.listings ?? 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            category.isActive
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {category.isActive ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(category.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all cursor-pointer active:scale-95"
                            title="Edit category"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCategoryToDelete(category)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer active:scale-95"
                            title="Delete category"
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
          {!isLoading && categories.length > 0 && (
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
                categories
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

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        nextDisplayOrder={meta.total + 1}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        category={categoryToDelete}
        isDeleting={deleteCategoryMutation.isPending}
      />
    </div>
  );
}
