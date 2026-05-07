"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="py-24 bg-[#1A1A1A] px-6">
      <div className="container mx-auto text-center space-y-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-serif text-white italic"
        >
          Ready to discover the extraordinary?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/marketplace"
            className="inline-block px-12 py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 rounded-sm"
          >
            EXPLORE MARKETPLACE
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
