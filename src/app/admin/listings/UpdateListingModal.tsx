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
import { useGetModelsQuery } from "@/hooks/useModels";
import { useGetTrimsQuery } from "@/hooks/useTrims";
import { useUpdateListingMutation } from "@/hooks/useListings";
import { useUploadMultipleMediaMutation } from "@/hooks/useMedia";
import { toast } from "sonner";
import SortableMediaGallery, {
  UploadedMediaItem,
} from "@/components/SortableMediaGallery";

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

export default function UpdateListingModal({
  isOpen,
  onClose,
  listing,
}: UpdateListingModalProps) {
  // Category and Brand Queries
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResponse?.data || [];

  // Mutations
  const updateListingMutation = useUpdateListingMutation();
  const uploadMediaMutation = useUploadMultipleMediaMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Tabs State
  const [activeTab, setActiveTab] = useState<
    "general" | "pricing" | "specs" | "media"
  >("general");

  // Form Field States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [buildYear, setBuildYear] = useState<number | "">(2024);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [isOffMarket, setIsOffMarket] = useState(false);

  const selectedCategory = categoriesList.find(
    (cat) => cat.name === category || cat.id === category,
  );
  const selectedCategoryId = selectedCategory?.id;

  const { data: brandsResponse, isLoading: isLoadingBrands } = useGetBrandsQuery(
    selectedCategoryId
      ? { categoryId: selectedCategoryId, limit: 100 }
      : undefined,
    {
      enabled: Boolean(selectedCategoryId),
    },
  );
  const brandsList = selectedCategoryId ? brandsResponse?.data || [] : [];

  // Selected Brand & dynamic Model query
  const selectedBrand = brandsList.find(
    (b) => b.name === brand || b.id === brand,
  );
  const selectedBrandId = selectedBrand?.id;

  const { data: modelsResponse, isLoading: isLoadingModels } = useGetModelsQuery(
    selectedBrandId
      ? { brandId: selectedBrandId, limit: 100 }
      : undefined,
    {
      enabled: Boolean(selectedBrandId),
    },
  );
  const modelsList = selectedBrandId ? modelsResponse?.data || [] : [];

  // Selected Model & dynamic Trim query
  const selectedModel = modelsList.find(
    (m) => m.name === model || m.id === model,
  );
  const selectedModelId = selectedModel?.id;

  const { data: trimsResponse, isLoading: isLoadingTrims } = useGetTrimsQuery(
    selectedModelId
      ? { modelId: selectedModelId, limit: 100 }
      : undefined,
    {
      enabled: Boolean(selectedModelId),
    },
  );
  const trimsList = selectedModelId ? trimsResponse?.data || [] : [];

  // Selected Trim
  const selectedTrim = trimsList.find(
    (t) => t.name === trim || t.id === trim,
  );
  const selectedTrimId = selectedTrim?.id;

  // Pricing & Sale Type States
  const [saleType, setSaleType] = useState<
    "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE"
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
      setModel(listing.model || (listing.specifications as any)?.model || "");
      setTrim(listing.trim || (listing.specifications as any)?.trim || "");
      setBuildYear(listing.buildYear ?? 2024);
      setLocationCity(listing.locationCity || "");
      setLocationCountry(listing.locationCountry || "");
      setIsOffMarket(Boolean(listing.isOffMarket));

      const rawSaleType = (listing.saleType as string || "").toUpperCase();
      const initialSaleType =
        rawSaleType === "PRIVATE" || rawSaleType === "PRIVATE_SALE"
          ? "PRIVATE_SALE"
          : (rawSaleType as "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE") ||
          "FIXED_PRICE";
      setSaleType(initialSaleType);
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
            id: m.id || `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
            url: m.url,
            type: m.type || "IMAGE",
            displayOrder: m.displayOrder ?? idx + 1,
            isCover: Boolean(
              m.isCover ||
              (idx === 0 && listing.media.every((x: any) => !x.isCover)),
            ),
          })),
        );
      } else {
        setMediaList([]);
      }
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

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
  const handleFilesUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not a valid image file.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds maximum allowed size (10MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      const res = await uploadMediaMutation.mutateAsync({
        files: validFiles,
        folder: "exoticworld/listings",
      });

      if (res && res.length > 0) {
        setMediaList((prev) => {
          const isFirst = prev.length === 0;
          const newItems = res.map((item, idx) => ({
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
            : `${res.length} images uploaded successfully!`,
        );
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload image(s).";
      toast.error(errMsg);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesUpload(files);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      const wasCover = prev[index]?.isCover;
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((item, idx) => ({
        ...item,
        displayOrder: idx + 1,
        isCover: wasCover ? idx === 0 : Boolean(item.isCover),
      }));
    });
  };

  const handleSetCoverMedia = (index: number) => {
    setMediaList((prev) =>
      prev.map((item, idx) => ({
        ...item,
        isCover: idx === index,
      })),
    );
    toast.success("Cover image updated!");
  };

  const handleAddDirectUrl = () => {
    if (!directImageUrl.trim()) {
      toast.error("Please enter an image URL.");
      return;
    }
    setMediaList((prev) => {
      const isFirst = prev.length === 0;
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          url: directImageUrl.trim(),
          type: "IMAGE",
          displayOrder: prev.length + 1,
          isCover: isFirst || prev.every((item) => !item.isCover),
        },
      ];
    });
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

    if (saleType === "FIXED_PRICE") {
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
      categoryId: selectedCategoryId || undefined,
      brandId: selectedBrandId || undefined,
      modelId: selectedModelId || undefined,
      trimId: selectedTrimId || undefined,
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
            isCover: Boolean(
              m.isCover || (mediaList.every((x) => !x.isCover) && idx === 0),
            ),
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
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${isActive
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
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setBrand("");
                      setModel("");
                      setTrim("");
                    }}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors"
                    required
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Brand / Manufacturer
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      setModel("");
                      setTrim("");
                    }}
                    disabled={!category || isLoadingBrands}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors disabled:opacity-50"
                  >
                    <option value="">
                      {!category
                        ? "Select Category First"
                        : isLoadingBrands
                          ? "Loading brands..."
                          : brandsList.length === 0
                            ? "No brands available"
                            : "Select Brand"}
                    </option>
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setTrim("");
                    }}
                    disabled={!brand || isLoadingModels}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors disabled:opacity-50"
                  >
                    <option value="">
                      {!brand
                        ? "Select Brand First"
                        : isLoadingModels
                          ? "Loading models..."
                          : modelsList.length === 0
                            ? "No models available"
                            : "Select Model"}
                    </option>
                    {modelsList.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    Trim / Edition
                  </label>
                  <select
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    disabled={!model || isLoadingTrims}
                    className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#EAB308] transition-colors disabled:opacity-50"
                  >
                    <option value="">
                      {!model
                        ? "Select Model First"
                        : isLoadingTrims
                          ? "Loading trims..."
                          : trimsList.length === 0
                            ? "No trims available"
                            : "Select Trim"}
                    </option>
                    {trimsList.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
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
                    { id: "PRIVATE_SALE", label: "Private Treaty" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSaleType(st.id as any)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${saleType === st.id
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
                {(saleType === "FIXED_PRICE" || saleType === "PRIVATE_SALE") && (
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
                  const files = Array.from(e.dataTransfer.files || []);
                  if (files.length > 0) {
                    handleFilesUpload(files);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${isDragging
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
                {uploadMediaMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2 text-[#EAB308] text-sm py-2 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading images to cloud media service...</span>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
                <SortableMediaGallery
                  mediaList={mediaList}
                  setMediaList={setMediaList}
                  onRemove={handleRemoveMedia}
                  onSetCover={handleSetCoverMedia}
                />
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
