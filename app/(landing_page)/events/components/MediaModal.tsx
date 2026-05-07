"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: {
    type: "image" | "video";
    src: string;
    title?: string;
  } | null;
}

export default function MediaModal({ isOpen, onClose, media }: MediaModalProps) {
  if (!media) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-zoom-out"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)] bg-[#050505] border border-white/5"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media Rendering */}
            <div 
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {media.type === "video" ? (
                <video
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source src={media.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={media.src}
                  className="w-full h-full object-contain"
                  alt={media.title || "Gallery Item"}
                />
              )}
            </div>

            {/* Optional Caption */}
            {media.title && (
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-xl md:text-2xl font-serif text-white">{media.title}</h3>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
