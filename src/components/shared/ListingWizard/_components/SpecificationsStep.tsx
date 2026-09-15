import React from "react";
import { Sparkles, Trash2, Plus, Search, Loader2, AlertCircle } from "lucide-react";
import type { SpecificationsStepProps } from "./types";

export function SpecificationsStep({
  vin,
  setVin,
  onDecodeVin,
  isDecodingVin,
  specifications,
  onAddSpecRow,
  onSpecChange,
  onRemoveSpecRow,
  onClearAllSpecs,
}: SpecificationsStepProps) {
  return (
    <div className="space-y-6">
      {/* Step Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-clash font-medium text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Vehicle Specifications
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Enter VIN to auto-populate all vehicle specifications, or add custom key-value pairs
            manually.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {specifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAllSpecs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-semibold text-xs transition-all cursor-pointer"
              title="Clear all fields"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
          <button
            type="button"
            onClick={onAddSpecRow}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black font-semibold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>
      </div>

      {/* VIN Decoder Card */}
      <div className="p-4 md:p-5 bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-primary" /> VIN Decoder
          </label>
          <span className="text-[11px] text-gray-400">Auto-decode 17-digit VIN</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onDecodeVin();
                }
              }}
              placeholder="Enter 17-digit VIN (e.g. 1FA6P8CF0H5100001)"
              maxLength={17}
              className="w-full bg-[#111113] border border-[#2C2C2E] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors uppercase font-mono tracking-wider"
            />
            {vin && (
              <button
                type="button"
                onClick={() => setVin("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 text-xs cursor-pointer"
                title="Clear VIN input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onDecodeVin}
            disabled={isDecodingVin || !vin.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-xl text-xs font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-primary/20 shrink-0 active:scale-95"
          >
            {isDecodingVin ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Decoding...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Decode VIN
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
          <span>Supports standard 17-character vehicle VINs</span>
          <button
            type="button"
            onClick={() => setVin("1FA6P8CF0H5100001")}
            className="text-primary hover:underline cursor-pointer"
          >
            Fill Sample VIN (Ford Mustang)
          </button>
        </div>
      </div>

      {/* Dynamic Key-Value Specifications List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold uppercase tracking-wider">
            Specifications List ({specifications.length})
          </span>
          {specifications.length > 0 && (
            <span className="text-[11px] text-gray-500">
              All keys and values are fully editable
            </span>
          )}
        </div>

        {specifications.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-[#2C2C2E] rounded-xl bg-[#1c1c1e]/50">
            <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-400">No specifications added yet</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Decode a VIN above or click &quot;Add Field&quot; to manually enter specifications.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-120 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {specifications.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2 md:w-8 text-[11px] text-gray-500 font-mono">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.key}
                    onChange={(e) => onSpecChange(item.id, "key", e.target.value)}
                    placeholder="Key (e.g. horsepower)"
                    className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors font-mono"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => onSpecChange(item.id, "value", e.target.value)}
                    placeholder="Value (e.g. 986)"
                    className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveSpecRow(item.id)}
                  className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer self-end md:self-center shrink-0"
                  title="Remove specification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {specifications.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onAddSpecRow}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black font-semibold text-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Another Field
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
