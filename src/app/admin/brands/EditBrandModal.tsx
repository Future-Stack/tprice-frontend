"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Globe,
  FolderTree,
} from "lucide-react";
import { useUpdateBrandMutation } from "@/hooks/useBrands";
import { useGetCategoryQuery } from "@/hooks/useCategories";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { Brand } from "@/lib/api/brands";
import { toast } from "sonner";

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
}

export default function EditBrandModal({
  isOpen,
  onClose,
  brand,
}: EditBrandModalProps) {
  const updateBrandMutation = useUpdateBrandMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoryQuery();
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data || [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    logoUrl: "",
    categoryId: "",
  });

  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        websiteUrl: brand.websiteUrl || "",
        logoUrl: brand.logoUrl || "",
        categoryId: brand.categoryId || brand.category?.id || "",
      });
    }
  }, [brand]);

  if (!isOpen || !brand) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        folder: "exoticworld/brands",
      });

      if (res?.url) {
        setFormData((prev) => ({ ...prev, logoUrl: res.url }));
        toast.success("Brand logo uploaded successfully!");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to upload logo";
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

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Brand name is required.");
      return;
    }

    if (uploadMediaMutation.isPending) {
      toast.error("Please wait until logo upload finishes.");
      return;
    }

    try {
      await updateBrandMutation.mutateAsync({
        id: brand.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          websiteUrl: formData.websiteUrl.trim() || undefined,
          logoUrl: formData.logoUrl.trim() || undefined,
          categoryId: formData.categoryId ? formData.categoryId : null,
        },
      });

      toast.success("Brand updated successfully!");
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to update brand";
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
              <h2 className="text-xl font-bold text-white font-clash">Edit Brand</h2>
              <p className="text-xs text-gray-400">Update details for {brand.name}</p>
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
          {/* Brand Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> Brand Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Bugatti"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              required
            />
          </div>

          {/* Category Dropdown & Website URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-primary" /> Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isCategoriesLoading}
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer disabled:opacity-50"
              >
                <option value="">No Category (Uncategorized)</option>
                {isCategoriesLoading ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" /> Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://www.bugatti.com"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
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
              placeholder="Pinnacle of hypercar performance"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {/* Logo Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" /> Brand Logo
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
                {formData.logoUrl ? (
                  <div className="relative group rounded-xl border border-primary/30 overflow-hidden bg-[#0E0E10] p-2 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#262626] shrink-0 bg-[#1A1A1A] flex items-center justify-center p-1">
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded & Saved
                      </div>
                      <p className="text-[11px] text-gray-400 truncate max-w-full font-mono">
                        {formData.logoUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer mr-2 shrink-0"
                      title="Remove logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
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
                        <p className="text-xs font-medium text-primary">Uploading logo...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Click to upload or drag & drop brand logo
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            PNG, JPG, SVG, WEBP (Max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://cdn.exoticworld.com/brands/ferrari-logo.png"
                  className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
                />
                {formData.logoUrl && (
                  <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden border border-[#262626] bg-[#0E0E10] flex items-center justify-center p-2">
                    <img
                      src={formData.logoUrl}
                      alt="URL Preview"
                      className="max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                      }}
                    />
                  </div>
                )}
              </div>
            )}
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
              disabled={updateBrandMutation.isPending || uploadMediaMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateBrandMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Updating...
                </>
              ) : uploadMediaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Uploading Logo...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
