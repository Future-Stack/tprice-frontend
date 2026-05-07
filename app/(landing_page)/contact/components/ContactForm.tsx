"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-[#1A1A1A] p-6 md:p-10 rounded-sm border border-white/5 shadow-2xl h-full"
    >
      <div className="flex flex-col h-full space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-white mb-1">Send a Message</h2>
          <p className="text-white/40 text-[12px]">All inquiries are handled with complete confidentiality.</p>
        </div>

        <form className="flex-1 flex flex-col space-y-4">
          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              placeholder="John Smith"
              className="w-full bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col">
            <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Message</label>
            <textarea
              rows={4}
              placeholder="Tell us how we can help you..."
              className="w-full flex-1 bg-[#252525] border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            className="w-full bg-primary text-black font-bold py-4 mt-auto uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 rounded-sm text-sm"
          >
            Send Message
          </button>
        </form>
      </div>
    </motion.div>
  );
}
