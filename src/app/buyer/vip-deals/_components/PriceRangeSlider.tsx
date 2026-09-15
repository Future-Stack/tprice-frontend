import React from "react";

interface PriceRangeSliderProps {
  minLimit: number;
  maxLimit: number;
  priceMin: number;
  setPriceMin: (min: number) => void;
  priceMax: number;
  setPriceMax: (max: number) => void;
}

export function PriceRangeSlider({
  minLimit,
  maxLimit,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
}: PriceRangeSliderProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        Price Range ($)
      </label>

      {/* Numeric Min / Max Inputs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <span className="text-[10px] text-gray-500 block mb-1">Min Price</span>
          <input
            type="number"
            value={priceMin || ""}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block mb-1">Max Price</span>
          <input
            type="number"
            value={priceMax >= maxLimit ? "" : priceMax}
            onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : maxLimit)}
            placeholder="Max"
            className="w-full bg-[#18181A] border border-[#2C2C2E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative h-1.5 bg-[#2C2C2E] rounded-full mb-3">
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{
            left: `${Math.min(100, Math.max(0, (priceMin / maxLimit) * 100))}%`,
            right: `${Math.min(100, Math.max(0, 100 - (Math.min(priceMax, maxLimit) / maxLimit) * 100))}%`,
          }}
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={10000}
          value={priceMin}
          onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 10000))}
          className="absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none z-10
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary 
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={10000}
          value={priceMax}
          onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 10000))}
          className="absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none z-20
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary 
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 font-medium">
        <span>${priceMin.toLocaleString()}</span>
        <span>{priceMax >= maxLimit ? "Any Max" : `$${priceMax.toLocaleString()}`}</span>
      </div>
    </div>
  );
}

export default PriceRangeSlider;
