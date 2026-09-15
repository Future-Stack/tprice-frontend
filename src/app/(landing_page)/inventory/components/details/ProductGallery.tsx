"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaItem } from "../../data";

interface ProductGalleryProps {
  media: MediaItem[];
}

export default function ProductGallery({ media }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = media?.[currentIndex];

  const handleNext = () => {
    if (!media || media.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % media.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    if (!media || media.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    setIsPlaying(false);
  };

  const togglePlay = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        // Ignore AbortError as it's common when switching slides quickly with AnimatePresence
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Video playback failed:", error);
        }
        setIsPlaying(false);
      }
    }
  };

  // Reset play state and handle cleanup when changing media
  useEffect(() => {
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.load();
    }
    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [currentIndex]);

  if (!media || media.length === 0 || !currentMedia) {
    return (
      <div className="flex items-center justify-center h-125 md:h-175 w-full bg-neutral-900 border border-white/5 rounded-sm">
        <p className="text-white/40 font-medium font-serif">No media available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Media Container - Full Width */}
      <div className="relative h-125 md:h-187.5 w-full group overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {currentMedia.type === "video" ? (
              <video
                key={currentMedia.url}
                ref={videoRef}
                src={currentMedia.url}
                className="w-full h-full object-cover"
                loop
                muted={true}
                playsInline
                onClick={() => togglePlay()}
                preload="auto"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentMedia.url}
                className="w-full h-full object-cover"
                alt="Product"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-black hover:bg-[#B8962E] transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Play/Pause Overlay - Only for Video */}
        {currentMedia.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => togglePlay(e)}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl pointer-events-auto cursor-pointer transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-black fill-current" />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                  <Play className="w-8 h-8 text-black fill-current ml-1" />
                </div>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="container mx-auto px-6 flex justify-center gap-4 overflow-x-auto pb-6 -mt-25 relative z-30 scrollbar-hide">
        {media.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative min-w-30 md:min-w-40 h-20 md:h-28 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${currentIndex === idx ? "border-[#D4AF37] scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
          >
            <img
              src={item.thumbnail || item.url}
              className="w-full h-full object-cover"
              alt={`Thumb ${idx}`}
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

