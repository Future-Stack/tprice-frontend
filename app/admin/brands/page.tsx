"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  RefreshCw,
  Filter,
  ListOrdered,
  Calendar,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Award,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useGetBrandsQuery, useDeleteBrandMutation } from "@/hooks/useBrands";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { Brand } from "@/lib/api/brands";
import CreateBrandModal from "./CreateBrandModal";
import EditBrandModal from "./EditBrandModal";
import DeleteBrandModal from "./DeleteBrandModal";
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
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-20 h-3 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-6 bg-white/10 rounded-lg" />
        </td>
        <td className="px-6 py-5">
          <div className="w-48 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5">
          <div className="w-28 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5 text-center">
          <div className="w-12 h-6 bg-white/10 rounded mx-auto" />
        </td>
        <td className="px-6 py-5">
          <div className="w-24 h-4 bg-white/10 rounded" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="w-16 h-8 bg-white/10 rounded-lg ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

export default function AdminBrandsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch categories for filtering
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data || [];

  // Fetch brands
  const {
    data: brandsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetBrandsQuery({
    page,
    limit,
    search: debouncedSearch,
    categoryId: categoryIdFilter,
  });

  const deleteBrandMutation = useDeleteBrandMutation();

  const brands = brandsResponse?.data || [];
  const meta = brandsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    try {
      await deleteBrandMutation.mutateAsync(brandToDelete.id);
      toast.success(`Brand "${brandToDelete.name}" deleted successfully`);
      setBrandToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete brand");
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
              Brands Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage, organize, and create luxury vehicle and accessory brands
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-left" duration={0.5}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(231,143,35,0.4)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Brand
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
                placeholder="Search brands by name or description..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="relative min-w-40">
              <select
                value={categoryIdFilter}
                onChange={(e) => {
                  setCategoryIdFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141416] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="ALL" className="bg-[#141416] text-white">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="bg-[#141416] text-white"
                  >
                    {cat.name}
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
            title="Refresh brands list"
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
                    Brand
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Description
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Website
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-center">
                    Listings
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
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <Award className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No brands found
                        </p>
                        <p className="text-xs text-gray-500">
                          {searchQuery
                            ? `No brands matching "${searchQuery}"`
                            : "Click 'Create Brand' to add your first brand."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Logo & Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0 p-1 flex items-center justify-center">
                            {brand.logoUrl ? (
                              <Image
                                src={brand.logoUrl}
                                alt={brand.name}
                                width={120}
                                height={80}
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary rounded-lg font-bold text-lg font-clash">
                                {brand.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors block">
                              {brand.name}
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              /{brand.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        {brand.category ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <FolderTree className="w-3.5 h-3.5" />
                            {brand.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            Uncategorized
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-5 text-xs text-gray-400 max-w-xs">
                        <p className="line-clamp-2">
                          {brand.description || (
                            <span className="text-gray-600 italic">
                              No description
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Website */}
                      <td className="px-6 py-5 text-xs">
                        {brand.websiteUrl ? (
                          <a
                            href={brand.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:underline group-hover:text-yellow-400 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate max-w-35">
                              {brand.websiteUrl.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="w-3 h-3 text-gray-500" />
                          </a>
                        ) : (
                          <span className="text-gray-600 italic">N/A</span>
                        )}
                      </td>

                      {/* Listings Count */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-300 bg-[#1A1A1C] px-2.5 py-1 rounded-lg border border-[#262626]">
                          <ListOrdered className="w-3.5 h-3.5 text-primary" />
                          {brand._count?.listings ?? 0}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(brand.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingBrand(brand)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all cursor-pointer active:scale-95"
                            title="Edit brand"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setBrandToDelete(brand)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer active:scale-95"
                            title="Delete brand"
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
          {!isLoading && brands.length > 0 && (
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
                brands
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

      {/* Create Brand Modal */}
      <CreateBrandModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Brand Modal */}
      <EditBrandModal
        isOpen={!!editingBrand}
        onClose={() => setEditingBrand(null)}
        brand={editingBrand}
      />

      {/* Delete Brand Modal */}
      <DeleteBrandModal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        onConfirm={handleDeleteConfirm}
        brand={brandToDelete}
        isDeleting={deleteBrandMutation.isPending}
      />
    </div>
  );
}
