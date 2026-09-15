import React, { useRef } from "react";
import Image from "next/image";
import { Globe, UploadCloud, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { MediaUploadSectionProps } from "./types";

export function MediaUploadSection({
  mediaUrl,
  mediaType,
  mediaInputMode,
  setMediaInputMode,
  isDraggingMedia,
  setIsDraggingMedia,
  isUploading,
  onMediaUrlChange,
  onUploadFile,
  onRemoveMedia,
}: MediaUploadSectionProps) {
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOverMedia = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMedia(true);
  };

  const handleDragLeaveMedia = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMedia(false);
  };

  const handleDropMedia = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMedia(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-primary" /> Media File / URL{" "}
          <span className="text-primary">*</span>
        </label>

        <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#262626] p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setMediaInputMode("upload")}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              mediaInputMode === "upload"
                ? "bg-primary text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMediaInputMode("url")}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
              mediaInputMode === "url" ? "bg-primary text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mediaInputMode === "upload" ? (
        <div className="space-y-3">
          {mediaUrl ? (
            <div className="relative group rounded-xl border border-primary/30 overflow-hidden bg-[#0E0E10] p-3 flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#262626] shrink-0 bg-[#1A1A1A] flex items-center justify-center">
                {mediaType === "VIDEO" ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    controls={false}
                    muted
                  />
                ) : (
                  <Image
                    src={mediaUrl}
                    alt="Media Preview"
                    width={96}
                    height={96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Uploaded to Media Server
                </div>
                <p className="text-[11px] text-gray-400 truncate max-w-full font-mono">
                  {mediaUrl}
                </p>
              </div>
              <button
                type="button"
                onClick={onRemoveMedia}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer mr-1 shrink-0"
                title="Remove media file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOverMedia}
              onDragLeave={handleDragLeaveMedia}
              onDrop={handleDropMedia}
              onClick={() => mediaFileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDraggingMedia
                  ? "border-primary bg-primary/10"
                  : "border-[#262626] hover:border-primary/50 bg-[#0E0E10] hover:bg-[#121215]"
              }`}
            >
              <input
                ref={mediaFileInputRef}
                type="file"
                accept={mediaType === "VIDEO" ? "video/*,image/*" : "image/*,video/*"}
                onChange={handleMediaFileChange}
                className="hidden"
              />

              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-3 space-y-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-medium text-primary">Uploading media asset...</p>
                  <p className="text-[10px] text-gray-500">
                    Please wait while the file is processed
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Click to upload or drag & drop media asset
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Images (PNG, JPG, WEBP) or Videos (MP4, MOV, WEBM)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            name="mediaUrl"
            value={mediaUrl}
            onChange={(e) => onMediaUrlChange(e.target.value)}
            placeholder="https://res.cloudinary.com/demo/image/upload/sample.jpg"
            className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors font-mono text-xs"
          />
          {mediaUrl && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#262626] bg-[#0E0E10] flex items-center justify-center">
              {mediaType === "VIDEO" ? (
                <video src={mediaUrl} className="w-full h-full object-contain" controls />
              ) : (
                <Image
                  src={mediaUrl}
                  alt="URL Preview"
                  width={144}
                  height={144}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MediaUploadSection;
