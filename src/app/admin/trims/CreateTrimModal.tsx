"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Layers,
  Car,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCreateTrimMutation } from "@/hooks/useTrims";
import { useGetModelsQuery } from "@/hooks/useModels";
import { toast } from "sonner";

interface CreateTrimModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModelId?: string;
}

export default function CreateTrimModal({
  isOpen,
  onClose,
  defaultModelId = "",
}: CreateTrimModalProps) {
  const createTrimMutation = useCreateTrimMutation();

  const [formData, setFormData] = useState({
    name: "",
    modelId: defaultModelId,
    yearStart: "" as string | number,
    yearEnd: "" as string | number,
  });

  // Fetch all models for the selector
  const { data: modelsResponse, isLoading: isModelsLoading } = useGetModelsQuery({
    limit: 100,
  });
  const models = modelsResponse?.data || [];

  useEffect(() => {
    if (defaultModelId && !formData.modelId) {
      setFormData((prev) => ({ ...prev, modelId: defaultModelId }));
    }
  }, [defaultModelId, formData.modelId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !createTrimMutation.isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, createTrimMutation.isPending, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Trim name is required.");
      return;
    }

    if (!formData.modelId) {
      toast.error("Please select a vehicle model.");
      return;
    }

    const yStart =
      formData.yearStart !== "" && !isNaN(Number(formData.yearStart))
        ? Number(formData.yearStart)
        : null;
    const yEnd =
      formData.yearEnd !== "" && !isNaN(Number(formData.yearEnd))
        ? Number(formData.yearEnd)
        : null;

    if (yStart && yEnd && yStart > yEnd) {
      toast.error("Start year cannot be greater than end year.");
      return;
    }

    try {
      await createTrimMutation.mutateAsync({
        name: formData.name.trim(),
        modelId: formData.modelId,
        yearStart: yStart,
        yearEnd: yEnd,
      });

      toast.success(`Trim "${formData.name.trim()}" created successfully!`);
      setFormData({
        name: "",
        modelId: defaultModelId || "",
        yearStart: "",
        yearEnd: "",
      });
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to create trim";
      toast.error(errMsg);
    }
  };

  const selectedModel = models.find((m) => m.id === formData.modelId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={() => {
        if (!createTrimMutation.isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#18181A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-clash">
                Create Trim
              </h2>
              <p className="text-xs text-gray-400">
                Add a new trim level or package to a vehicle model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={createTrimMutation.isPending}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Trim Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Trim Name{" "}
              <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. GT3 RS, Weissach Package, Turbo S"
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-primary" /> Vehicle Model{" "}
              <span className="text-primary">*</span>
            </label>
            <select
              name="modelId"
              value={formData.modelId}
              onChange={handleChange}
              disabled={isModelsLoading}
              className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer disabled:opacity-50"
              required
            >
              <option value="">-- Select Model --</option>
              {isModelsLoading ? (
                <option disabled>Loading models...</option>
              ) : models.length === 0 ? (
                <option disabled>No models available</option>
              ) : (
                models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.brand ? `(${m.brand.name})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Selected Model Preview Card (if chosen) */}
          {selectedModel && (
            <div className="p-3 bg-[#18181A] border border-primary/20 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  <Car className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">
                    {selectedModel.name}
                  </span>
                  {selectedModel.brand && (
                    <span className="text-gray-400 ml-1.5 font-normal">
                      Brand: {selectedModel.brand.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Selected
              </div>
            </div>
          )}

          {/* Year Range (Start & End) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> Start Year
              </label>
              <input
                type="number"
                name="yearStart"
                value={formData.yearStart}
                onChange={handleChange}
                placeholder="e.g. 2022"
                min="1900"
                max="2100"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> End Year
              </label>
              <input
                type="number"
                name="yearEnd"
                value={formData.yearEnd}
                onChange={handleChange}
                placeholder="e.g. 2025 (or current)"
                min="1900"
                max="2100"
                className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              disabled={createTrimMutation.isPending}
              className="px-5 py-2.5 rounded-xl border border-[#262626] text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTrimMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all shadow-[0_4px_20px_rgba(231,143,35,0.3)] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createTrimMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  Creating Trim...
                </>
              ) : (
                "Create Trim"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
