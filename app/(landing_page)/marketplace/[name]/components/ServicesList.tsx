"use client";

import React from "react";
import { ServiceItem } from "../../data";

interface ServicesListProps {
  item: ServiceItem;
}

export default function ServicesList({ item }: ServicesListProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5 mb-8">
      <h2 className="text-xl text-primary font-medium mb-6">Services Offered</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        {item.servicesOffered?.map((service, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-white/60 text-sm">{service}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
