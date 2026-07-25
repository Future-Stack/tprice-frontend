"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Tag,
  FileText,
  Sparkles,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Hash,
  Activity,
} from "lucide-react";
import { useCreateCategoryMutation } from "@/hooks/useCategories";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { toast } from "sonner";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextDisplayOrder?: number;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  nextDisplayOrder = 1,
}: CreateCategoryModalProps) {
  const createCategoryMutation = useCreateCategoryMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    displayOrder: nextDisplayOrder,
    isActive: true,
  });

  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);

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
      setFormData((prev) => ({ ...prev, displayOrder: parseInt(value, 10) || 1 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB");
      return;
    }

    try {
      const res = await uploadMediaMutation.mutateAsync({
        file,
        folder: "exoticworld/categories",
      });

      if (res?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }));
        toast.success("Category image uploaded successfully!");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to upload image";
      toast.error(errMsg);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (uploadMediaMutation.isPending) {
      toast.error("Please wait until image upload finishes.");
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        displayOrder: Number(formData.displayOrder) || 1,
        isActive: formData.isActive,
      });

      toast.success("Category created successfully!");
      // Reset form
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        displayOrder: nextDisplayOrder + 1,
        isActive: true,
      });
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to create category";
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
              <h2 className="text-xl font-bold text-white font-clash">Create Category</h2>
              <p className="text-xs text-gray-400">Add a new category to organize luxury items</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Supercars"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Exotic high-performance supercars and hypercars"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none"
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
              min={1}
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" /> Category Image
              </label>

              <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#262626] p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setInputMode("upload")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    inputMode === "upload"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("url")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    inputMode === "url"
                      ? "bg-primary text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {inputMode === "upload" ? (
              <div className="space-y-3">
                {formData.imageUrl ? (
                  /* Preview uploaded image */
                  <div className="relative group rounded-xl border border-primary/30 overflow-hidden bg-[#0E0E10] p-2 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#262626] shrink-0 bg-[#1A1A1A]">
                      <img
                        src={formData.imageUrl}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1583121274602-3e2820c69888";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded & Saved
                      </div>
                      <p className="text-[11px] text-gray-400 truncate max-w-full font-mono">
                        {formData.imageUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer mr-2 shrink-0"
                      title="Remove category image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Dropzone area */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-[#262626] hover:border-primary/50 bg-[#0E0E10] hover:bg-[#121215]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadMediaMutation.isPending ? (
                      <div className="flex flex-col items-center justify-center py-3 space-y-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-xs font-medium text-primary">Uploading image to cloud...</p>
                        <p className="text-[10px] text-gray-500">Please wait a moment</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Click to upload or drag & drop category image
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            PNG, JPG, WEBP or GIF (Max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* URL Input Mode */
              <div className="relative">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
                />
                {formData.imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-[#262626] bg-[#0E0E10]">
                    <img
                      src={formData.imageUrl}
                      alt="URL Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1583121274602-3e2820c69888";
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 bg-[#0E0E10] border border-[#262626] p-4 rounded-xl">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#262626] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-gray-200 cursor-pointer flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" /> Mark Category as Active
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
              disabled={createCategoryMutation.isPending || uploadMediaMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createCategoryMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Creating...
                </>
              ) : uploadMediaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
