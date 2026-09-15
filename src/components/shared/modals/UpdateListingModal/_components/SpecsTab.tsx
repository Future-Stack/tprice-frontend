"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { SpecsTabProps } from "./types";

export default function SpecsTab({
  specifications,
  onAddRow,
  onChangeRow,
  onRemoveRow,
}: SpecsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">Custom Specifications</h3>
          <p className="text-xs text-gray-400">
            Add key-value properties (e.g. Mileage, Engine, Color, Condition)
          </p>
        </div>
        <button
          type="button"
          onClick={onAddRow}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30 hover:bg-[#EAB308] hover:text-black rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Property</span>
        </button>
      </div>

      {specifications.length === 0 ? (
        <div className="py-8 text-center bg-[#111111] border border-[#2A2A2A] rounded-xl text-gray-400 text-xs">
          No custom specifications added yet. Click &quot;Add Property&quot; to include details.
        </div>
      ) : (
        <div className="space-y-3">
          {specifications.map((spec) => (
            <div
              key={spec.id}
              className="flex items-center gap-3 bg-[#111111] p-2.5 border border-[#2A2A2A] rounded-xl"
            >
              <input
                type="text"
                value={spec.key}
                onChange={(e) => onChangeRow(spec.id, "key", e.target.value)}
                placeholder="Feature name (e.g. Engine)"
                className="flex-1 bg-[#1C1C1C] border border-[#333333] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#EAB308]"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => onChangeRow(spec.id, "value", e.target.value)}
                placeholder="Value (e.g. V8 Twin-Turbo)"
                className="flex-1 bg-[#1C1C1C] border border-[#333333] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#EAB308]"
              />
              <button
                type="button"
                onClick={() => onRemoveRow(spec.id)}
                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
