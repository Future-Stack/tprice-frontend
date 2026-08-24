"use client";

import React, { useEffect } from "react";
import {
  X,
  Car,
  Award,
  FolderTree,
  Globe,
  Calendar,
  Layers,
  ExternalLink,
  Copy,
  Check,
  Hash,
} from "lucide-react";
import { ModelItem } from "@/lib/api/models";
import Image from "next/image";
import { toast } from "sonner";

interface ModelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelItem | null;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export default function ModelDetailModal({
  isOpen,
  onClose,
  model,
}: ModelDetailModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !model) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const brand = model.brand;
  const trimsCount = model._count?.trims ?? model.trims?.length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#141416] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#18181A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-clash">
                {model.name}
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Slug: /{model.slug}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Model Name & ID Card */}
            <div className="p-4 bg-[#18181A] border border-[#262626] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-primary" /> Model Name
              </span>
              <p className="text-base font-bold text-white">{model.name}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#262626]/80 text-xs text-gray-400 font-mono">
                <span className="truncate max-w-[180px]">ID: {model.id}</span>
                <button
                  onClick={() => copyToClipboard(model.id, "Model ID")}
                  className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  title="Copy ID"
                >
                  {copiedField === "Model ID" ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Trims Count Card */}
            <div className="p-4 bg-[#18181A] border border-[#262626] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-primary" /> Total Trims
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary font-clash">
                  {trimsCount}
                </span>
                <span className="text-xs text-gray-400">
                  {trimsCount === 1 ? "trim level registered" : "trim levels registered"}
                </span>
              </div>
              <div className="pt-2 border-t border-[#262626]/80 text-xs text-gray-500">
                Vehicle trim variants
              </div>
            </div>
          </div>

          {/* Brand Information Section */}
          <div className="p-5 bg-[#18181A] border border-[#262626] rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4" /> Associated Brand Information
            </h3>

            {brand ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Brand Logo */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#262626] bg-[#101012] shrink-0 p-1.5 flex items-center justify-center">
                    {brand.logoUrl ? (
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        width={120}
                        height={80}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://cdn.exoticworld.com/brands/ferrari-logo.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg font-clash">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-white">
                        {brand.name}
                      </h4>
                      {brand.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          <FolderTree className="w-3 h-3" />
                          {brand.category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      Brand Slug: /{brand.slug}
                    </p>
                    {brand.description && (
                      <p className="text-xs text-gray-300 italic pt-1">
                        &quot;{brand.description}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Brand Website */}
                {brand.websiteUrl && (
                  <div className="flex items-center gap-2 text-xs pt-3 border-t border-[#262626]">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Official Website:</span>
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 truncate max-w-sm"
                    >
                      {brand.websiteUrl}
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                No brand information attached.
              </p>
            )}
          </div>

          {/* Timestamps Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#18181A] border border-[#262626] rounded-xl flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-500 block text-[11px]">
                  Created At
                </span>
                <span className="text-gray-300 font-medium">
                  {formatDate(model.createdAt)}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#18181A] border border-[#262626] rounded-xl flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-500 block text-[11px]">
                  Last Updated
                </span>
                <span className="text-gray-300 font-medium">
                  {formatDate(model.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#262626] bg-[#18181A]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-yellow-400 text-black text-xs font-bold transition-all cursor-pointer shadow-[0_2px_10px_rgba(231,143,35,0.3)] active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
