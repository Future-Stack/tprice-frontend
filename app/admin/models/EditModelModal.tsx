"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Car,
  Award,
  Pencil,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useUpdateModelMutation } from "@/hooks/useModels";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { ModelItem } from "@/lib/api/models";
import { toast } from "sonner";

interface EditModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelItem | null;
}

export default function EditModelModal({
  isOpen,
  onClose,
  model,
}: EditModelModalProps) {
  const updateModelMutation = useUpdateModelMutation();

  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
  });

  const { data: brandsResponse, isLoading: isBrandsLoading } = useGetBrandsQuery({
    limit: 100,
  });
  const brands = brandsResponse?.data || [];

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name || "",
        brandId: model.brandId || model.brand?.id || "",
      });
    }
  }, [model]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !updateModelMutation.isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, updateModelMutation.isPending, onClose]);

  if (!isOpen || !model) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Model name is required.");
      return;
    }

    try {
      // Send PATCH /models/:id with updated fields
      await updateModelMutation.mutateAsync({
        id: model.id,
        data: {
          name: formData.name.trim(),
          brandId: formData.brandId || undefined,
        },
      });

      toast.success(`Model "${formData.name.trim()}" updated successfully!`);
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to update model";
      toast.error(errMsg);
    }
  };

  const selectedBrand = brands.find((b) => b.id === formData.brandId) || model.brand;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={() => {
        if (!updateModelMutation.isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#18181A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-clash">
                Edit Model
              </h2>
              <p className="text-xs text-gray-400">
                Update model name and attributes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={updateModelMutation.isPending}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Model Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-primary" /> Model Name{" "}
              <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. 911 Carrera"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Brand Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" /> Brand
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              disabled={isBrandsLoading}
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer disabled:opacity-50"
            >
              <option value="">-- Select Brand --</option>
              {isBrandsLoading ? (
                <option disabled>Loading brands...</option>
              ) : brands.length === 0 ? (
                <option disabled>No brands available</option>
              ) : (
                brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.category ? `(${b.category.name})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Selected Brand Preview Card (if chosen) */}
          {selectedBrand && (
            <div className="p-3 bg-[#18181A] border border-primary/20 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#111] border border-[#262626] flex items-center justify-center p-1 overflow-hidden shrink-0">
                  {selectedBrand.logoUrl ? (
                    <img
                      src={selectedBrand.logoUrl}
                      alt={selectedBrand.name}
                      className="max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                      }}
                    />
                  ) : (
                    <span className="text-primary font-bold text-[10px]">
                      {selectedBrand.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-white">
                    {selectedBrand.name}
                  </span>
                  {selectedBrand.category && (
                    <span className="text-gray-400 ml-1.5 font-normal">
                      ({selectedBrand.category.name})
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Current Brand
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              disabled={updateModelMutation.isPending}
              className="px-5 py-2.5 rounded-xl border border-[#262626] text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateModelMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateModelMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Updating Model...
                </>
              ) : (
                "Update Model"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
