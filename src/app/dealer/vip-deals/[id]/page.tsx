"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import AnimationWrapper from "@/app/components/AnimationWrapper";
import {
  useListingByIdQuery,
  useSaveListingMutation,
  useSavedListingsQuery,
} from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import {
  VIPDetailsSkeleton,
  VIPErrorState,
  VIPGallerySection,
  VIPOverviewSection,
  VIPDetailsSidebar,
  VIPBiddingSidebar,
  getVIPViewModel,
} from "./_components";

export default function VIPDetailsPage() {
  const params = useParams();
  const pathname = usePathname();
  const idOrSlug = (params?.id as string) || "";
  const backLink = pathname?.startsWith("/dealer") ? "/dealer/vip-deals" : "/buyer/vip-deals";

  const { data: product, isLoading, isError, error, refetch } = useListingByIdQuery(idOrSlug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inclFees, setInclFees] = useState(true);
  const [isBiddingMode, setIsBiddingMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveMutation = useSaveListingMutation();
  const { token } = useAuth();
  const { data: savedResponse } = useSavedListingsQuery(
    { page: 1, limit: 100 },
    { enabled: Boolean(token) }
  );

  const isSavedInListings =
    savedResponse?.data?.some((savedItem) => savedItem.id === product?.id) ?? false;
  const isSaved = product?.isSaved !== undefined ? product.isSaved : isSavedInListings;

  const handleToggleSave = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!product?.id) return;
    if (!token) {
      toast.error("Please sign in to save listings to your favorites.");
      return;
    }
    saveMutation.mutate(product.id);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Listing URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) return <VIPDetailsSkeleton />;

  if (isError || !product) {
    const errMsg =
      (error as unknown as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || error?.message;
    return <VIPErrorState errorMessage={errMsg} onRetry={() => refetch()} backLink={backLink} />;
  }

  const vm = getVIPViewModel(product, inclFees);

  return (
    <div className="mx-auto relative z-0">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-10">
        <AnimationWrapper type="fade-down" duration={0.5}>
          <div>
            <h2 className="text-[40px] font-clash font-semibold">Exclusive Collection</h2>
            <p className="text-white text-[20px] mt-1 font-medium">
              Discover the world&apos;s finest assets available for acquisition.
            </p>
          </div>
        </AnimationWrapper>
      </div>

      {/* ── Back link ── */}
      <AnimationWrapper type="fade-right" duration={0.4} delay={0.15}>
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#E78F23] text-sm font-medium mb-6 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to VIP Deals
        </Link>
      </AnimationWrapper>

      {/* ── Product Layout: Gallery + Overview & Details Sidebar ── */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <VIPGallerySection
            title={product.title}
            images={vm.productImages}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            isSaved={isSaved}
            onToggleSave={handleToggleSave}
            copied={copied}
            onShare={handleShare}
          />
          <VIPOverviewSection overviewText={vm.overviewText} />
        </div>

        {!isBiddingMode ? (
          <VIPDetailsSidebar
            vm={vm}
            title={product.title}
            sellerAvatarUrl={product.owner?.avatarUrl}
            onPlaceBid={() => setIsBiddingMode(true)}
            onSendOffer={() => {
              toast.info("Sending counter offer process initiated");
              setIsBiddingMode(true);
            }}
          />
        ) : (
          <VIPBiddingSidebar
            vm={vm}
            title={product.title}
            categoryFallback={product.category || "VIP Deal"}
            sellerAvatarUrl={product.owner?.avatarUrl}
            inclFees={inclFees}
            onToggleInclFees={() => setInclFees(!inclFees)}
            isSaved={isSaved}
            onToggleSave={handleToggleSave}
            copied={copied}
            onShare={handleShare}
            onSubmitBid={() => {
              toast.success("Your bid has been submitted successfully to the seller!");
            }}
            onCancelBidding={() => setIsBiddingMode(false)}
          />
        )}
      </div>
    </div>
  );
}
