"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Film,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  X,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import Image from "next/image";
import {
  useLandingMediaQuery,
  useDeleteLandingMediaMutation,
} from "@/hooks/useMedia";
import { LandingMediaItem } from "@/lib/api/media";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import CreateMediaModal from "./CreateMediaModal";
import DeleteMediaModal from "./DeleteMediaModal";

const LIMIT_OPTIONS = [10, 20, 40, 80];

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

/**
 * Smooth Grid Skeleton Loader component
 */
const MediaGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="bg-[#18181A] border border-[#262626] rounded-2xl overflow-hidden animate-pulse flex flex-col h-85"
      >
        {/* Media Thumbnail Skeleton */}
        <div className="w-full h-48 bg-white/5 relative">
          <div className="absolute top-3 left-3 w-20 h-6 bg-white/10 rounded-full" />
          <div className="absolute top-3 right-3 w-14 h-6 bg-white/10 rounded-full" />
        </div>
        {/* Card Content Skeleton */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-3/4 h-5 bg-white/10 rounded-md" />
            <div className="w-full h-3.5 bg-white/5 rounded-md" />
            <div className="w-2/3 h-3.5 bg-white/5 rounded-md" />
          </div>
          <div className="pt-3 border-t border-[#262626] flex items-center justify-between">
            <div className="w-24 h-4 bg-white/10 rounded" />
            <div className="w-16 h-4 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function AdminMediaPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeType, setActiveType] = useState("ALL");
  const [selectedMedia, setSelectedMedia] = useState<LandingMediaItem | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<LandingMediaItem | null>(
    null,
  );

  const deleteMediaMutation = useDeleteLandingMediaMutation();

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;
    try {
      await deleteMediaMutation.mutateAsync(mediaToDelete.id);
      toast.success("Landing media asset deleted successfully");
      setMediaToDelete(null);
      if (selectedMedia?.id === mediaToDelete.id) {
        setSelectedMedia(null);
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete media asset";
      toast.error(errMsg);
    }
  };

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch paginated landing media
  const { data, isLoading, isFetching, refetch } = useLandingMediaQuery({
    page,
    limit,
    category: activeCategory !== "ALL" ? activeCategory : undefined,
    type: activeType !== "ALL" ? activeType : undefined,
    search: debouncedSearch.trim() || undefined,
  });

  const mediaList: LandingMediaItem[] = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || mediaList.length;

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <AnimationWrapper type="fade-up">
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div>
              <h1 className="text-3xl font-bold font-montserrat text-white tracking-wide">
                Media Management
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Browse, filter, and inspect landing page media assets and
                promotional banners.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-sm font-semibold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.25)] active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Media</span>
            </button>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#262626] bg-[#18181A] text-gray-300 hover:text-white hover:border-primary/50 transition-all text-sm font-medium disabled:opacity-50 cursor-pointer"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 text-primary ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Media Grid Section */}
        {isLoading ? (
          <MediaGridSkeleton count={limit} />
        ) : mediaList.length === 0 ? (
          <div className="bg-[#18181A] border border-[#262626] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-75">
            <div className="w-16 h-16 rounded-full bg-[#E78F23]/10 border border-[#E78F23]/20 flex items-center justify-center text-primary mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Media Found
            </h3>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              No media items matching your selected criteria were found. Try
              adjusting your search query or create a new media asset.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-primary hover:bg-yellow-400 text-black rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Create Media
              </button>
              {(searchQuery ||
                activeCategory !== "ALL" ||
                activeType !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("ALL");
                    setActiveType("ALL");
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-[#E78F23]/10 border border-[#E78F23]/30 text-primary rounded-xl text-sm font-medium hover:bg-[#E78F23]/20 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaList.map((item) => {
              const displayImage = item.thumbnailUrl || item.mediaUrl;
              const isVideo = item.type?.toUpperCase() === "VIDEO";

              return (
                <div
                  key={item.id}
                  className="bg-[#18181A] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#E78F23]/40 transition-all duration-300 group flex flex-col hover:shadow-[0_10px_30px_rgba(231,143,35,0.12)]"
                >
                  {/* Thumbnail / Media Preview */}
                  <div
                    onClick={() => setSelectedMedia(item)}
                    className="relative w-full aspect-video bg-[#111111] overflow-hidden cursor-pointer group-hover:brightness-105 transition-all"
                  >
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#18181A] text-gray-600">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      {item.category && (
                        <span className="bg-black/70 backdrop-blur-md border border-primary/40 text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      )}

                      {item.badgeText && (
                        <span className="bg-primary text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider ml-auto">
                          {item.badgeText}
                        </span>
                      )}
                    </div>

                    {/* Type Badge (Bottom Left) */}
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                      <span className="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                        {isVideo ? (
                          <>
                            <Film className="w-3 h-3 text-red-400" />
                            <span>VIDEO</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3 text-primary" />
                            <span>IMAGE</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="p-2.5 bg-primary text-black rounded-full shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                        <Eye className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* Card Main Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3
                          onClick={() => setSelectedMedia(item)}
                          className="font-semibold text-white group-hover:text-primary transition-colors cursor-pointer line-clamp-1 text-base"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                      </div>

                      {item.caption && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>

                    {/* Footer Metadata */}
                    <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isPublished !== undefined && (
                          <span
                            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                              item.isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/10 text-primary border-amber-500/30"
                            }`}
                          >
                            {item.isPublished ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Live
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Draft
                              </>
                            )}
                          </span>
                        )}

                        <button
                          onClick={() => setSelectedMedia(item)}
                          className="p-1.5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaToDelete(item);
                          }}
                          className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Delete Media Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="bg-[#18181A] border border-[#262626] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>
              Showing{" "}
              <strong className="text-white">
                {totalItems === 0 ? 0 : (page - 1) * limit + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(page * limit, totalItems)}
              </strong>{" "}
              of <strong className="text-white">{totalItems}</strong> media
              assets
            </span>

            <div className="flex items-center gap-2 border-l border-[#262626] pl-4">
              <span>Per page:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="bg-[#111111] border border-[#262626] text-white text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#18181A]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#262626] bg-[#111111] text-xs font-medium text-gray-300 hover:text-white hover:border-primary/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 px-2">
              <span className="text-xs text-gray-400">
                Page <strong className="text-white">{page}</strong> of{" "}
                <strong className="text-white">{totalPages}</strong>
              </span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || isFetching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#262626] bg-[#111111] text-xs font-medium text-gray-300 hover:text-white hover:border-[#E78F23]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Inspect Lightbox Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="bg-[#18181A] border border-[#262626] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#111111]">
                <div>
                  <h2 className="text-lg font-bold text-white font-clash">
                    Media Inspection
                  </h2>
                  <p className="text-xs text-gray-400">
                    ID: {selectedMedia.id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMediaToDelete(selectedMedia)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    title="Delete Media Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Preview Area */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                {selectedMedia.mediaUrl ? (
                  <Image
                    src={selectedMedia.mediaUrl}
                    alt={selectedMedia.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="text-gray-500 text-sm">
                    No Preview Available
                  </div>
                )}
              </div>

              {/* Modal Details Content */}
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedMedia.category && (
                      <span className="px-3 py-1 bg-[#E78F23]/10 border border-[#E78F23]/30 text-primary text-xs font-semibold rounded-full uppercase">
                        {selectedMedia.category}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full uppercase">
                      {selectedMedia.type || "IMAGE"}
                    </span>
                    {selectedMedia.badgeText && (
                      <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full uppercase">
                        {selectedMedia.badgeText}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 font-clash">
                    {selectedMedia.title}
                  </h3>

                  {selectedMedia.caption && (
                    <p className="text-sm text-gray-300 leading-relaxed bg-[#111111] p-3.5 rounded-xl border border-[#262626]">
                      {selectedMedia.caption}
                    </p>
                  )}
                </div>

                {/* Technical Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#111111] rounded-xl border border-[#262626]">
                    <span className="text-gray-400 block mb-1">Status</span>
                    <span className="font-semibold text-emerald-400">
                      {selectedMedia.isPublished !== false
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Media Modal */}
        <CreateMediaModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Delete Media Modal */}
        <DeleteMediaModal
          isOpen={!!mediaToDelete}
          onClose={() => setMediaToDelete(null)}
          onConfirm={handleDeleteConfirm}
          mediaItem={mediaToDelete}
          isDeleting={deleteMediaMutation.isPending}
        />
      </div>
    </AnimationWrapper>
  );
}
