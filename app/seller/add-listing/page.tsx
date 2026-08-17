"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Tag,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Layers,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import AnimationWrapper from "../../components/AnimationWrapper";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { useCreateListingMutation } from "@/hooks/useListings";
import { useCreateCheckoutSessionMutation } from "@/hooks/usePayments";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function AddListing() {
  const router = useRouter();

  // Queries & Mutations
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useGetBrandsQuery({ limit: 100 });
  const uploadMediaMutation = useUploadMediaMutation();
  const createListingMutation = useCreateListingMutation();
  const createCheckoutMutation = useCreateCheckoutSessionMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Steps
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [buildYear, setBuildYear] = useState<number | "">(2024);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [isOffMarket, setIsOffMarket] = useState(false);

  // Dynamic Specifications state
  const [specifications, setSpecifications] = useState<KeyValuePair[]>([]);

  // Media Gallery state
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Pricing & Sale Type
  const [saleType, setSaleType] = useState<
    "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE"
  >("FIXED_PRICE");
  const [askingPrice, setAskingPrice] = useState<string>("625000");
  const [startingBid, setStartingBid] = useState<string>("500000");
  const [auctionEndsAt, setAuctionEndsAt] = useState<string>(
    "2026-12-31T23:59:59.000Z",
  );
  const [currency, setCurrency] = useState("USD");
  const [allowCounterOffers, setAllowCounterOffers] = useState(true);

  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "featured">(
    "standard",
  );

  // Dynamic Specification handlers
  const handleAddSpecRow = () => {
    setSpecifications((prev) => [
      ...prev,
      { id: Date.now().toString(), key: "", value: "" },
    ]);
  };

  const handleSpecChange = (
    id: string,
    field: "key" | "value",
    val: string,
  ) => {
    setSpecifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );
  };

  const handleRemoveSpecRow = (id: string) => {
    setSpecifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Image Upload handler using useMedia mutation
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
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload image.";
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

  const handleDrop = (e: React.DragEvent) => {
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
      if (
        saleType === "FIXED_PRICE" &&
        (!askingPrice || Number(askingPrice) <= 0)
      ) {
        toast.error("Please enter a valid asking price.");
        return false;
      }
      if (saleType === "AUCTION") {
        if (!startingBid || Number(startingBid) <= 0) {
          toast.error("Please enter a valid starting bid.");
          return false;
        }
        if (!auctionEndsAt) {
          toast.error("Please select an auction end date and time.");
          return false;
        }
        if (new Date(auctionEndsAt) <= new Date()) {
          toast.error("Auction end date must be in the future.");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit Listing Function
  const handleSubmitListing = async () => {
    if (!validateCurrentStep()) return;

    // Convert dynamic specifications array to JSON string
    const specsObject: Record<string, any> = {};
    specifications.forEach((item) => {
      const trimmedKey = item.key.trim();
      const trimmedVal = item.value.trim();
      if (trimmedKey) {
        // Try parsing number if numeric value
        if (trimmedVal && !isNaN(Number(trimmedVal))) {
          specsObject[trimmedKey] = Number(trimmedVal);
        } else {
          specsObject[trimmedKey] = trimmedVal;
        }
      }
    });

    const specificationsJson =
      Object.keys(specsObject).length > 0
        ? JSON.stringify(specsObject)
        : undefined;

    const askingPriceNum = askingPrice
      ? Number(askingPrice)
      : saleType === "AUCTION" && startingBid
        ? Number(startingBid)
        : 0;

    const payload = {
      title: title.trim(),
      category,
      brand: brand.trim() || undefined,
      buildYear: buildYear ? Number(buildYear) : undefined,
      locationCity: locationCity.trim() || undefined,
      locationCountry: locationCountry.trim() || undefined,
      isOffMarket,
      saleType,
      allowCounterOffers:
        saleType === "FIXED_PRICE" ? allowCounterOffers : false,
      askingPrice: askingPriceNum,
      startingBid:
        saleType === "AUCTION" && startingBid ? Number(startingBid) : undefined,
      auctionEndsAt:
        saleType === "AUCTION" && auctionEndsAt ? auctionEndsAt : undefined,
      currency: currency || "USD",
      specifications: specificationsJson,
      media: mediaList.map((m, idx) => ({
        url: m.url,
        type: m.type || "IMAGE",
        displayOrder: idx + 1,
      })),
    };

    try {
      const createdListing = await createListingMutation.mutateAsync(payload);
      const createdListingId =
        (createdListing as any)?.id ||
        (createdListing as any)?.data?.id ||
        (createdListing as any)?.data?.data?.id ||
        (createdListing as any)?.listing?.id;

      if (selectedPlan === "featured") {
        if (!createdListingId) {
          toast.error(
            "Listing created, but listing ID was not returned for checkout.",
          );
          router.push("/seller/my-listing");
          return;
        }

        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : "https://tprice-frontend.vercel.app";

        try {
          const checkoutRes = await createCheckoutMutation.mutateAsync({
            type: "FEATURED_LISTING",
            targetId: String(createdListingId),
            successUrl: `${origin}/payment/success`,
            cancelUrl: `${origin}/payment/cancel`,
          });

          const checkoutUrl =
            checkoutRes?.checkoutUrl ||
            (checkoutRes as any)?.data?.checkoutUrl ||
            (checkoutRes as any)?.url;

          if (checkoutUrl) {
            toast.success(
              "Listing created! Redirecting to Stripe checkout for VIP Featured promotion...",
            );
            window.location.assign(checkoutUrl);
            return;
          } else {
            console.error("No checkoutUrl in response:", checkoutRes);
            toast.error(
              "Checkout session created, but no checkout URL was returned.",
            );
          }
        } catch (paymentErr: any) {
          console.error("Checkout session error:", paymentErr);
          const payMsg =
            paymentErr?.response?.data?.message ||
            paymentErr?.message ||
            "Failed to initiate checkout session.";
          toast.error(`Listing created, but payment error: ${payMsg}`);
        }
      } else {
        toast.success("Listing created successfully!");
      }

      router.push("/seller/my-listing");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create listing. Please check required fields.";
      toast.error(errMsg);
    }
  };

  // Categories & Brands extraction
  const categoriesList = categoriesResponse?.data || [];
  const brandsList = brandsResponse?.data || [];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-clash font-medium mb-6 text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" /> Basic Information
            </h3>

            {/* Listing Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                Listing Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2024 Ferrari SF90 Stradale Assetto Fiorano"
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                required
              />
            </div>

            {/* Category & Brand / Manufacturer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" /> Category{" "}
                  <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">
                      {isLoadingCategories
                        ? "Loading categories..."
                        : "Select Category"}
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

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" /> Brand /
                  Manufacturer
                </label>
                <div className="relative">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer"
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

            {/* Build Year */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Build Year
              </label>
              <input
                type="number"
                value={buildYear}
                onChange={(e) =>
                  setBuildYear(
                    e.target.value ? parseInt(e.target.value, 10) : "",
                  )
                }
                placeholder="e.g. 2024"
                className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
              />
            </div>

            {/* Location City & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Location City
                </label>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  placeholder="e.g. Miami"
                  className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Location Country
                </label>
                <input
                  type="text"
                  value={locationCountry}
                  onChange={(e) => setLocationCountry(e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* Off Market Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl">
              <div>
                <p className="text-sm font-semibold text-white">
                  Private Off-Market Listing
                </p>
                <p className="text-xs text-gray-400">
                  Keep this listing visible only to verified VIP buyers
                </p>
              </div>
              <input
                type="checkbox"
                checked={isOffMarket}
                onChange={(e) => setIsOffMarket(e.target.checked)}
                className="w-5 h-5 rounded border-[#2C2C2E] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-clash font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Specifications
                  System
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Add dynamic key-value specifications for your luxury item.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSpecRow}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black font-semibold text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
            </div>

            {/* Key-Value Pair Inputs */}
            <div className="space-y-3 pt-2">
              {specifications.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#2C2C2E] rounded-xl bg-[#1c1c1e]/50">
                  <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-400">
                    No specifications added yet
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Click &quot;Add Field&quot; or choose a preset above.
                  </p>
                </div>
              ) : (
                specifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl hover:border-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) =>
                          handleSpecChange(item.id, "key", e.target.value)
                        }
                        placeholder="Key (e.g. horsepower)"
                        className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors font-mono"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          handleSpecChange(item.id, "value", e.target.value)
                        }
                        placeholder="Value (e.g. 986)"
                        className="w-full bg-[#111113] border border-[#2C2C2E] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(item.id)}
                      className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer self-end md:self-center shrink-0"
                      title="Remove specification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-clash font-medium text-white flex items-center gap-2 mb-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Media Gallery
            </h3>

            {/* Dropzone & Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl aspect-16/6 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-primary/50 hover:bg-[#252528]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {uploadMediaMutation.isPending ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm font-medium text-primary">
                    Uploading image to cloud media service...
                  </p>
                  <p className="text-xs text-gray-500">Please wait</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 bg-[#111113] border border-[#2C2C2E] rounded-full flex items-center justify-center text-primary shadow-md">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-base">
                      Click to browse or drag & drop high-resolution images
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Supports JPG, PNG, WEBP (Max 10MB each)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Images Preview Grid */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Uploaded Media ({mediaList.length})
              </label>

              {mediaList.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No images uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaList.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl border border-[#2C2C2E] bg-[#1c1c1e] overflow-hidden group shadow-md"
                    >
                      <img
                        src={item.url}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[10px] text-primary font-mono font-bold">
                        #{item.displayOrder}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 backdrop-blur-md hover:bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-clash font-medium text-white flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" /> Pricing & Sale
              Type
            </h3>

            {/* Sale Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "FIXED_PRICE",
                  title: "Fixed Price",
                  desc: "Set a specific asking price",
                },
                {
                  id: "AUCTION",
                  title: "Auction",
                  desc: "Set starting bid and auction end date",
                },
                {
                  id: "PRIVATE_SALE",
                  title: "Private Sale",
                  desc: "Price on Application (POA)",
                },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSaleType(type.id as any)}
                  className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                    saleType === type.id
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-gray-600"
                  }`}
                >
                  <span
                    className={`font-semibold text-sm mb-1 ${
                      saleType === type.id ? "text-primary" : "text-white"
                    }`}
                  >
                    {type.title}
                  </span>
                  <span className="text-gray-400 text-xs">{type.desc}</span>
                </button>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asking Price */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Asking Price ({currency}){" "}
                  {saleType === "FIXED_PRICE" ? (
                    <span className="text-primary">*</span>
                  ) : (
                    <span className="text-gray-500 font-normal normal-case text-xs">
                      (Optional for Private Sale)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="625000"
                    className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                  />
                </div>
              </div>

              {/* Starting Bid if Auction */}
              {saleType === "AUCTION" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Starting Bid ({currency}){" "}
                      <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                        placeholder="500000"
                        className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl pl-8 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Auction
                      Ends At
                    </label>
                    <DatePicker
                      selected={auctionEndsAt ? new Date(auctionEndsAt) : null}
                      onChange={(date: Date | null) => {
                        if (date) {
                          setAuctionEndsAt(date.toISOString());
                        } else {
                          setAuctionEndsAt("");
                        }
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select date and time"
                      minDate={new Date()}
                      className="w-full bg-[#1c1c1e] border border-[#2C2C2E] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/60 transition-colors shadow-inner cursor-pointer"
                      wrapperClassName="w-full"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Allow Counter Offers - Only for FIXED_PRICE */}
            {saleType === "FIXED_PRICE" && (
              <div className="flex items-center gap-3 bg-[#1c1c1e] border border-[#2C2C2E] p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="allowCounterOffers"
                  checked={allowCounterOffers}
                  onChange={(e) => setAllowCounterOffers(e.target.checked)}
                  className="w-4 h-4 rounded border-[#2C2C2E] text-primary focus:ring-primary accent-[#E78F23] cursor-pointer"
                />
                <label
                  htmlFor="allowCounterOffers"
                  className="text-xs font-semibold text-gray-200 cursor-pointer"
                >
                  Allow potential buyers to submit counter-offers
                </label>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/20 text-primary">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-clash font-medium text-white mb-1">
                Review & Confirm Listing
              </h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto">
                Review listing details and choose visibility package before
                submission.
              </p>
            </div>

            {/* Listing Details Card Summary */}
            <div className="p-5 bg-[#1c1c1e] border border-[#2C2C2E] rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C2C2E] pb-3">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {title || "Untitled Listing"}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Category:{" "}
                    <span className="text-primary font-semibold">
                      {category || "Unassigned"}
                    </span>{" "}
                    {brand && `• Brand: ${brand}`}
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-lg">
                  {currency}{" "}
                  {askingPrice ? Number(askingPrice).toLocaleString() : "0"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Sale Type</span>
                  <span className="text-white font-semibold">{saleType}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Build Year</span>
                  <span className="text-white font-semibold">
                    {buildYear || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Specifications</span>
                  <span className="text-white font-semibold">
                    {specifications.filter((s) => s.key).length} keys
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Uploaded Media</span>
                  <span className="text-white font-semibold">
                    {mediaList.length} files
                  </span>
                </div>
              </div>
            </div>

            {/* Plans Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Standard Plan */}
              <div
                onClick={() => setSelectedPlan("standard")}
                className={`relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                  selectedPlan === "standard"
                    ? "bg-[#1c1c1e] border-primary ring-1 ring-primary/30"
                    : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 transition-colors ${
                      selectedPlan === "standard"
                        ? "text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {selectedPlan === "standard" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-clash font-medium text-white">
                      Standard Listing (Free)
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      List your luxury item on marketplace standard queue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Plan */}
              <div
                onClick={() => setSelectedPlan("featured")}
                className={`relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                  selectedPlan === "featured"
                    ? "bg-[#1c1c1e] border-primary ring-1 ring-primary/30"
                    : "bg-[#1c1c1e] border-[#2C2C2E] hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 transition-colors ${
                      selectedPlan === "featured"
                        ? "text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {selectedPlan === "featured" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-clash font-medium text-white">
                      Featured Listing (VIP)
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      Priority placement for higher buyer conversion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 relative z-0 max-w-4xl mx-auto pb-12">
      {/* Header Section */}
      <AnimationWrapper type="fade-down" duration={0.5}>
        <div className="mb-6">
          <h2 className="text-[40px] font-clash font-medium tracking-tight text-white">
            Create New Listing
          </h2>
          <p className="text-gray-400 mt-1 text-base">
            Add your luxury item to the marketplace catalog.
          </p>
        </div>
      </AnimationWrapper>

      <AnimationWrapper type="fade-up" duration={0.6} delay={0.1}>
        <div
          className="bg-[#1C1C1E] p-6 md:p-10 rounded-2xl border border-[#2C2C2E] shadow-2xl overflow-hidden"
          style={{
            boxShadow: "0 0 50px -12px rgba(178, 114, 31, 0.15)",
          }}
        >
          {/* Progress Section */}
          <div className="mb-8">
            <div className="w-full bg-[#111113] h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>

            <div className="justify-between items-center text-[13px] font-medium hidden md:flex px-2">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`transition-colors duration-300 cursor-default ${
                    index <= currentStep
                      ? "text-primary font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {index + 1}. {step}
                </span>
              ))}
            </div>

            {/* Mobile step indicator */}
            <div className="md:hidden text-center text-primary font-medium text-sm">
              Step {currentStep + 1}: {steps[currentStep]}
            </div>
          </div>

          {/* Form Context Container */}
          <div className="bg-[#111113]/50 rounded-2xl p-6 md:p-8 border border-[#2C2C2E]/60 min-h-[420px]">
            <AnimationWrapper key={currentStep} type="zoom" duration={0.4}>
              {renderStepContent()}
            </AnimationWrapper>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#2C2C2E]">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-[#2C2C2E] rounded-xl text-gray-300 text-sm font-medium hover:bg-[#2C2C2E] hover:text-white transition-all duration-300 group cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmitListing}
                disabled={
                  createListingMutation.isPending ||
                  createCheckoutMutation.isPending ||
                  uploadMediaMutation.isPending
                }
                className="flex items-center gap-2 px-8 py-3 bg-primary text-[#111113] rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 ml-auto"
              >
                {createListingMutation.isPending ||
                createCheckoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                    {selectedPlan === "featured"
                      ? "Processing & Redirecting..."
                      : "Submitting Listing..."}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    Submit Listing
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={uploadMediaMutation.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-[#111113] rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-primary/20 group cursor-pointer ml-auto disabled:opacity-50"
              >
                Next Step
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
