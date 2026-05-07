"use client";

import React from "react";

interface CoverImageProps {
  image: string;
}

export default function CoverImage({ image }: CoverImageProps) {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px]">
      <img src={image} alt="Cover" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
