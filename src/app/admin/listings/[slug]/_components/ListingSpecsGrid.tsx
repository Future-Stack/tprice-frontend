"use client";

import React from "react";
import { Gauge, TrendingUp, Zap, Fuel, Tag } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { getSpecIcon, type ListingSpecsGridProps } from "./types";

interface SpecItem {
  label: string;
  value: string;
  icon: React.ElementType;
}

export function ListingSpecsGrid({ listing }: ListingSpecsGridProps) {
  const specsList: SpecItem[] = [];

  if (listing.buildYear) {
    specsList.push({
      label: "Year",
      value: String(listing.buildYear),
      icon: getSpecIcon("year"),
    });
  }

  if (listing.brand) {
    specsList.push({
      label: "Brand",
      value: listing.brand,
      icon: getSpecIcon("brand"),
    });
  }

  if (listing.category) {
    specsList.push({
      label: "Category",
      value: listing.category,
      icon: getSpecIcon("category"),
    });
  }

  if (listing.saleType) {
    specsList.push({
      label: "Sale Type",
      value: listing.saleType,
      icon: Tag,
    });
  }

  if (listing.specifications && typeof listing.specifications === "object") {
    Object.entries(listing.specifications).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        const labelStr = k
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .trim();
        const formattedLabel = labelStr.charAt(0).toUpperCase() + labelStr.slice(1);
        specsList.push({
          label: formattedLabel,
          value: String(v),
          icon: getSpecIcon(k),
        });
      }
    });
  }

  if (specsList.length === 0) {
    specsList.push(
      { label: "Mileage", value: "1200 mi", icon: Gauge },
      { label: "0-100", value: "5 sec", icon: TrendingUp },
      { label: "Power", value: "661 HP", icon: Zap },
      { label: "Engine", value: "3.9L V8 Twin-Turbo", icon: Fuel }
    );
  }

  const conditionText =
    (listing.specifications?.condition as string) ||
    (listing.saleType ? `${listing.saleType}` : "Excellent");

  const locationStr =
    [listing.locationCity, listing.locationCountry].filter(Boolean).join(", ") || "Location N/A";

  const descriptionText =
    listing.description ||
    `A striking ${listing.brand || ""} ${listing.title} that blends luxury with high-performance engineering. Category: ${listing.category || "N/A"}. Built in ${listing.buildYear || "N/A"}, located in ${locationStr}.`;

  return (
    <div className="space-y-8">
      {/* Specifications and Condition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {specsList.map((spec, i) => {
            const SpecIcon = spec.icon;
            return (
              <AnimationWrapper key={i} type="fade-up" delay={0.2 + i * 0.05}>
                <div className="bg-[#141414] border border-[#262626] p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <SpecIcon className="w-3.5 h-3.5 text-primary" />
                    <p className="text-primary text-[10px] uppercase font-bold tracking-widest">
                      {spec.label}
                    </p>
                  </div>
                  <p className="text-xl font-medium truncate">{spec.value}</p>
                </div>
              </AnimationWrapper>
            );
          })}
        </div>

        <AnimationWrapper type="fade-up" delay={0.4}>
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col justify-center items-start h-full">
            <p className="text-primary text-[10px] uppercase font-bold tracking-widest mb-3">
              Condition / Type
            </p>
            <p className="text-2xl font-semibold text-white capitalize">{conditionText}</p>
          </div>
        </AnimationWrapper>
      </div>

      {/* Description Section */}
      <AnimationWrapper type="fade-up" delay={0.5}>
        <div className="space-y-4">
          <h3 className="text-primary text-[10px] uppercase font-bold tracking-widest">
            Description
          </h3>
          <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl">
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {descriptionText}
            </p>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
