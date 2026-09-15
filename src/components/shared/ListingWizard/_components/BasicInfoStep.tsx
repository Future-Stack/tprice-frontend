import React from "react";
import {
  Tag,
  Layers,
  Briefcase,
  Sparkles,
  Calendar,
  MapPin,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { BasicInfoStepProps } from "./types";

export function BasicInfoStep({
  title,
  setTitle,
  category,
  setCategory,
  brand,
  setBrand,
  model,
  setModel,
  trim,
  setTrim,
  buildYear,
  setBuildYear,
  locationCity,
  setLocationCity,
  locationCountry,
  setLocationCountry,
  isOffMarket,
  setIsOffMarket,
  categoriesList,
  isLoadingCategories,
  brandsList,
  isLoadingBrands,
  modelsList,
  isLoadingModels,
  trimsList,
  isLoadingTrims,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-clash font-medium mb-6 text-white flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary" /> Basic Information
      </h3>

      {/* Listing Title */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          Listing Title <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 2024 Ferrari SF90 Stradale Assetto Fiorano"
          className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
          required
        />
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Category{" "}
            <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setBrand("");
                setModel("");
                setTrim("");
              }}
              className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer"
            >
              <option value="">
                {isLoadingCategories ? "Loading categories..." : "Select Category"}
              </option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-primary" /> Brand / Manufacturer
          </label>
          <div className="relative">
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setModel("");
                setTrim("");
              }}
              disabled={!category || isLoadingBrands}
              className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!category
                  ? "Select Category First"
                  : isLoadingBrands
                    ? "Loading brands..."
                    : brandsList.length === 0
                      ? "No brands available"
                      : "Select Brand"}
              </option>
              {brandsList.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              {isLoadingBrands ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 rotate-90" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Model & Trim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" /> Model
          </label>
          <div className="relative">
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setTrim("");
              }}
              disabled={!brand || isLoadingModels}
              className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!brand
                  ? "Select Brand First"
                  : isLoadingModels
                    ? "Loading models..."
                    : modelsList.length === 0
                      ? "No models available"
                      : "Select Model"}
              </option>
              {modelsList.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              {isLoadingModels ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 rotate-90" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Trim / Edition
          </label>
          <div className="relative">
            <select
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              disabled={!model || isLoadingTrims}
              className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!model
                  ? "Select Model First"
                  : isLoadingTrims
                    ? "Loading trims..."
                    : trimsList.length === 0
                      ? "No trims available"
                      : "Select Trim"}
              </option>
              {trimsList.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              {isLoadingTrims ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 rotate-90" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Build Year */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" /> Build Year
        </label>
        <input
          type="number"
          value={buildYear}
          onChange={(e) => setBuildYear(e.target.value ? parseInt(e.target.value, 10) : "")}
          placeholder="e.g. 2024"
          className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
        />
      </div>

      {/* Location City & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Location City
          </label>
          <input
            type="text"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            placeholder="e.g. Miami"
            className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Location Country
          </label>
          <input
            type="text"
            value={locationCountry}
            onChange={(e) => setLocationCountry(e.target.value)}
            placeholder="e.g. United States"
            className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Off Market Toggle */}
      <div className="flex items-center justify-between p-4 bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl">
        <div>
          <p className="text-sm font-semibold text-white">Private Off-Market Listing</p>
          <p className="text-xs text-gray-400">
            Keep this listing visible only to verified VIP buyers
          </p>
        </div>
        <input
          type="checkbox"
          checked={isOffMarket}
          onChange={(e) => setIsOffMarket(e.target.checked)}
          className="w-5 h-5 rounded border-[#2C2C2E] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
        />
      </div>
    </div>
  );
}
