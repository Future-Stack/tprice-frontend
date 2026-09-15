"use client";

import React from "react";
import { GeneralTabProps } from "./types";

export default function GeneralTab({
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
}: GeneralTabProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-2">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 2024 Ferrari 488 Spider"
          className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setBrand("");
              setModel("");
              setTrim("");
            }}
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
            required
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
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Brand / Manufacturer
          </label>
          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
              setTrim("");
            }}
            disabled={!category || isLoadingBrands}
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors disabled:opacity-50"
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Model</label>
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setTrim("");
            }}
            disabled={!brand || isLoadingModels}
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors disabled:opacity-50"
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
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Trim / Edition</label>
          <select
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
            disabled={!model || isLoadingTrims}
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors disabled:opacity-50"
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Build Year</label>
          <input
            type="number"
            value={buildYear}
            onChange={(e) => setBuildYear(e.target.value ? Number(e.target.value) : "")}
            placeholder="2024"
            min="1900"
            max="2030"
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">City Location</label>
          <input
            type="text"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            placeholder="Monaco"
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Country Location</label>
          <input
            type="text"
            value={locationCountry}
            onChange={(e) => setLocationCountry(e.target.value)}
            placeholder="France"
            className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-3 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl cursor-pointer hover:border-[#444] transition-colors">
          <input
            type="checkbox"
            checked={isOffMarket}
            onChange={(e) => setIsOffMarket(e.target.checked)}
            className="w-4 h-4 accent-[#EAB308] rounded cursor-pointer"
          />
          <div>
            <span className="text-sm font-semibold text-gray-100 block">
              Off-Market / Exclusive Deal
            </span>
            <span className="text-xs text-gray-400">
              Mark this listing as off-market for VIP / private buyers only.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
