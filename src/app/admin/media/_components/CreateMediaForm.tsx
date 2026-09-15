import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadMediaMutation, useCreateLandingMediaMutation } from "@/hooks/useMedia";
import { MediaMetadataFields } from "./MediaMetadataFields";
import { MediaUploadSection } from "./MediaUploadSection";
import { ThumbnailUploadSection } from "./ThumbnailUploadSection";
import { CreateMediaFormProps, CreateMediaFormData, INITIAL_MEDIA_FORM_DATA } from "./types";

export function CreateMediaForm({ onClose }: CreateMediaFormProps) {
  const createMediaMutation = useCreateLandingMediaMutation();
  const uploadMediaMutation = useUploadMediaMutation();

  const [formData, setFormData] = useState<CreateMediaFormData>(INITIAL_MEDIA_FORM_DATA);
  const [mediaInputMode, setMediaInputMode] = useState<"upload" | "url">("upload");
  const [thumbInputMode, setThumbInputMode] = useState<"upload" | "url">("upload");
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
          type: isVideoFile ? "VIDEO" : "IMAGE",
          thumbnailUrl: isImageFile && !prev.thumbnailUrl ? res.url : prev.thumbnailUrl,
        }));
        toast.success("Media file uploaded successfully!");
      }
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to upload media file";
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
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to upload thumbnail";
      toast.error(errMsg);
    } finally {
      setIsUploadingThumb(false);
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
      onClose();
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to create landing media";
      toast.error(errMsg);
    }
  };

  const isSubmitting =
    createMediaMutation.isPending || uploadMediaMutation.isPending || isUploadingThumb;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar"
    >
      <MediaMetadataFields formData={formData} onChange={handleChange} />

      <MediaUploadSection
        mediaUrl={formData.mediaUrl}
        mediaType={formData.type}
        mediaInputMode={mediaInputMode}
        setMediaInputMode={setMediaInputMode}
        isDraggingMedia={isDraggingMedia}
        setIsDraggingMedia={setIsDraggingMedia}
        isUploading={uploadMediaMutation.isPending}
        onMediaUrlChange={(url) => setFormData((prev) => ({ ...prev, mediaUrl: url }))}
        onUploadFile={handleMediaFileUpload}
        onRemoveMedia={() => setFormData((prev) => ({ ...prev, mediaUrl: "" }))}
      />

      <ThumbnailUploadSection
        thumbnailUrl={formData.thumbnailUrl}
        thumbInputMode={thumbInputMode}
        setThumbInputMode={setThumbInputMode}
        isUploadingThumb={isUploadingThumb}
        onThumbnailUrlChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
        onUploadFile={handleThumbFileUpload}
      />

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
          disabled={isSubmitting}
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
  );
}

export default CreateMediaForm;
