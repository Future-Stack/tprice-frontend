import React from "react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { VIPOverviewSectionProps } from "./types";

export function VIPOverviewSection({ overviewText }: VIPOverviewSectionProps) {
  return (
    <AnimationWrapper type="fade-up" duration={0.5} delay={0.2}>
      <div className="mt-10">
        <h3 className="text-xl font-clash font-bold mb-4">Overview</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl whitespace-pre-line">
          {overviewText}
        </p>
      </div>
    </AnimationWrapper>
  );
}

export default VIPOverviewSection;
