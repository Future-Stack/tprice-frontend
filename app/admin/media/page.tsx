"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Film,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Tag,
  Sparkles,
  Filter,
  Layers,
  ExternalLink,
  X,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Hash,
} from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import Image from "next/image";
import { useLandingMediaQuery } from "@/hooks/useMedia";
import { LandingMediaItem } from "@/lib/api/media";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "Aviation", value: "AVIATION" },
  { label: "Yacht", value: "YACHT" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Watches", value: "WATCH" },
];

const TYPE_OPTIONS = [
  { label: "All Types", value: "ALL" },
  { label: "Images", value: "IMAGE" },
  { label: "Videos", value: "VIDEO" },
];

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
        className="bg-[#18181A] border border-[#262626] rounded-2xl overflow-hidden animate-pulse flex flex-col h-[340px]"
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
  const [selectedMedia, setSelectedMedia] = useState<LandingMediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCategoryChange = (catValue: string) => {
    setActiveCategory(catValue);
    setPage(1);
  };

  const handleTypeChange = (typeValue: string) => {
    setActiveType(typeValue);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Media URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimationWrapper type="fade-up">
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E78F23]/10 border border-[#E78F23]/20 rounded-2xl text-[#E78F23]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-clash text-white tracking-wide">
                  Media Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Browse, filter, and inspect landing page media assets and promotional banners.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#262626] bg-[#18181A] text-gray-300 hover:text-white hover:border-[#E78F23]/50 transition-all text-sm font-medium disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#E78F23] ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-[#18181A] border border-[#262626] rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search media by title or caption..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#111111] border border-[#262626] focus:border-[#E78F23] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2 bg-[#111111] border border-[#262626] rounded-xl px-3 py-1.5">
                <Filter className="w-4 h-4 text-[#E78F23]" />
                <span className="text-xs text-gray-400 hidden sm:inline">Category:</span>
                <select
                  value={activeCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none cursor-pointer pr-2"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="bg-[#18181A] text-white"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2 bg-[#111111] border border-[#262626] rounded-xl px-3 py-1.5">
                <Layers className="w-4 h-4 text-[#E78F23]" />
                <span className="text-xs text-gray-400 hidden sm:inline">Type:</span>
                <select
                  value={activeType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none cursor-pointer pr-2"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option
                      key={t.value}
                      value={t.value}
                      className="bg-[#18181A] text-white"
                    >
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid Section */}
        {isLoading ? (
          <MediaGridSkeleton count={limit} />
        ) : mediaList.length === 0 ? (
          <div className="bg-[#18181A] border border-[#262626] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#E78F23]/10 border border-[#E78F23]/20 flex items-center justify-center text-[#E78F23] mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Media Found</h3>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              No media items matching your selected criteria were found. Try adjusting your search query or filter options.
            </p>
            {(searchQuery || activeCategory !== "ALL" || activeType !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                  setActiveType("ALL");
                  setPage(1);
                }}
                className="px-4 py-2 bg-[#E78F23]/10 border border-[#E78F23]/30 text-[#E78F23] rounded-xl text-sm font-medium hover:bg-[#E78F23]/20 transition-all"
              >
                Reset All Filters
              </button>
            )}
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
                        <span className="bg-black/70 backdrop-blur-md border border-[#E78F23]/40 text-[#E78F23] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      )}

                      {item.badgeText && (
                        <span className="bg-[#E78F23] text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider ml-auto">
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
                            <ImageIcon className="w-3 h-3 text-[#E78F23]" />
                            <span>IMAGE</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="p-2.5 bg-[#E78F23] text-black rounded-full shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
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
                          className="font-semibold text-white group-hover:text-[#E78F23] transition-colors cursor-pointer line-clamp-1 text-base"
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
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
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
                          className="p-1.5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
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
              of <strong className="text-white">{totalItems}</strong> media assets
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#262626] bg-[#111111] text-xs font-medium text-gray-300 hover:text-white hover:border-[#E78F23]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E78F23]/10 border border-[#E78F23]/30 rounded-xl text-[#E78F23]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-clash">
                      Media Inspection
                    </h2>
                    <p className="text-xs text-gray-400">ID: {selectedMedia.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
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
                  <div className="text-gray-500 text-sm">No Preview Available</div>
                )}
              </div>

              {/* Modal Details Content */}
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedMedia.category && (
                      <span className="px-3 py-1 bg-[#E78F23]/10 border border-[#E78F23]/30 text-[#E78F23] text-xs font-semibold rounded-full uppercase">
                        {selectedMedia.category}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full uppercase">
                      {selectedMedia.type || "IMAGE"}
                    </span>
                    {selectedMedia.badgeText && (
                      <span className="px-3 py-1 bg-[#E78F23] text-black text-xs font-bold rounded-full uppercase">
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
                      {selectedMedia.isPublished !== false ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="p-3 bg-[#111111] rounded-xl border border-[#262626]">
                    <span className="text-gray-400 block mb-1">Display Order</span>
                    <span className="font-semibold text-white">
                      {selectedMedia.displayOrder ?? 0}
                    </span>
                  </div>

                  <div className="p-3 bg-[#111111] rounded-xl border border-[#262626]">
                    <span className="text-gray-400 block mb-1">Created At</span>
                    <span className="font-semibold text-white">
                      {formatDate(selectedMedia.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Media URL Copy / Actions */}
                <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleCopyUrl(selectedMedia.mediaUrl, selectedMedia.id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#262626] hover:border-[#E78F23]/50 rounded-xl text-xs text-gray-300 hover:text-white transition-all"
                  >
                    {copiedId === selectedMedia.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied URL</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#E78F23]" />
                        <span>Copy Direct Media URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={selectedMedia.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#E78F23] hover:bg-[#d47f1c] text-black font-semibold text-xs rounded-xl transition-all"
                  >
                    <span>Open Original</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimationWrapper>
  );
}
