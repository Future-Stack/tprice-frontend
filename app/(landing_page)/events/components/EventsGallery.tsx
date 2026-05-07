"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import MediaModal from "./MediaModal";

const MEDIA_DATA = [
  {
    id: 1,
    type: "image" as const,
    src: "/images/landing/hero-car.png",
    thumbnail: "/images/landing/hero-car.png",
    title: "EBACE Private Aviation Summit",
    desc: "3rd April, 2026, 9pm • 1901 Thornridge Cir. Shiloh, Hawaii",
    span: "row-span-2",
  },
  {
    id: 2,
    type: "image" as const,
    src: "/images/landing/hero-jet.png",
    thumbnail: "/images/landing/hero-jet.png",
    title: "Cockpit Overview",
    span: "row-span-1",
  },
  {
    id: 3,
    type: "video" as const,
    src: "/video/hero.mp4",
    thumbnail: "/images/landing/hero-yacht.png",
    title: "Monaco Harbor Tour",
    span: "row-span-2",
  },
  {
    id: 4,
    type: "image" as const,
    src: "/images/landing/hero-car.png",
    thumbnail: "/images/landing/hero-car.png",
    title: "Performance Review",
    span: "row-span-1",
  },
  {
    id: 5,
    type: "video" as const,
    src: "/video/footer.mp4",
    thumbnail: "/images/landing/hero-villa.png",
    title: "Event Arrival",
    span: "row-span-1",
  },
  {
    id: 6,
    type: "video" as const,
    src: "/video/hero.mp4",
    thumbnail: "/images/landing/hero-villa.png",
    title: "Gala Evening",
    span: "row-span-2",
  }
];

export default function EventsGallery() {
  const [selectedMedia, setSelectedMedia] = useState<typeof MEDIA_DATA[0] | null>(null);

  return (
    <section className="py-24 bg-black px-6 md:px-12 border-t border-white/5">
      <div className="container mx-auto">
        <h2 className="text-4xl font-serif text-white mb-16">Media</h2>

        {/* Staggered Grid with Perfect Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {[MEDIA_DATA[0], MEDIA_DATA[1]].map((item, i) => (
              <MediaCard key={item.id} item={item} i={i} onClick={() => setSelectedMedia(item)} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            {[MEDIA_DATA[2], MEDIA_DATA[3]].map((item, i) => (
              <MediaCard key={item.id} item={item} i={i} onClick={() => setSelectedMedia(item)} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {[MEDIA_DATA[4], MEDIA_DATA[5]].map((item, i) => (
              <MediaCard key={item.id} item={item} i={i} onClick={() => setSelectedMedia(item)} />
            ))}
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        media={selectedMedia}
      />
    </section>
  );
}

function MediaCard({ item, i, onClick }: { item: typeof MEDIA_DATA[0], i: number, onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      onClick={onClick}
      className={`relative rounded-sm overflow-hidden group cursor-pointer border border-white/5 ${
        item.span === "row-span-2" ? "aspect-[3/4]" : "aspect-[3/2]"
      }`}
    >
      <img
        src={item.thumbnail}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        alt={item.title}
      />
      
      {/* "PAST" Tag */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
          PAST
        </span>
      </div>

      {/* Video Play Icon */}
      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-all duration-300">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </div>
      )}

      {/* Hover Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
        <div className="space-y-2">
          <h3 className="text-lg font-serif text-white">{item.title}</h3>
          {item.desc && <p className="text-white/50 text-[10px] italic leading-relaxed">{item.desc}</p>}
        </div>
      </div>
    </motion.div>
  );
}
