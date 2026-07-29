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
import Image from "next/image";

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
  const [activeTab, setActiveTab] = useState<
    "general" | "pricing" | "specs" | "media"
  >("general");

  // Form Field States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [buildYear, setBuildYear] = useState<number | "">(2024);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [isOffMarket, setIsOffMarket] = useState(false);

  // Pricing & Sale Type States
  const [saleType, setSaleType] = useState<
    "FIXED_PRICE" | "AUCTION" | "PRIVATE"
  >("FIXED_PRICE");
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
  const [editingMediaIndex, setEditingMediaIndex] = useState<number | null>(
    null,
  );
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

      setSaleType(
        (listing.saleType as "FIXED_PRICE" | "AUCTION" | "PRIVATE") ||
          "FIXED_PRICE",
      );
      setAskingPrice(
        listing.askingPrice !== undefined && listing.askingPrice !== null
          ? String(listing.askingPrice)
          : "",
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
          })),
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
        i === index ? { ...item, url: editingMediaUrl.trim() } : item,
      ),
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
      if (
        askingPrice === "" ||
        isNaN(Number(askingPrice)) ||
        Number(askingPrice) <= 0
      ) {
        toast.error("Please enter a valid asking price greater than 0.");
        setActiveTab("pricing");
        return false;
      }
    }

    if (saleType === "AUCTION") {
      if (
        startingBid === "" ||
        isNaN(Number(startingBid)) ||
        Number(startingBid) <= 0
      ) {
        toast.error("Please enter a valid starting bid greater than 0.");
        setActiveTab("pricing");
        return false;
      }
    }

    return true;
  };

  // Submit Handler
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
      saleType,
      allowCounterOffers:
        saleType === "FIXED_PRICE" ? allowCounterOffers : false,
      askingPrice: askingPriceNum,
      startingBid:
        saleType === "AUCTION" && startingBid ? Number(startingBid) : undefined,
      auctionEndsAt:
        saleType === "AUCTION" && auctionEndsAt ? auctionEndsAt : undefined,
      currency,
      specifications: specificationsJson,
      media:
        mediaList.length > 0
          ? mediaList.map((m, idx) => ({
              url: m.url,
              type: m.type || "IMAGE",
              displayOrder: idx + 1,
            }))
          : undefined,
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
        "Failed to update listing.";
      toast.error(errMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-xl text-[#EAB308]">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans text-gray-100">Edit Listing</h2>
              <p className="text-xs text-gray-400">
                Update details for &quot;{listing.title}&quot;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={updateListingMutation.isPending}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Header */}
        <div className="px-6 border-b border-[#2A2A2A] bg-[#171717] flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "general", label: "General Info", icon: Tag },
            { id: "pricing", label: "Pricing & Sale", icon: DollarSign },
            { id: "specs", label: "Specifications", icon: Layers },
            { id: "media", label: "Media Gallery", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#EAB308] text-[#EAB308] bg-[#EAB308]/5"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === "media" && mediaList.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-[#EAB308]/20 text-[#EAB308] rounded-full font-bold">
                    {mediaList.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: GENERAL INFO */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2024 Ferrari 488 Spider"
                  className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
                    required
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Brand / Manufacturer
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
                  >
                    <option value="">Select Brand</option>
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Build Year
                  </label>
                  <input
                    type="number"
                    value={buildYear}
                    onChange={(e) =>
                      setBuildYear(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="2024"
                    min="1900"
                    max="2030"
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    City Location
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="Monaco"
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Country Location
                  </label>
                  <input
                    type="text"
                    value={locationCountry}
                    onChange={(e) => setLocationCountry(e.target.value)}
                    placeholder="France"
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl cursor-pointer hover:border-[#444] transition-colors">
                  <input
                    type="checkbox"
                    checked={isOffMarket}
                    onChange={(e) => setIsOffMarket(e.target.checked)}
                    className="w-4 h-4 accent-[#EAB308] rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-100 block">
                      Off-Market / Exclusive Deal
                    </span>
                    <span className="text-xs text-gray-400">
                      Mark this listing as off-market for VIP / private buyers only.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & SALE TYPE */}
          {activeTab === "pricing" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Sale Format <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "FIXED_PRICE", label: "Fixed Price" },
                    { id: "AUCTION", label: "Auction" },
                    { id: "PRIVATE", label: "Private Treaty" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSaleType(st.id as any)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        saleType === st.id
                          ? "bg-[#EAB308] text-black border-[#EAB308]"
                          : "bg-[#111111] border-[#333333] text-gray-300 hover:text-white"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(saleType === "FIXED_PRICE" || saleType === "PRIVATE") && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      Asking Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                        placeholder="295000"
                        min="0"
                        className="w-full bg-[#111111] border border-[#333333] rounded-xl pl-8 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                )}

                {saleType === "AUCTION" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">
                        Starting Bid <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          value={startingBid}
                          onChange={(e) => setStartingBid(e.target.value)}
                          placeholder="150000"
                          min="0"
                          className="w-full bg-[#111111] border border-[#333333] rounded-xl pl-8 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">
                        Auction End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          auctionEndsAt
                            ? new Date(auctionEndsAt).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) => setAuctionEndsAt(e.target.value)}
                        className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (AED)</option>
                  </select>
                </div>
              </div>

              {saleType === "FIXED_PRICE" && (
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl cursor-pointer hover:border-[#444] transition-colors">
                    <input
                      type="checkbox"
                      checked={allowCounterOffers}
                      onChange={(e) => setAllowCounterOffers(e.target.checked)}
                      className="w-4 h-4 accent-[#EAB308] rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-100 block">
                        Allow Counter Offers / Buyer Offers
                      </span>
                      <span className="text-xs text-gray-400">
                        Enable buyers to submit custom negotiation offers on this asset.
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">
                    Custom Specifications
                  </h3>
                  <p className="text-xs text-gray-400">
                    Add key-value properties (e.g. Mileage, Engine, Color, Condition)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpecRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30 hover:bg-[#EAB308] hover:text-black rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Property</span>
                </button>
              </div>

              {specifications.length === 0 ? (
                <div className="py-8 text-center bg-[#111111] border border-[#2A2A2A] rounded-xl text-gray-400 text-xs">
                  No custom specifications added yet. Click &quot;Add Property&quot; to include details.
                </div>
              ) : (
                <div className="space-y-3">
                  {specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex items-center gap-3 bg-[#111111] p-2.5 border border-[#2A2A2A] rounded-xl"
                    >
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) =>
                          handleSpecChange(spec.id, "key", e.target.value)
                        }
                        placeholder="Feature name (e.g. Engine)"
                        className="flex-1 bg-[#1C1C1C] border border-[#333333] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#EAB308]"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecChange(spec.id, "value", e.target.value)
                        }
                        placeholder="Value (e.g. V8 Twin-Turbo)"
                        className="flex-1 bg-[#1C1C1C] border border-[#333333] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-[#EAB308]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(spec.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDIA GALLERY */}
          {activeTab === "media" && (
            <div className="space-y-6">
              {/* File Upload Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = Array.from(e.dataTransfer.files);
                  files.forEach((file) => handleFileUpload(file));
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  isDragging
                    ? "border-[#EAB308] bg-[#EAB308]/5"
                    : "border-[#333333] bg-[#111111] hover:border-[#555]"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-[#EAB308] mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-200">
                  Drag and drop listing images here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#EAB308] underline cursor-pointer hover:text-yellow-400"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPG, PNG, WEBP files up to 10MB each
                </p>
              </div>

              {/* Direct Image URL Add */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={directImageUrl}
                  onChange={(e) => setDirectImageUrl(e.target.value)}
                  placeholder="Or enter direct image URL (https://...)"
                  className="flex-1 bg-[#111111] border border-[#333333] rounded-xl px-4 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-[#EAB308]"
                />
                <button
                  type="button"
                  onClick={handleAddDirectUrl}
                  className="px-4 py-2.5 bg-[#EAB308] hover:bg-[#D9A506] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Add URL
                </button>
              </div>

              {/* Media Items List */}
              {mediaList.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500 border border-[#2A2A2A] rounded-xl bg-[#111111]">
                  No images attached yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaList.map((media, idx) => (
                    <div
                      key={idx}
                      className="relative group bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-4/3 w-full bg-[#1C1C1C]">
                        <Image
                          src={media.url}
                          alt={`Media ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />

                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-[#EAB308] text-black text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                            COVER
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-2 flex items-center justify-between text-[11px] bg-[#171717] border-t border-[#2A2A2A]">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverMedia(idx)}
                            className="text-xs text-[#EAB308] hover:underline cursor-pointer font-semibold"
                          >
                            Set Cover
                          </button>
                        )}
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleMoveMedia(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-white text-gray-400 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMedia(idx, "down")}
                            disabled={idx === mediaList.length - 1}
                            className="p-1 hover:text-white text-gray-400 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modal Actions Footer */}
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
