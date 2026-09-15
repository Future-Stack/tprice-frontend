import React from "react";
import { WIZARD_STEPS } from "./types";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressPercent = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-[#111113] h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Desktop Step Labels */}
      <div className="justify-between items-center text-[13px] font-medium hidden md:flex px-2">
        {WIZARD_STEPS.map((step, index) => (
          <span
            key={step}
            className={`transition-colors duration-300 cursor-default ${
              index <= currentStep ? "text-primary font-semibold" : "text-gray-500"
            }`}
          >
            {index + 1}. {step}
          </span>
        ))}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden text-center text-primary font-medium text-sm">
        Step {currentStep + 1}: {WIZARD_STEPS[currentStep]}
      </div>
    </div>
  );
}
