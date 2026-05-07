"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, ChevronDown } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

const COUNTRIES = [
  { name: "United States", code: "+1", flag: "🇺🇸", length: 10 },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", length: 10 },
  { name: "Germany", code: "+49", flag: "🇩🇪", length: 11 },
  { name: "France", code: "+33", flag: "🇫🇷", length: 9 },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", length: 10 },
  { name: "India", code: "+91", flag: "🇮🇳", length: 10 },
  { name: "Canada", code: "+1", flag: "🇨🇦", length: 10 },
  { name: "Switzerland", code: "+41", flag: "🇨🇭", length: 9 },
  { name: "Monaco", code: "+377", flag: "🇲🇨", length: 8 },
];

export default function RegistrationModal({
  isOpen,
  onClose,
  eventTitle,
  eventDate,
  eventLocation,
}: RegistrationModalProps) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedGuests, setSelectedGuests] = useState<string>("1");
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">EVENT REGISTRATION</p>
                <h2 className="text-3xl md:text-4xl font-serif text-white">{eventTitle}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-white/40 text-[11px] font-medium border-b border-white/5 pb-6 mt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary/60" />
                {eventDate}
              </div>
              <div className="flex items-center gap-2 italic">
                <MapPin className="w-4 h-4 text-primary/60" />
                {eventLocation}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 pt-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <form className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  placeholder="john@gmail.com"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Country & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Country Name</label>
                  <div 
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-3.5 text-white text-sm flex items-center justify-between cursor-pointer"
                  >
                    <span>{selectedCountry.flag} {selectedCountry.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isCountryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full mb-2 left-0 w-full bg-[#222] border border-white/10 rounded-sm z-50 overflow-hidden shadow-2xl"
                      >
                        <div className="max-h-48 overflow-y-auto">
                          {COUNTRIES.map((c) => (
                            <div
                              key={c.name}
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryOpen(false);
                              }}
                              className="px-4 py-2 hover:bg-primary hover:text-black transition-all cursor-pointer text-sm text-white/80"
                            >
                              {c.flag} {c.name} ({c.code})
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Phone</label>
                  <div className="flex gap-2">
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-3.5 text-white text-sm min-w-[60px] text-center">
                      {selectedCountry.code}
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      maxLength={selectedCountry.length}
                      className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Selection */}
              <div className="space-y-3">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Number Of Guests</label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5", "5+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedGuests(num)}
                      className={`w-12 h-12 rounded-sm border transition-all flex items-center justify-center text-sm font-bold ${
                        selectedGuests === num
                          ? "bg-primary border-primary text-black"
                          : "bg-[#1A1A1A] border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Request */}
              <div className="space-y-2">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Special Request</label>
                <textarea
                  rows={4}
                  placeholder="Any special requests or details..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-3.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                className="w-full bg-primary text-black font-bold py-4 mt-4 uppercase tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Confirm Registration
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
