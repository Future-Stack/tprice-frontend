import React from "react";
import { FileText, Tag, Film, Image as ImageIcon, BadgeAlert, Hash, Activity } from "lucide-react";
import { MediaMetadataFieldsProps, CATEGORY_OPTIONS } from "./types";

export function MediaMetadataFields({ formData, onChange }: MediaMetadataFieldsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-primary" /> Title{" "}
          <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
          >
            <option value="IMAGE" className="bg-[#18181A]">
              IMAGE
            </option>
            <option value="VIDEO" className="bg-[#18181A]">
              VIDEO
            </option>
          </select>
        </div>
      </div>

      {/* Caption */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-primary" /> Caption / Subtitle
        </label>
        <textarea
          name="caption"
          value={formData.caption}
          onChange={onChange}
          rows={2}
          placeholder="e.g. 3rd April, 2026, 9pm • 1901 Thornridge Cir. Shiloh, Hawaii 81063"
          className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors resize-none"
        />
      </div>

      {/* Badge Text & Display Order Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Badge Text */}
        <div>
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BadgeAlert className="w-3.5 h-3.5 text-primary" /> Badge Text
          </label>
          <input
            type="text"
            name="badgeText"
            value={formData.badgeText}
            onChange={onChange}
            placeholder="e.g. PAST, NEW, FEATURED"
            className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Display Order */}
        <div>
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-primary" /> Display Order
          </label>
          <input
            type="number"
            name="displayOrder"
            min={0}
            value={formData.displayOrder}
            onChange={onChange}
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
          onChange={onChange}
          className="w-4 h-4 rounded border-[#262626] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
        />
        <label
          htmlFor="isPublished"
          className="text-xs font-semibold text-gray-200 cursor-pointer flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-emerald-400" /> Publish Immediately
        </label>
      </div>
    </>
  );
}

export default MediaMetadataFields;
