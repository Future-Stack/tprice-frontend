"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Image as ImageIcon,
  Plus,
  X,
  Check,
  CheckCircle2,
  Circle,
  ArrowRight,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { useCreateListingMutation } from "@/hooks/useListings";
import { toast } from "sonner";

const steps = ["Basic Info", "Specifications", "Media", "Pricing", "Review"];

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

interface UploadedMediaItem {
  url: string;
  type: string;
  displayOrder: number;
}

const COMMON_SPEC_SUGGESTIONS = [
  "horsepower",
  "engine",
  "transmission",
  "exteriorColor",
  "mileage",
  "interiorColor",
  "bedrooms",
  "bathrooms",
];

export default function AddListing() {
  const router = useRouter();

  // React Query Queries & Mutations
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: brandsResponse, isLoading: isLoadingBrands } = useGetBrandsQuery({ limit: 100 });
  const uploadMediaMutation = useUploadMediaMutation();
  const createListingMutation = useCreateListingMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stepper State
  const [currentStep, setCurrentStep] = useState(0);

  // Basic Info Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [description, setDescription] = useState("");

  // Specifications State
  const [yearOfManufacture, setYearOfManufacture] = useState("2024");
  const [condition, setCondition] = useState("new");
  const [usageMileage, setUsageMileage] = useState("");
  const [exteriorColor, setExteriorColor] = useState("");
  const [specifications, setSpecifications] = useState<KeyValuePair[]>([]);

  // Media Gallery State
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Pricing & Sale Type State
  const [saleType, setSaleType] = useState<"FIXED_PRICE" | "AUCTION" | "PRIVATE">("FIXED_PRICE");
  const [askingPrice, setAskingPrice] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [auctionEndsAt, setAuctionEndsAt] = useState("2026-12-31T23:59:59.000Z");
  const [currency, setCurrency] = useState("USD");
  const [allowCounterOffers, setAllowCounterOffers] = useState(false);

  // Plan Selection State
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "featured">("standard");

  // Specification Key-Value Handlers
  const handleAddSpecRow = () => {
    setSpecifications((prev) => [
      ...prev,
      { id: Date.now().toString(), key: "", value: "" },
    ]);
  };

  const handleSpecChange = (id: string, field: "key" | "value", val: string) => {
    setSpecifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveSpecRow = (id: string) => {
    setSpecifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSuggestion = (keyName: string) => {
    if (specifications.some((s) => s.key.toLowerCase() === keyName.toLowerCase())) {
      toast.info(`"${keyName}" specification key is already added.`);
      return;
    }
    setSpecifications((prev) => [
      ...prev,
      { id: Date.now().toString(), key: keyName, value: "" },
    ]);
  };

  // Image Upload Handler using useUploadMediaMutation
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be under 10MB.");
      return;
    }

    try {
      const res = await uploadMediaMutation.mutateAsync({
        file,
        folder: "exoticworld/listings",
      });

      if (res?.url) {
        setMediaList((prev) => [
          ...prev,
          {
            url: res.url,
            type: "IMAGE",
            displayOrder: prev.length + 1,
          },
        ]);
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to upload image.";
      toast.error(errMsg);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => handleFileUpload(file));
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropMedia = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    files.forEach((file) => handleFileUpload(file));
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    });
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      if (!title.trim()) {
        toast.error("Please enter a listing title.");
        return false;
      }
      if (!category) {
        toast.error("Please select a category.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (saleType === "FIXED_PRICE" && (!askingPrice || Number(askingPrice) <= 0)) {
        toast.error("Please enter a valid asking price.");
        return false;
      }
      if (saleType === "AUCTION" && (!startingBid || Number(startingBid) <= 0)) {
        toast.error("Please enter a valid starting bid.");
        return false;
      }
    }
    return true;
  };

  const validateAllStepsBeforeSubmit = (): boolean => {
    if (!title.trim()) {
      toast.error("Please enter a listing title.");
      return false;
    }
    if (!category) {
      toast.error("Please select a category.");
      return false;
    }
    if (saleType === "FIXED_PRICE" && (!askingPrice || Number(askingPrice) <= 0)) {
      toast.error("Please enter a valid asking price.");
      return false;
    }
    if (saleType === "AUCTION" && (!startingBid || Number(startingBid) <= 0)) {
      toast.error("Please enter a valid starting bid.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmitListing();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit Listing Function
  const handleSubmitListing = async () => {
    if (!validateAllStepsBeforeSubmit()) return;

    const specsObject: Record<string, any> = {};
    if (description.trim()) specsObject["description"] = description.trim();
    if (yearOfManufacture.trim()) specsObject["yearOfManufacture"] = yearOfManufacture.trim();
    if (condition.trim()) specsObject["condition"] = condition.trim();
    if (usageMileage.trim()) specsObject["mileage"] = usageMileage.trim();
    if (exteriorColor.trim()) specsObject["exteriorColor"] = exteriorColor.trim();

    specifications.forEach((item) => {
      const trimmedKey = item.key.trim();
      const trimmedVal = item.value.trim();
      if (trimmedKey) {
        if (trimmedVal && !isNaN(Number(trimmedVal))) {
          specsObject[trimmedKey] = Number(trimmedVal);
        } else {
          specsObject[trimmedKey] = trimmedVal;
        }
      }
    });

    const specificationsJson =
      Object.keys(specsObject).length > 0 ? JSON.stringify(specsObject) : undefined;

    let city: string | undefined = undefined;
    let country: string | undefined = undefined;
    if (itemLocation.trim()) {
      const parts = itemLocation.split(",").map((s) => s.trim());
      city = parts[0] || undefined;
      country = parts[1] || undefined;
    }

    const askingPriceNum = askingPrice
      ? Number(askingPrice)
      : saleType === "AUCTION" && startingBid
        ? Number(startingBid)
        : 0;

    const payload = {
      title: title.trim(),
      category,
      brand: brand.trim() || undefined,
      buildYear: yearOfManufacture && !isNaN(Number(yearOfManufacture)) ? Number(yearOfManufacture) : 2024,
      locationCity: city,
      locationCountry: country,
      isOffMarket: false,
      saleType,
      allowCounterOffers: saleType === "FIXED_PRICE" ? allowCounterOffers : false,
      askingPrice: askingPriceNum,
      startingBid: saleType === "AUCTION" && startingBid ? Number(startingBid) : undefined,
      auctionEndsAt: saleType === "AUCTION" && auctionEndsAt ? auctionEndsAt : undefined,
      currency: currency || "USD",
      specifications: specificationsJson,
      media: mediaList.map((m, idx) => ({
        url: m.url,
        type: m.type || "IMAGE",
        displayOrder: idx + 1,
      })),
    };

    try {
      await createListingMutation.mutateAsync(payload);
      toast.success("Listing created successfully!");
      router.push("/dealer/listing");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to create listing. Please check required fields.";
      toast.error(errMsg);
    }
  };

  const categoriesList = categoriesResponse?.data || [];
  const brandsList = brandsResponse?.data || [];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-clash font-medium mb-8">Basic Information</h3>
            {/* Listing Title */}
            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-gray-300">Listing Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ferrari 488 Spider"
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
                required
              />
            </div>

            {/* Category & Brand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Category *</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary2/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">
                      {isLoadingCategories ? "Loading categories..." : "Select Category"}
                    </option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Brand / Manufacturer</label>
                <div className="relative">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary2/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">
                      {isLoadingBrands ? "Loading brands..." : "Select Brand"}
                    </option>
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Item Location */}
            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-gray-300">Item Location</label>
              <input
                type="text"
                value={itemLocation}
                onChange={(e) => setItemLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
              />
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-gray-300">Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the item..."
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors resize-none shadow-inner"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-clash font-medium mb-8">Specifications</h3>

            {/* Row 1: Year & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Year of Manufacture</label>
                <input
                  type="text"
                  value={yearOfManufacture}
                  onChange={(e) => setYearOfManufacture(e.target.value)}
                  placeholder="YYYY"
                  className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Condition</label>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary2/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Usage & Exterior Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Usage / Mileage</label>
                <input
                  type="text"
                  value={usageMileage}
                  onChange={(e) => setUsageMileage(e.target.value)}
                  placeholder="e.g. 12,000 miles or 450 flight hours"
                  className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[14px] font-medium text-gray-300">Exterior Color</label>
                <input
                  type="text"
                  value={exteriorColor}
                  onChange={(e) => setExteriorColor(e.target.value)}
                  placeholder="e.g. Rosso Corsa"
                  className="w-full bg-[#0D0D0F] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors"
                />
              </div>
            </div>

            {/* Dynamic Custom Specifications Builder */}
            <div className="pt-4 border-t border-[#2C2C2E] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Additional Specifications</h4>
                  <p className="text-xs text-gray-500">Add custom key-value pairs for additional details.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpecRow}
                  className="px-3.5 py-1.5 bg-primary2/10 border border-primary2/30 hover:bg-primary2/20 text-primary2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Spec Field
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {COMMON_SPEC_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSuggestion(preset)}
                    className="px-2.5 py-1 bg-[#1c1c1e] border border-[#2C2C2E] hover:border-primary2/50 text-gray-400 hover:text-primary2 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 font-mono"
                  >
                    <Plus className="w-3 h-3" /> {preset}
                  </button>
                ))}
              </div>

              {/* Dynamic rows */}
              {specifications.length > 0 && (
                <div className="space-y-3 pt-2">
                  {specifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl"
                    >
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => handleSpecChange(item.id, "key", e.target.value)}
                        placeholder="Key (e.g. transmission)"
                        className="flex-1 bg-[#0D0D0F] border border-[#2C2C2E] rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 font-mono"
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleSpecChange(item.id, "value", e.target.value)}
                        placeholder="Value (e.g. Automatic)"
                        className="flex-1 bg-[#0D0D0F] border border-[#2C2C2E] rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(item.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove specification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-clash font-medium mb-8">Media Gallery</h3>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Main Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropMedia}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed aspect-[16/7] rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer ${isDragging
                ? "border-primary2 bg-primary2/10"
                : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-primary2/50 hover:bg-[#252528]"
                }`}
            >
              {uploadMediaMutation.isPending ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <Loader2 className="w-10 h-10 text-primary2 animate-spin" />
                  <p className="text-sm font-medium text-primary2">Uploading image to cloud media service...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#111113] rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary2 transition-colors">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-lg">Click or drag images to upload</p>
                    <p className="text-gray-500 text-sm mt-1">High-resolution JPG, PNG or WEBP (max 10MB each)</p>
                  </div>
                </>
              )}
            </div>

            {/* Preview Grid */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaList.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl border-2 border-[#2C2C2E] bg-[#1c1c1e] overflow-hidden group"
                  >
                    <img
                      src={item.url}
                      alt={`Uploaded preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMedia(idx);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-gray-300 font-mono">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-10">
            <h3 className="text-xl font-clash font-medium mb-8">Pricing & Sale Type</h3>

            {/* Sale Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "FIXED_PRICE", title: "Fixed Price", desc: "Set a specific asking price" },
                { id: "AUCTION", title: "Auction", desc: "Set starting bid and duration" },
                { id: "PRIVATE", title: "Private Sale", desc: "Price on Application (POA)" },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSaleType(type.id as any)}
                  className={`flex flex-col items-start p-6 rounded-xl border transition-all duration-300 text-left cursor-pointer ${saleType === type.id
                    ? "border-primary2 bg-primary2/5 ring-1 ring-primary2"
                    : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-gray-600"
                    }`}
                >
                  <span className={`font-semibold text-base mb-1 ${saleType === type.id ? "text-primary2" : "text-white"}`}>
                    {type.title}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {type.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Price Inputs */}
            <div className="space-y-4 max-w-md">
              {saleType !== "AUCTION" ? (
                <div className="space-y-2.5">
                  <label className="text-[14px] font-medium text-gray-300">
                    Asking Price ({currency}) {saleType === "FIXED_PRICE" && "*"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <label className="text-[14px] font-medium text-gray-300">Starting Bid (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[14px] font-medium text-gray-300">Auction End Date</label>
                    <input
                      type="datetime-local"
                      value={auctionEndsAt.slice(0, 16)}
                      onChange={(e) => setAuctionEndsAt(new Date(e.target.value).toISOString())}
                      className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary2/50 transition-colors shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Counter Offers Checkbox - Only for FIXED_PRICE */}
              {saleType === "FIXED_PRICE" && (
                <label className="flex items-center gap-3 cursor-pointer group pt-2">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allowCounterOffers}
                      onChange={(e) => setAllowCounterOffers(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border border-[#2C2C2E] rounded bg-[#1c1c1e] checked:bg-primary2 checked:border-primary2 transition-all cursor-pointer"
                    />
                    <Check className={`absolute w-3.5 h-3.5 text-[#111113] transition-opacity duration-200 pointer-events-none ${allowCounterOffers ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span className="text-[14px] text-gray-400 group-hover:text-gray-300 transition-colors">
                    Allow buyers to make counter-offers
                  </span>
                </label>
              )}
            </div>

            <div className="h-4 hidden md:block" />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center">
            {/* Header Icon & Text */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary2/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary2/20">
                <CheckCircle2 className="w-8 h-8 text-primary2" />
              </div>
              <h3 className="text-2xl font-clash font-medium text-white mb-2">Ready to Submit</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                Your listing will be submitted to our curation team for review.
                This typically takes 24-48 hours.
              </p>
            </div>

            {/* Review Summary Card */}
            <div className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-2xl p-6 mb-8 text-left space-y-4">
              <h4 className="text-sm font-semibold text-primary2 uppercase tracking-wider">Listing Preview Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Title:</span> <span className="text-white font-medium">{title || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span> <span className="text-white font-medium">{category || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sale Type:</span> <span className="text-white font-medium">{saleType}</span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span> <span className="text-white font-medium">{askingPrice ? `$${askingPrice}` : startingBid ? `$${startingBid} (Start)` : "POA"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Images Uploaded:</span> <span className="text-white font-medium">{mediaList.length} photo(s)</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span> <span className="text-white font-medium">{itemLocation || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Standard Listing Plan */}
              <div
                onClick={() => setSelectedPlan("standard")}
                className={`relative group cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${selectedPlan === "standard"
                  ? "bg-[#1c1c1e] border-primary2/50 ring-1 ring-primary2/20"
                  : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 transition-colors ${selectedPlan === "standard" ? "text-green-500" : "text-gray-600"}`}>
                    {selectedPlan === "standard" ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-clash font-medium text-white">Standard Listing (Free)</h4>
                      <p className="text-gray-400 text-sm mt-1">List your item on the marketplace at no upfront cost.</p>
                    </div>
                    <ul className="space-y-3 mt-6">
                      {[
                        "No listing fee",
                        "6% commission charged only after sale",
                        "Standard visibility"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Featured Listing Plan */}
              <div
                onClick={() => setSelectedPlan("featured")}
                className={`relative group cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${selectedPlan === "featured"
                  ? "bg-[#1c1c1e] border-primary2/50 ring-1 ring-primary2/20"
                  : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 transition-colors ${selectedPlan === "featured" ? "text-green-500" : "text-gray-600"}`}>
                    {selectedPlan === "featured" ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-clash font-medium text-white">Featured Listing ($99)</h4>
                      <p className="text-gray-400 text-sm mt-1">Boost your listing visibility and reach more premium buyers.</p>
                    </div>
                    <ul className="space-y-3 mt-6">
                      {[
                        "Priority placement in listings",
                        "Higher visibility to VIP buyers",
                        "Faster exposure"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 relative z-0 max-w-229 mx-auto">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="mb-6">
          <h2 className="text-[40px] font-clash font-medium tracking-tight">Create New Listing</h2>
          <p className="text-gray-400 mt-2 text-lg">Add your luxury item to the marketplace.</p>
        </div>
      </AnimationWrapper>

      <AnimationWrapper type="fade-up" duration={0.6} delay={0.1}>
        <div
          className="bg-[#1C1C1E] p-8 md:p-10 rounded-2xl border border-[#2C2C2E] shadow-2xl overflow-hidden"
          style={{
            boxShadow: "0 0 50px -12px rgba(178, 114, 31, 0.15)"
          }}
        >
          {/* Progress Section */}
          <div className="mb-12">
            <div className="w-full bg-[#111113] h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-primary2 h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="justify-between items-center text-[13px] font-medium hidden md:flex px-2">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`transition-colors duration-300 cursor-default ${index <= currentStep ? "text-primary2" : "text-gray-500"
                    }`}
                >
                  {step}
                </span>
              ))}
            </div>
            {/* Mobile step indicator */}
            <div className="md:hidden text-center text-primary2 font-medium text-sm">
              Step {currentStep + 1}: {steps[currentStep]}
            </div>
          </div>

          {/* Form Context Container */}
          <div className="bg-[#111113]/50 rounded-2xl p-6 md:p-8 border border-[#2C2C2E]/60 min-h-115">
            <AnimationWrapper key={currentStep} type="zoom" duration={0.4}>
              {renderStepContent()}
            </AnimationWrapper>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={createListingMutation.isPending || uploadMediaMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 border border-[#2C2C2E] rounded-xl text-gray-400 text-sm font-medium hover:bg-[#2C2C2E] hover:text-white transition-all duration-300 group cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={createListingMutation.isPending || uploadMediaMutation.isPending}
              className="flex items-center gap-2 px-8 py-3 bg-primary2 text-[#111113] rounded-xl text-sm font-bold hover:bg-primary transition-all duration-300 shadow-lg shadow-primary2/10 group cursor-pointer ml-auto disabled:opacity-50"
            >
              {createListingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#111113]" />
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Submit Listing" : "Next Step"}
                  {currentStep !== steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
