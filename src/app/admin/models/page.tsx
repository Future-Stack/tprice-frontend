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
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Award,
  Car,
  Layers,
  Eye,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useGetModelsQuery, useDeleteModelMutation } from "@/hooks/useModels";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { ModelItem } from "@/lib/api/models";
import CreateModelModal from "./CreateModelModal";
import EditModelModal from "./EditModelModal";
import DeleteModelModal from "./DeleteModelModal";
import ModelDetailModal from "./ModelDetailModal";
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
        {/* Model */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-20 h-3 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        {/* Brand */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="w-24 h-3.5 bg-white/10 rounded" />
              <div className="w-16 h-2.5 bg-white/10 rounded" />
            </div>
          </div>
        </td>
        {/* Category */}
        <td className="px-6 py-5">
          <div className="w-20 h-6 bg-white/10 rounded-lg" />
        </td>
        {/* Trims */}
        <td className="px-6 py-5 text-center">
          <div className="w-14 h-6 bg-white/10 rounded-lg mx-auto" />
        </td>
        {/* Website */}
        <td className="px-6 py-5">
          <div className="w-28 h-4 bg-white/10 rounded" />
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

export default function AdminModelsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandIdFilter, setBrandIdFilter] = useState("ALL");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedModelForView, setSelectedModelForView] = useState<ModelItem | null>(null);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);
  const [modelToDelete, setModelToDelete] = useState<ModelItem | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch brands for dropdown filter
  const { data: brandsResponse } = useGetBrandsQuery({ limit: 100 });
  const brands = brandsResponse?.data || [];

  // Fetch models
  const {
    data: modelsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetModelsQuery({
    page,
    limit,
    search: debouncedSearch,
    brandId: brandIdFilter,
  });

  const deleteModelMutation = useDeleteModelMutation();

  const models = modelsResponse?.data || [];
  const meta = modelsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const handleDeleteConfirm = async () => {
    if (!modelToDelete) return;
    try {
      await deleteModelMutation.mutateAsync(modelToDelete.id);
      toast.success(`Model "${modelToDelete.name}" deleted successfully`);
      setModelToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete model");
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
              Models Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Browse, organize, and manage vehicle models across all luxury brands
            </p>
          </div>
        </AnimationWrapper>

        <AnimationWrapper type="fade-left" duration={0.5}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(231,143,35,0.4)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Model
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
                placeholder="Search models by name or slug..."
                className="w-full bg-[#141416] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Brand Dropdown Filter */}
            <div className="relative min-w-44">
              <select
                value={brandIdFilter}
                onChange={(e) => {
                  setBrandIdFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#141416] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="ALL" className="bg-[#141416] text-white">
                  All Brands
                </option>
                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                    className="bg-[#141416] text-white"
                  >
                    {brand.name}
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
            title="Refresh models list"
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
                    Model
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Brand
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest text-center">
                    Trims
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-white uppercase tracking-widest">
                    Brand Website
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
                ) : models.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <Car className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-base font-semibold text-gray-300">
                          No models found
                        </p>
                        <p className="text-xs text-gray-500">
                          {searchQuery
                            ? `No models matching "${searchQuery}"`
                            : brandIdFilter !== "ALL"
                            ? "No models found for selected brand."
                            : "Click 'Create Model' to add your first vehicle model."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  models.map((model) => (
                    <tr
                      key={model.id}
                      className="group hover:bg-[#161618] transition-all duration-200"
                    >
                      {/* Model Name & Slug */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                            <Car className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-gray-100 group-hover:text-primary transition-colors block">
                              {model.name}
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              /{model.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Brand Info */}
                      <td className="px-6 py-5">
                        {model.brand ? (
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#262626] bg-[#1A1A1A] shrink-0 p-0.5 flex items-center justify-center">
                              {model.brand.logoUrl ? (
                                <Image
                                  src={model.brand.logoUrl}
                                  alt={model.brand.name}
                                  width={60}
                                  height={40}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                                  {model.brand.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-xs text-gray-200 block">
                                {model.brand.name}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                /{model.brand.slug}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            No Brand
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        {model.brand?.category ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <FolderTree className="w-3.5 h-3.5" />
                            {model.brand.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            Uncategorized
                          </span>
                        )}
                      </td>

                      {/* Trims Count */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-300 bg-[#1A1A1C] px-2.5 py-1 rounded-lg border border-[#262626]">
                          <Layers className="w-3.5 h-3.5 text-primary" />
                          {model._count?.trims ?? model.trims?.length ?? 0}
                        </span>
                      </td>

                      {/* Brand Website */}
                      <td className="px-6 py-5 text-xs">
                        {model.brand?.websiteUrl ? (
                          <a
                            href={model.brand.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:underline group-hover:text-yellow-400 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate max-w-32">
                              {model.brand.websiteUrl.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink className="w-3 h-3 text-gray-500" />
                          </a>
                        ) : (
                          <span className="text-gray-600 italic">N/A</span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {formatDate(model.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedModelForView(model)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg border border-[#262626] transition-all cursor-pointer active:scale-95"
                            title="View model details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingModel(model)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all cursor-pointer active:scale-95"
                            title="Edit model"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setModelToDelete(model)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer active:scale-95"
                            title="Delete model"
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
          {!isLoading && models.length > 0 && (
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
                models
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

      {/* Model Detail Modal */}
      <ModelDetailModal
        isOpen={!!selectedModelForView}
        onClose={() => setSelectedModelForView(null)}
        model={selectedModelForView}
      />

      {/* Create Model Modal */}
      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultBrandId={brandIdFilter !== "ALL" ? brandIdFilter : undefined}
      />

      {/* Edit Model Modal */}
      <EditModelModal
        isOpen={!!editingModel}
        onClose={() => setEditingModel(null)}
        model={editingModel}
      />

      {/* Delete Model Modal */}
      <DeleteModelModal
        isOpen={!!modelToDelete}
        onClose={() => setModelToDelete(null)}
        onConfirm={handleDeleteConfirm}
        model={modelToDelete}
        isDeleting={deleteModelMutation.isPending}
      />
    </div>
  );
}
