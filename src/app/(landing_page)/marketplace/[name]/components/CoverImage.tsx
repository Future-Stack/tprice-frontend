"use client";

import React from "react";
import Image from "next/image";

interface CoverImageProps {
  image: string;
}

export default function CoverImage({ image }: CoverImageProps) {
  return (
    <div className="relative w-full h-87.5 md:h-112.5 lg:h-125">
      <Image src={image} alt="Cover" fill priority unoptimized className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
