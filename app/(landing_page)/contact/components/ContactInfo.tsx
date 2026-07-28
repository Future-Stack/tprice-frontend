"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useContactInfoQuery } from "@/hooks/useContact";

const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.4678!2d-117.85!3d33.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQwJzQ4LjAiTiAxMTfCsDUxJzAwLjAiVw!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus";

export default function ContactInfo() {
  const { data: contactInfo, isLoading } = useContactInfoQuery();

  if (isLoading) {
    return <ContactInfoSkeleton />;
  }

  const email = contactInfo?.supportEmail || "Tyler@exoticworld.store";
  const phone = contactInfo?.supportPhone || "+1 949-880-6490";
  const address =
    contactInfo?.address ||
    "19200 Von Karman Ave Irvine, CA 92612 United States";
  const mapEmbedUrl = contactInfo?.mapEmbedUrl || DEFAULT_MAP_EMBED;

  const formatHour = (
    hourStr?: string,
    defaultLabel?: string,
    defaultValue?: string,
  ) => {
    if (!hourStr) return { label: defaultLabel, value: defaultValue };
    if (hourStr.includes(":")) {
      const colonIdx = hourStr.indexOf(":");
      const label = hourStr.slice(0, colonIdx).trim();
      const value = hourStr.slice(colonIdx + 1).trim();
      return { label, value };
    }
    return { label: defaultLabel, value: hourStr };
  };

  const weekday = formatHour(
    contactInfo?.officeHours?.weekday,
    "Monday - Friday",
    "9:00 AM - 6:00 PM CET",
  );
  const saturday = formatHour(
    contactInfo?.officeHours?.saturday,
    "Saturday",
    "10:00 AM - 4:00 PM CET",
  );
  const sunday = formatHour(
    contactInfo?.officeHours?.sunday,
    "Sunday",
    "By Appointment Only",
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-12"
    >
      {/* Map Placeholder */}
      <div className="relative w-full h-62.5 rounded-sm overflow-hidden border border-white/5 transition-all duration-700">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/20 rounded-sm hover:bg-white/20 transition-all"
          >
            Open in maps ↗
          </a>
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
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
                Email
              </p>
              <p className="text-white/60 text-sm">{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="text-white/60 text-sm">{phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
                Headquarters
              </p>
              <p className="text-white/60 text-sm italic leading-relaxed">
                {address}
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
            <span>{weekday.label}</span>
            <span className="text-white/70">{weekday.value}</span>
          </p>
          <p className="flex justify-between">
            <span>{saturday.label}</span>
            <span className="text-white/70">{saturday.value}</span>
          </p>
          <p className="flex justify-between">
            <span>{sunday.label}</span>
            <span className="text-white/70 font-bold">{sunday.value}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ContactInfoSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Map Skeleton */}
      <div className="relative w-full h-62.5 rounded-sm overflow-hidden border border-white/5 bg-white/5">
        <div className="absolute top-4 left-4">
          <div className="h-8 w-28 bg-white/10 rounded-sm" />
        </div>
      </div>

      {/* Info Section Skeleton */}
      <div className="space-y-8">
        <div className="h-6 w-44 bg-white/10 rounded-sm" />

        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-sm shrink-0" />
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-3 w-16 bg-white/10 rounded-sm" />
                <div className="h-4 w-52 bg-white/10 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Hours Skeleton */}
      <div className="p-8 bg-[#1A1A1A] border-l-4 border-white/10 rounded-sm">
        <div className="h-6 w-32 bg-white/10 rounded-sm mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3.5 w-28 bg-white/10 rounded-sm" />
            <div className="h-3.5 w-36 bg-white/10 rounded-sm" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3.5 w-20 bg-white/10 rounded-sm" />
            <div className="h-3.5 w-36 bg-white/10 rounded-sm" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3.5 w-16 bg-white/10 rounded-sm" />
            <div className="h-3.5 w-32 bg-white/10 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
