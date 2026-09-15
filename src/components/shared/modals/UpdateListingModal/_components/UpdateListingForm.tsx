"use client";

import React, { useState } from "react";
import { X, Tag, DollarSign, Layers, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ListingItem, UpdateListingInput } from "@/lib/api/listings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useGetModelsQuery } from "@/hooks/useModels";
import { useGetTrimsQuery } from "@/hooks/useTrims";
import { useUpdateListingMutation } from "@/hooks/useListings";
import { useUploadMultipleMediaMutation } from "@/hooks/useMedia";
import { UploadedMediaItem } from "@/components/SortableMediaGallery";
import { KeyValuePair, UpdateListingTab } from "./types";
import GeneralTab from "./GeneralTab";
import PricingTab from "./PricingTab";
import SpecsTab from "./SpecsTab";
import MediaTab from "./MediaTab";

interface UpdateListingFormProps {
  listing: ListingItem;
  onClose: () => void;
}

const parseInitialSpecs = (specifications: unknown): KeyValuePair[] => {
  if (!specifications) return [];
  let specsObj: Record<string, unknown> = {};
  if (typeof specifications === "string") {
    try {
      specsObj = JSON.parse(specifications);
    } catch {
      specsObj = {};
    }
  } else if (typeof specifications === "object" && specifications !== null) {
    specsObj = specifications as Record<string, unknown>;
  }

  return Object.entries(specsObj).map(([k, v], idx) => ({
    id: `spec-${idx}-${k}`,
    key: k,
    value: v !== undefined && v !== null ? String(v) : "",
  }));
};

const parseInitialMedia = (listing: ListingItem): UploadedMediaItem[] => {
  if (!listing.media || !Array.isArray(listing.media)) return [];
  return listing.media.map((m, idx) => ({
    id: m.id || `media-${listing.id}-${idx}`,
    url: m.url,
    type: m.type || "IMAGE",
    displayOrder: m.displayOrder ?? idx + 1,
    isCover: Boolean(m.isCover || (idx === 0 && listing.media.every((x) => !x.isCover))),
  }));
};

export default function UpdateListingForm({ listing, onClose }: UpdateListingFormProps) {
  // Cascading Queries
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery({
    limit: 100,
  });
  const categoriesList = categoriesResponse?.data || [];

  // Active Tab
  const [activeTab, setActiveTab] = useState<UpdateListingTab>("general");

  // General state
  const [title, setTitle] = useState(listing.title || "");
  const [category, setCategory] = useState(listing.category || "");
  const [brand, setBrand] = useState(listing.brand || "");
  const [model, setModel] = useState(listing.model || "");
  const [trim, setTrim] = useState(listing.trim || "");
  const [buildYear, setBuildYear] = useState<number | "">(listing.buildYear || 2024);
  const [locationCity, setLocationCity] = useState(listing.locationCity || "");
  const [locationCountry, setLocationCountry] = useState(listing.locationCountry || "");
  const [isOffMarket, setIsOffMarket] = useState(Boolean(listing.isOffMarket));

  // Pricing state
  const rawSaleType = (listing.saleType || "FIXED_PRICE").toUpperCase();
  const initialSaleType =
    rawSaleType === "PRIVATE" || rawSaleType === "PRIVATETREATY"
      ? "PRIVATE_SALE"
      : (rawSaleType as "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE") || "FIXED_PRICE";
  const [saleType, setSaleType] = useState<"FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE">(
    initialSaleType
  );
  const [askingPrice, setAskingPrice] = useState<string>(
    listing.askingPrice !== undefined && listing.askingPrice !== null
      ? String(listing.askingPrice)
      : ""
  );
  const [startingBid, setStartingBid] = useState<string>(
    listing.startingBid ? String(listing.startingBid) : ""
  );
  const [auctionEndsAt, setAuctionEndsAt] = useState<string>(listing.auctionEndsAt || "");
  const [currency] = useState(listing.currency || "USD");
  const [allowCounterOffers, setAllowCounterOffers] = useState(
    listing.allowCounterOffers !== false
  );

  // Specifications & Media states
  const [specifications, setSpecifications] = useState<KeyValuePair[]>(() =>
    parseInitialSpecs(listing.specifications)
  );
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>(() => parseInitialMedia(listing));

  // Cascading data lookups
  const selectedCategory = categoriesList.find(
    (cat) => cat.name === category || cat.id === category
  );
  const selectedCategoryId = selectedCategory?.id;

  const { data: brandsResponse, isLoading: isLoadingBrands } = useGetBrandsQuery(
    selectedCategoryId ? { categoryId: selectedCategoryId, limit: 100 } : undefined,
    { enabled: Boolean(selectedCategoryId) }
  );
  const brandsList = selectedCategoryId ? brandsResponse?.data || [] : [];

  const selectedBrand = brandsList.find((b) => b.name === brand || b.id === brand);
  const selectedBrandId = selectedBrand?.id;

  const { data: modelsResponse, isLoading: isLoadingModels } = useGetModelsQuery(
    selectedBrandId ? { brandId: selectedBrandId, limit: 100 } : undefined,
    { enabled: Boolean(selectedBrandId) }
  );
  const modelsList = selectedBrandId ? modelsResponse?.data || [] : [];

  const selectedModel = modelsList.find((m) => m.name === model || m.id === model);
  const selectedModelId = selectedModel?.id;

  const { data: trimsResponse, isLoading: isLoadingTrims } = useGetTrimsQuery(
    selectedModelId ? { modelId: selectedModelId, limit: 100 } : undefined,
    { enabled: Boolean(selectedModelId) }
  );
  const trimsList = selectedModelId ? trimsResponse?.data || [] : [];
  const selectedTrim = trimsList.find((t) => t.name === trim || t.id === trim);
  const selectedTrimId = selectedTrim?.id;

  // Mutations
  const updateListingMutation = useUpdateListingMutation();
  const uploadMediaMutation = useUploadMultipleMediaMutation();

  const handleFilesUpload = async (files: File[]) => {
    try {
      const res = await uploadMediaMutation.mutateAsync({
        files,
        folder: "exoticworld/listings",
      });
      if (res && res.length > 0) {
        setMediaList((prev) => {
          const isFirst = prev.length === 0;
          const newItems: UploadedMediaItem[] = res.map((item, idx) => ({
            id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
            url: item.url,
            type: "IMAGE",
            displayOrder: prev.length + idx + 1,
            isCover: isFirst && idx === 0,
          }));

          const hasCover = prev.some((item) => item.isCover);
          if (!hasCover && newItems.length > 0) {
            newItems[0].isCover = true;
          }

          return [...prev, ...newItems];
        });

        toast.success(
          res.length === 1
            ? "Image uploaded successfully!"
            : `${res.length} images uploaded successfully!`
        );
      }
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to upload image(s).";
      toast.error(errMsg);
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error("Title is required.");
      setActiveTab("general");
      return false;
    }
    if (!category.trim()) {
      toast.error("Category is required.");
      setActiveTab("general");
      return false;
    }
    if (saleType === "FIXED_PRICE" && (!askingPrice || Number(askingPrice) <= 0)) {
      toast.error("Please provide a valid asking price.");
      setActiveTab("pricing");
      return false;
    }
    if (saleType === "AUCTION") {
      if (!startingBid || Number(startingBid) <= 0) {
        toast.error("Please provide a valid starting bid.");
        setActiveTab("pricing");
        return false;
      }
      if (!auctionEndsAt) {
        toast.error("Please select an auction end date.");
        setActiveTab("pricing");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const specsObj: Record<string, string | number> = {};
    specifications.forEach((item) => {
      const trimmedKey = item.key.trim();
      const trimmedVal = item.value.trim();
      if (trimmedKey) {
        if (trimmedVal && !isNaN(Number(trimmedVal))) {
          specsObj[trimmedKey] = Number(trimmedVal);
        } else {
          specsObj[trimmedKey] = trimmedVal;
        }
      }
    });

    const payload: UpdateListingInput = {
      title: title.trim(),
      categoryId: selectedCategoryId || undefined,
      brandId: selectedBrandId || undefined,
      modelId: selectedModelId || undefined,
      trimId: selectedTrimId || undefined,
      saleType,
      allowCounterOffers: saleType === "FIXED_PRICE" ? allowCounterOffers : false,
      askingPrice: askingPrice ? Number(askingPrice) : undefined,
      startingBid: saleType === "AUCTION" && startingBid ? Number(startingBid) : undefined,
      auctionEndsAt: saleType === "AUCTION" && auctionEndsAt ? auctionEndsAt : undefined,
      currency: currency || "USD",
      isOffMarket,
      locationCity: locationCity.trim() || undefined,
      locationCountry: locationCountry.trim() || undefined,
      buildYear: buildYear ? Number(buildYear) : undefined,
      specifications: Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : undefined,
      media: mediaList.map((m, idx) => ({
        url: m.url,
        type: m.type || "IMAGE",
        displayOrder: idx + 1,
        isCover: Boolean(m.isCover || (idx === 0 && mediaList.every((x) => !x.isCover))),
      })),
    };

    try {
      await updateListingMutation.mutateAsync({
        id: listing.id,
        data: payload,
      });
      toast.success("Listing updated successfully!");
      onClose();
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to update listing.";
      toast.error(errMsg);
    }
  };

  const tabs = [
    { id: "general" as const, label: "General Info", icon: Tag },
    { id: "pricing" as const, label: "Pricing & Sale", icon: DollarSign },
    { id: "specs" as const, label: "Specifications", icon: Layers },
    { id: "media" as const, label: "Media Gallery", icon: ImageIcon },
  ];

  return (
    <div
      className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-[#2A2A2A] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Edit Listing</h2>
          <p className="text-xs text-gray-400">
            ID: <span className="font-mono text-gray-300">{listing.id}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Tabs */}
      <div className="px-6 border-b border-[#2A2A2A] bg-[#171717] flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#EAB308] text-[#EAB308] bg-[#EAB308]/5"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "general" && (
          <GeneralTab
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            model={model}
            setModel={setModel}
            trim={trim}
            setTrim={setTrim}
            buildYear={buildYear}
            setBuildYear={setBuildYear}
            locationCity={locationCity}
            setLocationCity={setLocationCity}
            locationCountry={locationCountry}
            setLocationCountry={setLocationCountry}
            isOffMarket={isOffMarket}
            setIsOffMarket={setIsOffMarket}
            categoriesList={categoriesList}
            isLoadingCategories={isLoadingCategories}
            brandsList={brandsList}
            isLoadingBrands={isLoadingBrands}
            modelsList={modelsList}
            isLoadingModels={isLoadingModels}
            trimsList={trimsList}
            isLoadingTrims={isLoadingTrims}
          />
        )}

        {activeTab === "pricing" && (
          <PricingTab
            saleType={saleType}
            setSaleType={setSaleType}
            askingPrice={askingPrice}
            setAskingPrice={setAskingPrice}
            startingBid={startingBid}
            setStartingBid={setStartingBid}
            auctionEndsAt={auctionEndsAt}
            setAuctionEndsAt={setAuctionEndsAt}
            currency={currency}
            allowCounterOffers={allowCounterOffers}
            setAllowCounterOffers={setAllowCounterOffers}
          />
        )}

        {activeTab === "specs" && (
          <SpecsTab
            specifications={specifications}
            onAddRow={() =>
              setSpecifications((prev) => [
                ...prev,
                { id: `spec-${Date.now()}`, key: "", value: "" },
              ])
            }
            onChangeRow={(id, field, val) =>
              setSpecifications((prev) =>
                prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
              )
            }
            onRemoveRow={(id) => setSpecifications((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {activeTab === "media" && (
          <MediaTab
            mediaList={mediaList}
            setMediaList={setMediaList}
            isUploading={uploadMediaMutation.isPending}
            onFilesUpload={handleFilesUpload}
          />
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={updateListingMutation.isPending}
            className="px-5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#2A2A2A] border border-[#333333] rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateListingMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-[#EAB308] hover:bg-[#D9A506] rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {updateListingMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
