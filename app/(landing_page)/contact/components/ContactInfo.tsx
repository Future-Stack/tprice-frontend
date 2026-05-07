"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-12"
    >
      {/* Map Placeholder */}
      <div className="relative w-full h-[250px] rounded-sm overflow-hidden border border-white/5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.4678!2d-117.85!3d33.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQwJzQ4LjAiTiAxMTfCsDUxJzAwLjAiVw!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <button className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/20 rounded-sm">
            Open in maps ↗
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-8">
        <h3 className="text-xl font-serif text-white">Contact Information</h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Email</p>
              <p className="text-white/60 text-sm">Tyler@exoticworld.store</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Phone</p>
              <p className="text-white/60 text-sm">+1 949-880-6490</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Headquarters</p>
              <p className="text-white/60 text-sm italic leading-relaxed">
                19200 Von Karman Ave Irvine, CA 92612 United States
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="p-8 bg-[#1A1A1A] border-l-4 border-primary/30 rounded-sm">
        <h4 className="text-lg font-serif text-white mb-4">Office Hours</h4>
        <div className="space-y-2 text-white/50 text-xs">
          <p className="flex justify-between">
            <span>Monday - Friday</span>
            <span className="text-white/70">9:00 AM - 6:00 PM CET</span>
          </p>
          <p className="flex justify-between">
            <span>Saturday</span>
            <span className="text-white/70">10:00 AM - 4:00 PM CET</span>
          </p>
          <p className="flex justify-between">
            <span>Sunday</span>
            <span className="text-white/70 font-bold text-primary/70">By Appointment Only</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
