"use client";

import React from "react";
import { Check } from "lucide-react";

interface HistoryTabProps {
  history: string[];
}

export default function HistoryTab({ history }: HistoryTabProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-primary border-b border-primary/20 pb-2 inline-block">
        History
      </h3>
      
      <div className="space-y-6">
        {history.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6">
            <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-white/80 text-lg font-medium leading-none">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
