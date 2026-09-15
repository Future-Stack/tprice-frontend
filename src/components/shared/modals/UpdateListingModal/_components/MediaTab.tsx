"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SortableMediaGallery from "@/components/SortableMediaGallery";
import { MediaTabProps } from "./types";

export default function MediaTab({
  mediaList,
  setMediaList,
  isUploading,
  onFilesUpload,
}: MediaTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [directImageUrl, setDirectImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUpload(files);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleAddDirectUrl = () => {
    const trimmed = directImageUrl.trim();
    if (!trimmed) {
      toast.error("Please enter a valid image URL.");
      return;
    }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast.error("Image URL must start with http:// or https://");
      return;
    }

    setMediaList((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}-${prev.length}`,
        url: trimmed,
        type: "IMAGE",
        displayOrder: prev.length + 1,
        isCover: prev.length === 0,
      },
    ]);
    setDirectImageUrl("");
    toast.success("Image URL added to gallery!");
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      const itemToRemove = prev[index];
      const updated = prev.filter((_, i) => i !== index);
      if (itemToRemove?.isCover && updated.length > 0) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };

  const handleSetCoverMedia = (index: number) => {
    setMediaList((prev) =>
      prev.map((item, i) => ({
        ...item,
        isCover: i === index,
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* File Upload Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = Array.from(e.dataTransfer.files || []);
          if (files.length > 0) {
            onFilesUpload(files);
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
          isDragging
            ? "border-[#EAB308] bg-[#EAB308]/5"
            : "border-[#333333] bg-[#111111] hover:border-[#555]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-[#EAB308] text-sm py-2 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Uploading images to cloud media service...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-[#EAB308] mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-200">
              Drag and drop listing images here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#EAB308] underline cursor-pointer hover:text-yellow-400"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPG, PNG, WEBP files up to 10MB each
            </p>
          </>
        )}
      </div>

      {/* Direct Image URL Add */}
      <div className="flex gap-2">
        <input
          type="url"
          value={directImageUrl}
          onChange={(e) => setDirectImageUrl(e.target.value)}
          placeholder="Or enter direct image URL (https://...)"
          className="flex-1 bg-[#111111] border border-[#333333] rounded-xl px-4 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-[#EAB308]"
        />
        <button
          type="button"
          onClick={handleAddDirectUrl}
          className="px-4 py-2.5 bg-[#EAB308] hover:bg-[#D9A506] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          Add URL
        </button>
      </div>

      {/* Media Items List */}
      {mediaList.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500 border border-[#2A2A2A] rounded-xl bg-[#111111]">
          No images attached yet.
        </div>
      ) : (
        <SortableMediaGallery
          mediaList={mediaList}
          setMediaList={setMediaList}
          onRemove={handleRemoveMedia}
          onSetCover={handleSetCoverMedia}
        />
      )}
    </div>
  );
}
