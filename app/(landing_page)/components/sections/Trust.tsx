"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, History, Headset } from "lucide-react";

const TRUST_PILLARS = [
  {
    title: "Verified Dealers",
    desc: "Every dealer undergoes rigorous vetting before listing on ExoticWorld.",
    icon: ShieldCheck,
  },
  {
    title: "Secure Transaction",
    desc: "End-to-end encrypted communications and escrow-protected deals.",
    icon: Lock,
  },
  {
    title: "Full Transparency",
    desc: "Complete asset history, documentation, and provenance verification.",
    icon: History,
  },
  {
    title: "Concierge Support",
    desc: "Dedicated relationship managers available 24/7 for VIP members.",
    icon: Headset,
  },
];

export default function Trust() {
  return (
    <section className="py-24 bg-[#050505] px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
          >
            BUILT ON TRUST
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-serif"
          >
            Why Exotic World
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {TRUST_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group p-8 bg-[#1A1A1A] rounded-sm transition-all duration-0 hover:border-b-2 hover:border-primary/50 flex flex-col items-start`}
            >
              <div className="w-12 h-12 border border-primary/30 rounded-md flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <pillar.icon className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="text-xl font-serif text-white mb-4">
                {pillar.title}
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

