"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { DEMO_SERVICES } from "../data";
import CoverImage from "./components/CoverImage";
import ProfileCard from "./components/ProfileCard";
import ActionCard from "./components/ActionCard";
import AboutSection from "./components/AboutSection";
import ServicesList from "./components/ServicesList";
import PortfolioGallery from "./components/PortfolioGallery";
import InquiryForm from "./components/InquiryForm";
import ServiceCard from "../components/ServiceCard";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface MarketplaceDetailsPageProps {
  params: Promise<{ name: string }>;
}

export default function MarketplaceDetailsPage({ params }: MarketplaceDetailsPageProps) {
  // Extract params via React.use() for Next.js 15+ dynamic params
  const { name } = use(params);

  // Recreate the slug logic applied in ServiceCard
  const formattedName = decodeURIComponent(name).replace(/-/g, " ").toLowerCase();
  
  const item = DEMO_SERVICES.find(
    (s) => s.name.toLowerCase() === formattedName
  );

  if (!item) {
    return notFound();
  }

  // Find 3 similar professionals
  const similarProfessionals = DEMO_SERVICES
    .filter(s => s.id !== item.id)
    .slice(0, 3);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Cover Image */}
      <CoverImage image={item.coverImage!} />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-32">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col pt-0">
            <ProfileCard item={item} />
            <AboutSection item={item} />
            {item.servicesOffered && <ServicesList item={item} />}
            <PortfolioGallery item={item} />
            <InquiryForm item={item} />
            
            {/* Similar Professionals */}
            <div className="border border-white/5 bg-[#1A1A1A] rounded-2xl p-8 mt-2 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl text-primary font-medium">Similar Professionals</h2>
                <Link href="/marketplace" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                  View All <MoveRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {similarProfessionals.map((simItem) => (
                    <ServiceCard key={simItem.id} item={simItem} />
                 ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Area */}
          <div className="lg:col-span-4 lg:hidden mt-8">
            <ActionCard item={item} />
          </div>
          <div className="lg:col-span-4 hidden lg:block">
            <ActionCard item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
