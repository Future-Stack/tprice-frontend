"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Sparkles,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Film,
  Tag,
  FileText,
  BadgeAlert,
  Hash,
  Activity,
  Globe,
} from "lucide-react";
import { useUploadMediaMutation, useCreateLandingMediaMutation } from "@/hooks/useMedia";
import { toast } from "sonner";

interface CreateMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS = [
  { label: "Aviation", value: "AVIATION" },
  { label: "Yacht", value: "YACHT" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Watches", value: "WATCH" },
];

export default function CreateMediaModal({ isOpen, onClose }: CreateMediaModalProps) {
  const createMediaMutation = useCreateLandingMediaMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "AVIATION",
    type: "IMAGE",
    mediaUrl: "",
    thumbnailUrl: "",
    caption: "",
    badgeText: "",
    displayOrder: 0,
    isPublished: true,
  });

  const [mediaInputMode, setMediaInputMode] = useState<"upload" | "url">("upload");
  const [thumbInputMode, setThumbInputMode] = useState<"upload" | "url">("upload");
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "displayOrder") {
      setFormData((prev) => ({ ...prev, displayOrder: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaFileUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size should be less than 50MB");
      return;
    }

    const isVideoFile = file.type.startsWith("video/");
    const isImageFile = file.type.startsWith("image/");

    if (!isVideoFile && !isImageFile) {
      toast.error("Please upload a valid image or video file.");
      return;
    }

    try {
      const res = await uploadMediaMutation.mutateAsync({
        file,
        folder: "exoticworld/landing-media",
      });

      if (res?.url) {
        setFormData((prev) => ({
          ...prev,
          mediaUrl: res.url,
          // Auto update type based on file type if needed
          type: isVideoFile ? "VIDEO" : "IMAGE",
          // If image and no thumbnail set yet, use mediaUrl as thumbnail
          thumbnailUrl: isImageFile && !prev.thumbnailUrl ? res.url : prev.thumbnailUrl,
        }));
        toast.success("Media file uploaded successfully!");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to upload media file";
      toast.error(errMsg);
    }
  };

  const handleThumbFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Thumbnail must be an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Thumbnail file size should be less than 10MB");
      return;
    }

    try {
      setIsUploadingThumb(true);
      const res = await uploadMediaMutation.mutateAsync({
        file,
        folder: "exoticworld/landing-media/thumbnails",
      });

      if (res?.url) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: res.url }));
        toast.success("Thumbnail uploaded successfully!");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to upload thumbnail";
      toast.error(errMsg);
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaFileUpload(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleThumbFileUpload(file);
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
      handleMediaFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!formData.mediaUrl.trim()) {
      toast.error("Media URL or uploaded file is required.");
      return;
    }

    if (uploadMediaMutation.isPending || isUploadingThumb) {
      toast.error("Please wait until media upload completes.");
      return;
    }

    try {
      await createMediaMutation.mutateAsync({
        title: formData.title.trim(),
        category: formData.category,
        type: formData.type,
        mediaUrl: formData.mediaUrl.trim(),
        thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
        caption: formData.caption.trim() || undefined,
        badgeText: formData.badgeText.trim() || undefined,
        displayOrder: Number(formData.displayOrder) || 0,
        isPublished: formData.isPublished,
      });

      toast.success("Landing media created successfully!");
      // Reset state
      setFormData({
        title: "",
        category: "AVIATION",
        type: "IMAGE",
        mediaUrl: "",
        thumbnailUrl: "",
        caption: "",
        badgeText: "",
        displayOrder: 0,
        isPublished: true,
      });
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to create landing media";
      toast.error(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#18181A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-clash">
                Create Landing Media
              </h2>
              <p className="text-xs text-gray-400">
                Add a new banner or promotional media item to the landing page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. EBACE Private Aviation Summit"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              required
            />
          </div>

          {/* Category & Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-[#18181A]">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                {formData.type === "VIDEO" ? (
                  <Film className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                )}{" "}
                Media Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                <option value="IMAGE" className="bg-[#18181A]">IMAGE</option>
                <option value="VIDEO" className="bg-[#18181A]">VIDEO</option>
              </select>
            </div>
          </div>

          {/* Primary Media File / URL Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" /> Media File / URL <span className="text-primary">*</span>
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
                    mediaInputMode === "url"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {mediaInputMode === "upload" ? (
              <div className="space-y-3">
                {formData.mediaUrl ? (
                  /* Preview uploaded media */
                  <div className="relative group rounded-xl border border-primary/30 overflow-hidden bg-[#0E0E10] p-3 flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#262626] shrink-0 bg-[#1A1A1A] flex items-center justify-center">
                      {formData.type === "VIDEO" ? (
                        <video
                          src={formData.mediaUrl}
                          className="w-full h-full object-cover"
                          controls={false}
                          muted
                        />
                      ) : (
                        <img
                          src={formData.mediaUrl}
                          alt="Media Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://res.cloudinary.com/demo/image/upload/sample.jpg";
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded to Media Server
                      </div>
                      <p className="text-[11px] text-gray-400 truncate max-w-full font-mono">
                        {formData.mediaUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, mediaUrl: "" }))}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer mr-1 shrink-0"
                      title="Remove media file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Dropzone area */
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
                      accept={formData.type === "VIDEO" ? "video/*,image/*" : "image/*,video/*"}
                      onChange={handleMediaFileChange}
                      className="hidden"
                    />

                    {uploadMediaMutation.isPending ? (
                      <div className="flex flex-col items-center justify-center py-3 space-y-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-xs font-medium text-primary">Uploading media asset...</p>
                        <p className="text-[10px] text-gray-500">Please wait while the file is processed</p>
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
              /* URL Input Mode */
              <div className="space-y-2">
                <input
                  type="url"
                  name="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/demo/image/upload/sample.jpg"
                  className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors font-mono text-xs"
                />
                {formData.mediaUrl && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#262626] bg-[#0E0E10] flex items-center justify-center">
                    {formData.type === "VIDEO" ? (
                      <video
                        src={formData.mediaUrl}
                        className="w-full h-full object-contain"
                        controls
                      />
                    ) : (
                      <img
                        src={formData.mediaUrl}
                        alt="URL Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://res.cloudinary.com/demo/image/upload/sample.jpg";
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Thumbnail URL Section (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Thumbnail URL (Optional)
              </label>

              <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#262626] p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setThumbInputMode("upload")}
                  className={`px-2 py-0.5 rounded-md transition-colors font-medium cursor-pointer ${
                    thumbInputMode === "upload"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setThumbInputMode("url")}
                  className={`px-2 py-0.5 rounded-md transition-colors font-medium cursor-pointer ${
                    thumbInputMode === "url"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {thumbInputMode === "upload" ? (
              <div className="flex items-center gap-3">
                <input
                  ref={thumbFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => thumbFileInputRef.current?.click()}
                  disabled={isUploadingThumb}
                  className="px-4 py-2.5 rounded-xl border border-[#262626] bg-[#0E0E10] hover:bg-[#18181A] text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploadingThumb ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-primary" />
                  )}
                  <span>Upload Thumbnail</span>
                </button>
                {formData.thumbnailUrl && (
                  <span className="text-xs text-emerald-400 truncate max-w-xs font-mono">
                    {formData.thumbnailUrl}
                  </span>
                )}
              </div>
            ) : (
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/demo/image/upload/thumb.jpg"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors font-mono text-xs"
              />
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Caption / Subtitle
            </label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. 3rd April, 2026, 9pm • 1901 Thornridge Cir. Shiloh, Hawaii 81063"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {/* Badge Text & Display Order Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Badge Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BadgeAlert className="w-3.5 h-3.5 text-primary" /> Badge Text
              </label>
              <input
                type="text"
                name="badgeText"
                value={formData.badgeText}
                onChange={handleChange}
                placeholder="e.g. PAST, NEW, FEATURED"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-primary" /> Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                min={0}
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-3 bg-[#0E0E10] border border-[#262626] p-4 rounded-xl">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#262626] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs font-semibold text-gray-200 cursor-pointer flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Publish Immediately
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#262626] text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMediaMutation.isPending || uploadMediaMutation.isPending || isUploadingThumb}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createMediaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Creating...
                </>
              ) : uploadMediaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Uploading Asset...
                </>
              ) : (
                "Create Media"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
