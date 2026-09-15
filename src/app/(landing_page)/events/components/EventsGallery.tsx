"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, AlertCircle, RefreshCw } from "lucide-react";
import MediaModal from "./MediaModal";
import { useLandingMediaQuery } from "@/hooks/useMedia";
import { LandingMediaItem } from "@/lib/api/media";

export default function EventsGallery() {
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "image" | "video";
    src: string;
    title?: string;
  } | null>(null);

  const {
    data: mediaResponse,
    isLoading,
    isError,
    refetch,
  } = useLandingMediaQuery({
    page: 1,
    limit: 12,
  });

  const mediaItems = mediaResponse?.data || [];

  // Distribute items into 3 columns for staggered masonry layout
  const col1 = mediaItems.filter((_, i) => i % 3 === 0);
  const col2 = mediaItems.filter((_, i) => i % 3 === 1);
  const col3 = mediaItems.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-24 bg-black px-6 md:px-12 border-t border-white/5">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-serif text-white">Media</h2>
          {mediaResponse?.meta?.total ? (
            <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
              Total {mediaResponse.meta.total} items
            </span>
          ) : null}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="flex flex-col gap-6">
                {[0, 1].map((cardIndex) => {
                  const isTall = (colIndex + cardIndex) % 2 === 0;
                  return (
                    <div
                      key={cardIndex}
                      className={`relative rounded-sm overflow-hidden border border-white/5 bg-white/[0.03] animate-pulse ${
                        isTall ? "aspect-[3/4]" : "aspect-[3/2]"
                      }`}
                    >
                      <div className="absolute top-4 left-4 w-16 h-6 rounded-sm bg-white/10" />
                      <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <div className="h-5 w-3/4 bg-white/10 rounded-sm" />
                        <div className="h-3 w-1/2 bg-white/5 rounded-sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="py-16 px-6 text-center rounded-lg border border-red-500/20 bg-red-500/5 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-white mb-2">Failed to load media</h3>
            <p className="text-sm text-white/50 mb-6">
              An error occurred while retrieving gallery items.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-sm text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && mediaItems.length === 0 && (
          <div className="py-16 text-center border border-white/5 rounded-sm bg-white/[0.02]">
            <p className="text-white/40 text-sm font-serif">No media items available at this time.</p>
          </div>
        )}

        {/* Staggered Grid with Dynamic Data */}
        {!isLoading && !isError && mediaItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              {col1.map((item, i) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  i={i}
                  aspectClass={i % 2 === 0 ? "aspect-[3/4]" : "aspect-[3/2]"}
                  onClick={() =>
                    setSelectedMedia({
                      type: item.type?.toUpperCase() === "VIDEO" ? "video" : "image",
                      src: item.mediaUrl,
                      title: item.title,
                    })
                  }
                />
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              {col2.map((item, i) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  i={i}
                  aspectClass={i % 2 === 1 ? "aspect-[3/4]" : "aspect-[3/2]"}
                  onClick={() =>
                    setSelectedMedia({
                      type: item.type?.toUpperCase() === "VIDEO" ? "video" : "image",
                      src: item.mediaUrl,
                      title: item.title,
                    })
                  }
                />
              ))}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              {col3.map((item, i) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  i={i}
                  aspectClass={i % 2 === 0 ? "aspect-[3/4]" : "aspect-[3/2]"}
                  onClick={() =>
                    setSelectedMedia({
                      type: item.type?.toUpperCase() === "VIDEO" ? "video" : "image",
                      src: item.mediaUrl,
                      title: item.title,
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        media={selectedMedia}
      />
    </section>
  );
}

function MediaCard({
  item,
  i,
  aspectClass,
  onClick,
}: {
  item: LandingMediaItem;
  i: number;
  aspectClass: string;
  onClick: () => void;
}) {
  const isVideo = item.type?.toUpperCase() === "VIDEO";
  const displayImage = item.thumbnailUrl || item.mediaUrl;
  const badgeText = item.badgeText || item.category || "PAST";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      onClick={onClick}
      className={`relative rounded-sm overflow-hidden group cursor-pointer border border-white/5 ${aspectClass}`}
    >
      <img
        src={displayImage}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        alt={item.title || "Media item"}
      />

      {/* Badge Tag */}
      {badgeText && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
            {badgeText}
          </span>
        </div>
      )}

      {/* Video Play Icon */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-all duration-300">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </div>
      )}

      {/* Hover Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
        <div className="space-y-2">
          <h3 className="text-lg font-serif text-white">{item.title}</h3>
          {item.caption && (
            <p className="text-white/50 text-[10px] italic leading-relaxed line-clamp-2">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
