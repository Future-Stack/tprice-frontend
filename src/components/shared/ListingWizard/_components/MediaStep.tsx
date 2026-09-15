import React, { useRef, useState } from "react";
import { Image as ImageIcon, UploadCloud, Loader2, GripVertical } from "lucide-react";
import SortableMediaGallery from "@/components/SortableMediaGallery";
import type { MediaStepProps } from "./types";

export function MediaStep({
  mediaList,
  setMediaList,
  onFilesUpload,
  isUploading,
  onRemoveMedia,
  onSetCover,
}: MediaStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (files.length > 0) {
      onFilesUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUpload(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xl font-clash font-medium text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" /> Media Gallery
        </h3>
        {mediaList.length > 0 && (
          <span className="text-xs text-gray-400">
            Drag photos to reorder • Choose any photo as cover
          </span>
        )}
      </div>

      {/* Dropzone & Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl aspect-16/6 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.005]"
            : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-primary/50 hover:bg-[#252528]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-primary">
              Uploading image to cloud media service...
            </p>
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-[#111113] border border-[#2C2C2E] rounded-full flex items-center justify-center text-primary shadow-md">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white font-medium text-base">
                Click to browse or drag & drop high-resolution images
              </p>
              <p className="text-gray-500 text-xs mt-1">Supports JPG, PNG, WEBP (Max 10MB each)</p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Preview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Uploaded Media ({mediaList.length})
          </label>
          {mediaList.length > 0 && (
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <GripVertical className="w-3.5 h-3.5 text-primary" /> Drag & drop photos to reorder
            </span>
          )}
        </div>

        {mediaList.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No images uploaded yet.</p>
        ) : (
          <SortableMediaGallery
            mediaList={mediaList}
            setMediaList={setMediaList}
            onRemove={onRemoveMedia}
            onSetCover={onSetCover}
          />
        )}
      </div>
    </div>
  );
}
