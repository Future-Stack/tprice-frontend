"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  Tag,
  Layers,
  Briefcase,
  Calendar,
  MapPin,
  Sparkles,
  DollarSign,
  Clock,
  UploadCloud,
  ImageIcon,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Edit2,
  Link as LinkIcon,
} from "lucide-react";
import { ListingItem, UpdateListingInput } from "@/lib/api/listings";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useUpdateListingMutation } from "@/hooks/useListings";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { toast } from "sonner";

interface UpdateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingItem | null;
}

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

interface UploadedMediaItem {
  id?: string;
  url: string;
  type: string;
  displayOrder: number;
}

export default function UpdateListingModal({
  isOpen,
  onClose,
  listing,
}: UpdateListingModalProps) {
  // Category and Brand Queries
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useGetBrandsQuery({ limit: 100 });

  // Mutations
  const updateListingMutation = useUpdateListingMutation();
  const uploadMediaMutation = useUploadMediaMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Tabs State
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "specs" | "media">("general");

  // Form Field States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [buildYear, setBuildYear] = useState<number | "">(2024);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [isOffMarket, setIsOffMarket] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Pricing & Sale Type States
  const [saleType, setSaleType] = useState<"FIXED_PRICE" | "AUCTION" | "PRIVATE">("FIXED_PRICE");
  const [askingPrice, setAskingPrice] = useState<string>("");
  const [startingBid, setStartingBid] = useState<string>("");
  const [auctionEndsAt, setAuctionEndsAt] = useState<string>("");
  const [currency, setCurrency] = useState("USD");
  const [allowCounterOffers, setAllowCounterOffers] = useState(true);

  // Specifications State
  const [specifications, setSpecifications] = useState<KeyValuePair[]>([]);

  // Media List State
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [directImageUrl, setDirectImageUrl] = useState("");
  const [editingMediaIndex, setEditingMediaIndex] = useState<number | null>(null);
  const [editingMediaUrl, setEditingMediaUrl] = useState("");

  // Populate form state when listing prop changes
  useEffect(() => {
    if (listing) {
      setTitle(listing.title || "");
      setCategory(listing.category || "");
      setBrand(listing.brand || "");
      setBuildYear(listing.buildYear ?? 2024);
      setLocationCity(listing.locationCity || "");
      setLocationCountry(listing.locationCountry || "");
      setIsOffMarket(Boolean(listing.isOffMarket));
      setIsFeatured(Boolean(listing.isFeatured));

      setSaleType(
        (listing.saleType as "FIXED_PRICE" | "AUCTION" | "PRIVATE") || "FIXED_PRICE"
      );
      setAskingPrice(
        listing.askingPrice !== undefined && listing.askingPrice !== null
          ? String(listing.askingPrice)
          : ""
      );
      setStartingBid(listing.startingBid ? String(listing.startingBid) : "");
      setAuctionEndsAt(listing.auctionEndsAt || "");
      setCurrency(listing.currency || "USD");
      setAllowCounterOffers(listing.allowCounterOffers !== false);

      // Parse specifications
      const specsList: KeyValuePair[] = [];
      if (listing.specifications) {
        let specsObj: Record<string, any> = {};
        if (typeof listing.specifications === "string") {
          try {
            specsObj = JSON.parse(listing.specifications);
          } catch {
            specsObj = {};
          }
        } else if (typeof listing.specifications === "object") {
          specsObj = listing.specifications;
        }

        Object.entries(specsObj).forEach(([k, v], idx) => {
          specsList.push({
            id: `spec-${idx}-${Date.now()}`,
            key: k,
            value: v !== undefined && v !== null ? String(v) : "",
          });
        });
      }
      setSpecifications(specsList);

      // Populate media
      if (listing.media && Array.isArray(listing.media)) {
        setMediaList(
          listing.media.map((m, idx) => ({
            id: m.id,
            url: m.url,
            type: m.type || "IMAGE",
            displayOrder: m.displayOrder ?? idx + 1,
          }))
        );
      } else {
        setMediaList([]);
      }
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const categoriesList = categoriesResponse?.data || [];
  const brandsList = brandsResponse?.data || [];

  // Specifications Handlers
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

  // Media Handlers
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

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    });
  };

  const handleSetCoverMedia = (index: number) => {
    if (index === 0) return;
    setMediaList((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      const updated = [target, ...rest];
      return updated.map((m, idx) => ({ ...m, displayOrder: idx + 1 }));
    });
    toast.success("Cover image updated!");
  };

  const handleMoveMedia = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;
    setMediaList((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated.map((m, idx) => ({ ...m, displayOrder: idx + 1 }));
    });
  };

  const handleAddDirectUrl = () => {
    if (!directImageUrl.trim()) {
      toast.error("Please enter an image URL.");
      return;
    }
    setMediaList((prev) => [
      ...prev,
      {
        url: directImageUrl.trim(),
        type: "IMAGE",
        displayOrder: prev.length + 1,
      },
    ]);
    setDirectImageUrl("");
    toast.success("Image URL added to gallery!");
  };

  const handleSaveMediaUrlEdit = (index: number) => {
    if (!editingMediaUrl.trim()) {
      toast.error("Image URL cannot be empty.");
      return;
    }
    setMediaList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, url: editingMediaUrl.trim() } : item
      )
    );
    setEditingMediaIndex(null);
    setEditingMediaUrl("");
    toast.success("Image URL updated successfully!");
  };

  // Form Validation
  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error("Please enter a listing title.");
      setActiveTab("general");
      return false;
    }
    if (!category.trim()) {
      toast.error("Please select a category.");
      setActiveTab("general");
      return false;
    }

    if (saleType === "FIXED_PRICE" || saleType === "PRIVATE") {
      if (askingPrice === "" || isNaN(Number(askingPrice)) || Number(askingPrice) <= 0) {
        toast.error("Please enter a valid asking price greater than 0.");
        setActiveTab("pricing");
        return false;
      }
    }

    if (saleType === "AUCTION") {
      if (startingBid === "" || isNaN(Number(startingBid)) || Number(startingBid) <= 0) {
        toast.error("Please enter a valid starting bid greater than 0.");
        setActiveTab("pricing");
        return false;
      }
    }

    return true;
  };

  // Submit Handler (PATCH /api/v1/listings/{id})
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert specifications key-value list to JSON string
    const specsObj: Record<string, any> = {};
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

    const specificationsJson =
      Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : undefined;

    const askingPriceNum = askingPrice
      ? Number(askingPrice)
      : saleType === "AUCTION" && startingBid
        ? Number(startingBid)
        : 0;

    const payload: UpdateListingInput = {
      title: title.trim(),
      category: category.trim(),
      brand: brand.trim() || undefined,
      buildYear: buildYear ? Number(buildYear) : undefined,
      locationCity: locationCity.trim() || undefined,
      locationCountry: locationCountry.trim() || undefined,
      isOffMarket,
      isFeatured,
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
      await updateListingMutation.mutateAsync({
        id: listing.id,
        data: payload,
      });
      toast.success("Listing updated successfully!");
      onClose();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update listing. Please check form fields.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#1F1F1F] bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E78F23]/10 border border-[#E78F23]/20 rounded-xl text-[#E78F23]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-clash text-white">Update Listing</h2>
              <p className="text-xs text-gray-400 font-medium">
                Edit details for <span className="text-[#E78F23] font-semibold">{listing.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-8 pt-4 border-b border-[#1F1F1F] bg-[#0A0A0A] overflow-x-auto scrollbar-hide">
          {[
            { id: "general", label: "General Info", icon: Tag },
            { id: "pricing", label: "Pricing & Sale", icon: DollarSign },
            { id: "specs", label: "Specifications", icon: Sparkles },
            { id: "media", label: "Media Gallery", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${isActive
                  ? "border-[#E78F23] text-[#E78F23] bg-[#E78F23]/5"
                  : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: GENERAL INFO */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-fade-in">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  Title <span className="text-[#E78F23]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2024 Ferrari SF90 Stradale Assetto Fiorano"
                  className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E78F23]/60 transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#E78F23]" /> Category{" "}
                  <span className="text-[#E78F23]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E78F23]/60 transition-all cursor-pointer"
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
              </div>

              {/* Brand & Build Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#E78F23]" /> Brand / Manufacturer
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E78F23]/60 transition-all cursor-pointer"
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
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E78F23]" /> Build Year
                  </label>
                  <input
                    type="number"
                    value={buildYear}
                    onChange={(e) =>
                      setBuildYear(e.target.value ? parseInt(e.target.value, 10) : "")
                    }
                    placeholder="e.g. 2024"
                    className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E78F23]/60 transition-all"
                  />
                </div>
              </div>

              {/* Location City & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E78F23]" /> Location City
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. Miami"
                    className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E78F23]/60 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Location Country
                  </label>
                  <input
                    type="text"
                    value={locationCountry}
                    onChange={(e) => setLocationCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E78F23]/60 transition-all"
                  />
                </div>
              </div>

              {/* Toggles: Off Market & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-4 bg-[#141414] border border-[#2A2A2A] rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">Private Off-Market</p>
                    <p className="text-[11px] text-gray-400">VIP buyers only</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isOffMarket}
                    onChange={(e) => setIsOffMarket(e.target.checked)}
                    className="w-4 h-4 rounded border-[#2D2D2D] accent-[#E78F23] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#141414] border border-[#2A2A2A] rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-white">Featured Item</p>
                    <p className="text-[11px] text-gray-400">Highlight listing</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-[#2D2D2D] accent-[#E78F23] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & SALE TYPE */}
          {activeTab === "pricing" && (
            <div className="space-y-6 animate-fade-in">
              {/* Sale Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Sale Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "FIXED_PRICE", title: "Fixed Price" },
                    { id: "AUCTION", title: "Auction" },
                    { id: "PRIVATE", title: "Private Sale" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSaleType(type.id as any)}
                      className={`p-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${saleType === type.id
                        ? "border-[#E78F23] bg-[#E78F23]/10 text-[#E78F23]"
                        : "border-[#2D2D2D] bg-[#141414] text-gray-400 hover:text-white"
                        }`}
                    >
                      {type.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(saleType === "FIXED_PRICE" || saleType === "PRIVATE") && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Asking Price ({currency}) <span className="text-[#E78F23]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                        placeholder="625000"
                        className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E78F23]/60 transition-all"
                      />
                    </div>
                  </div>
                )}

                {saleType === "AUCTION" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Starting Bid ({currency}) <span className="text-[#E78F23]">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          value={startingBid}
                          onChange={(e) => setStartingBid(e.target.value)}
                          placeholder="500000"
                          className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#E78F23]/60 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E78F23]" /> Auction Ends At (ISO Date)
                      </label>
                      <input
                        type="text"
                        value={auctionEndsAt}
                        onChange={(e) => setAuctionEndsAt(e.target.value)}
                        placeholder="2026-12-31T23:59:59.000Z"
                        className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#E78F23]/60 transition-all"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E78F23]/60 transition-all cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              {saleType === "FIXED_PRICE" && (
                <div className="flex items-center gap-3 bg-[#141414] border border-[#2A2A2A] p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="modalAllowCounterOffers"
                    checked={allowCounterOffers}
                    onChange={(e) => setAllowCounterOffers(e.target.checked)}
                    className="w-4 h-4 rounded border-[#2D2D2D] accent-[#E78F23] cursor-pointer"
                  />
                  <label
                    htmlFor="modalAllowCounterOffers"
                    className="text-xs font-semibold text-gray-200 cursor-pointer"
                  >
                    Allow buyers to submit counter offers
                  </label>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Item Specifications</h4>
                  <p className="text-xs text-gray-400">
                    Add key-value metadata (e.g. horsepower, engine, mileage, exteriorColor)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSpecRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E78F23]/10 border border-[#E78F23]/30 text-[#E78F23] hover:bg-[#E78F23] hover:text-black font-bold text-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Key-Value
                </button>
              </div>

              <div className="space-y-3">
                {specifications.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#2A2A2A] rounded-xl bg-[#121212]">
                    <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-400">
                      No specifications specified
                    </p>
                  </div>
                ) : (
                  specifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-[#141414] border border-[#2A2A2A] rounded-xl"
                    >
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => handleSpecChange(item.id, "key", e.target.value)}
                        placeholder="Key (e.g. engine)"
                        className="flex-1 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E78F23]"
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleSpecChange(item.id, "value", e.target.value)}
                        placeholder="Value (e.g. 4.0L V8 Twin-Turbo)"
                        className="flex-1 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E78F23]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove specification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA GALLERY */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-fade-in">
              {/* File Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = Array.from(e.dataTransfer.files || []);
                  files.forEach((file) => handleFileUpload(file));
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging
                  ? "border-[#E78F23] bg-[#E78F23]/10"
                  : "border-[#2D2D2D] bg-[#141414] hover:border-[#E78F23]/50"
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
                  <div className="flex items-center justify-center gap-2 text-[#E78F23] text-sm py-2 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading image to cloud media service...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="w-8 h-8 text-[#E78F23] mx-auto" />
                    <p className="text-xs text-gray-300 font-bold">
                      Click or drag images to upload new photos
                    </p>
                    <p className="text-[11px] text-gray-500">JPG, PNG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              {/* Direct Image URL Input */}
              <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-xl space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#E78F23]" /> Add Media by URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={directImageUrl}
                    onChange={(e) => setDirectImageUrl(e.target.value)}
                    placeholder="https://cdn.exoticworld.com/listings/photo.jpg"
                    className="flex-1 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E78F23]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirectUrl}
                    className="px-4 py-2 bg-[#E78F23] hover:bg-[#E78F23]/90 text-black font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add URL
                  </button>
                </div>
              </div>

              {/* Media Items List & Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Media Items ({mediaList.length})
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    First image is set as Cover Photo (#1)
                  </span>
                </div>

                {mediaList.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#2A2A2A] rounded-xl bg-[#121212]">
                    <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-400">No media items added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaList.map((m, idx) => {
                      const isCover = idx === 0;
                      const isEditing = editingMediaIndex === idx;

                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl border bg-[#141414] overflow-hidden flex flex-col transition-all ${isCover ? "border-[#E78F23] ring-1 ring-[#E78F23]/40" : "border-[#2D2D2D]"
                            }`}
                        >
                          {/* Image Preview & Cover Badge */}
                          <div className="relative aspect-16/10 w-full bg-black">
                            <img
                              src={m.url}
                              alt={`Media ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                              <span className="px-2 py-0.5 bg-black/80 rounded text-[10px] text-[#E78F23] font-mono font-bold">
                                #{m.displayOrder}
                              </span>
                              {isCover && (
                                <span className="px-2 py-0.5 bg-[#E78F23] text-black font-bold rounded text-[10px] flex items-center gap-1 shadow-md">
                                  <Star className="w-3 h-3 fill-black" /> Cover
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-rose-600 rounded-lg text-white transition-all cursor-pointer z-10"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Media Controls Bar */}
                          <div className="p-3 bg-[#171717] border-t border-[#262626] flex flex-col gap-2">
                            {isEditing ? (
                              <div className="flex flex-col gap-1.5">
                                <input
                                  type="url"
                                  value={editingMediaUrl}
                                  onChange={(e) => setEditingMediaUrl(e.target.value)}
                                  className="w-full bg-[#1A1A1A] border border-[#E78F23] rounded px-2.5 py-1 text-xs text-white"
                                  placeholder="Image URL"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingMediaIndex(null)}
                                    className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveMediaUrlEdit(idx)}
                                    className="px-2 py-1 bg-[#E78F23] text-xs font-bold rounded text-black"
                                  >
                                    Save URL
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-xs">
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverMedia(idx)}
                                    className="text-[11px] font-bold text-[#E78F23] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Star className="w-3 h-3" /> Make Cover
                                  </button>
                                )}
                                {isCover && (
                                  <span className="text-[11px] font-medium text-emerald-400">
                                    Primary Display
                                  </span>
                                )}

                                <div className="flex items-center gap-1.5 ml-auto">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMediaIndex(idx);
                                      setEditingMediaUrl(m.url);
                                    }}
                                    className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10"
                                    title="Edit URL"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveMedia(idx, "up")}
                                    disabled={idx === 0}
                                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/10"
                                    title="Move left/up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveMedia(idx, "down")}
                                    disabled={idx === mediaList.length - 1}
                                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/10"
                                    title="Move right/down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#1F1F1F]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-[#2D2D2D] text-gray-300 hover:text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateListingMutation.isPending || uploadMediaMutation.isPending}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#E78F23] hover:bg-[#E78F23]/90 text-black font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(231,143,35,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {updateListingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
