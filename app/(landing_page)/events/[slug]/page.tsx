"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Clock, ShieldCheck } from "lucide-react";
import RegistrationModal from "../components/RegistrationModal";
import Link from "next/link";
import ScrollToTop from "../../components/ScrollToTop";
import { useGetEventByIdQuery } from "@/hooks/useEvents";

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

import Image from "next/image";

export default function EventDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiEvent, isLoading } = useGetEventByIdQuery(slug);


  const event = apiEvent
    ? {
      title: apiEvent.title,
      category: apiEvent.category,
      status: apiEvent.status,
      date: formatDate(apiEvent.eventDate),
      time: "9:00 AM",
      location: apiEvent.location,
      image: apiEvent.coverImageUrl || "/images/landing/hero-car.png",
      description: apiEvent.description,
    }
    : null;

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 text-sm">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
        <h1 className="text-2xl font-serif">Event Not Found</h1>
        <Link href="/events" className="text-primary hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">
      {/* Event Hero */}
      <section className="relative h-screen min-h-[500px] w-full flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-16">
          <div className="max-w-5xl space-y-8">
            <div className="flex gap-4">
              <span className="px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                {event.category}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/10 text-[#4ADE80] text-[10px] font-bold uppercase tracking-widest">
                {event.status}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-serif leading-tight">{event.title}</h1>
              <p className="text-white/60 text-lg max-w-2xl italic">The World&apos;s Premier Event</p>
            </div>

            <div className="flex flex-wrap gap-8 py-6 border-y border-white/10 mt-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{event.location}</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer px-10 py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] rounded-sm hover:scale-105 transition-all shadow-2xl"
            >
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left: About Text */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <p className="text-primary text-xs font-bold tracking-[0.4em] uppercase">ABOUT THE EVENT</p>
                <h2 className="text-3xl md:text-4xl font-serif italic">{event.title}</h2>
                <div className="prose prose-invert prose-p:text-white/60 prose-p:leading-relaxed max-w-none">
                  <p>{event.description}</p>
                </div>
              </div>
            </div>

            {/* Right: Info Card */}
            <div className="lg:col-span-1 sticky top-32">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-8 space-y-8 shadow-2xl">
                <h3 className="text-xl font-serif text-white">Event Details</h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Date</p>
                      <p className="text-sm text-white/80">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Time</p>
                      <p className="text-sm text-white/80">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Location</p>
                      <p className="text-sm text-white/80 italic">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Access</p>
                      <p className="text-sm text-[#4ADE80] font-bold">{event.status}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] rounded-sm hover transition-all"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={event.title}
        eventDate={event.date}
        eventLocation={event.location}
      />

      <ScrollToTop />
    </main>
  );
}
