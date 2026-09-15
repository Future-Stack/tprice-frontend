"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import AnimationWrapper from "@/app/components/AnimationWrapper";
import { useGetCategoriesQuery } from "@/hooks/useCategories";
import { useGetBrandsQuery } from "@/hooks/useBrands";
import { useGetModelsQuery } from "@/hooks/useModels";
import { useGetTrimsQuery } from "@/hooks/useTrims";
import { useUploadMultipleMediaMutation } from "@/hooks/useMedia";
import { useCreateListingMutation, useFeaturedStatusQuery } from "@/hooks/useListings";
import { useCreateCheckoutSessionMutation } from "@/hooks/usePayments";
import { useDecodeVinMutation } from "@/hooks/useVehicles";
import { getPaymentReturnUrl } from "@/lib/api/payments";
import { toast } from "sonner";
import { UploadedMediaItem } from "@/components/SortableMediaGallery";
import {
  ListingWizardProps,
  KeyValuePair,
  SaleType,
  PlanType,
  WIZARD_STEPS,
} from "./types";
import { StepIndicator } from "./StepIndicator";
import { BasicInfoStep } from "./BasicInfoStep";
import { SpecificationsStep } from "./SpecificationsStep";
import { MediaStep } from "./MediaStep";
import { PricingStep } from "./PricingStep";
import { ReviewStep } from "./ReviewStep";

export function ListingWizard({ role = "dealer", redirectPath }: ListingWizardProps) {
  const router = useRouter();
  const defaultRedirect = role === "dealer" ? "/dealer/listing" : "/seller/my-listing";
  const finalRedirect = redirectPath || defaultRedirect;

  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [buildYear, setBuildYear] = useState<number | "">(2024);
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [isOffMarket, setIsOffMarket] = useState(false);
  const [vin, setVin] = useState("");

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResponse?.data || [];
  const selectedCategory = categoriesList.find((c) => c.name === category || c.id === category);
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

  const { data: featuredStatus } = useFeaturedStatusQuery();
  const hasActiveSubscription = Boolean(featuredStatus?.hasActiveSubscription);

  const uploadMediaMutation = useUploadMultipleMediaMutation();
  const createListingMutation = useCreateListingMutation();
  const createCheckoutMutation = useCreateCheckoutSessionMutation();
  const decodeVinMutation = useDecodeVinMutation();

  const [specifications, setSpecifications] = useState<KeyValuePair[]>([]);
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [saleType, setSaleType] = useState<SaleType>("FIXED_PRICE");
  const [askingPrice, setAskingPrice] = useState<string>("625000");
  const [startingBid, setStartingBid] = useState<string>("500000");
  const [auctionEndsAt, setAuctionEndsAt] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString();
  });
  const [currency] = useState("USD");
  const [allowCounterOffers, setAllowCounterOffers] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("standard");

  const minAuctionDate = useMemo(() => new Date(), []);
  const maxAuctionDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }, []);

  const handleAddSpecRow = () => {
    setSpecifications((prev) => [...prev, { id: Date.now().toString(), key: "", value: "" }]);
  };

  const handleSpecChange = (id: string, field: "key" | "value", val: string) => {
    setSpecifications((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  const handleRemoveSpecRow = (id: string) => {
    setSpecifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDecodeVin = async () => {
    const trimmedVin = vin.trim();
    if (!trimmedVin) {
      toast.error("Please enter a VIN number.");
      return;
    }
    try {
      const data = await decodeVinMutation.mutateAsync(trimmedVin);
      if (!data) {
        toast.error("No data found for this VIN.");
        return;
      }
      const newSpecs: KeyValuePair[] = [];
      const addedKeys = new Set<string>();

      const addSpec = (key: string, value: unknown) => {
        if (value !== null && value !== undefined && String(value).trim() !== "" && String(value).trim() !== "N/A") {
          const lowerKey = key.toLowerCase();
          if (!addedKeys.has(lowerKey)) {
            addedKeys.add(lowerKey);
            newSpecs.push({
              id: `${key}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              key,
              value: String(value).trim(),
            });
          }
        }
      };

      if (data.vin) addSpec("vin", data.vin);
      if (data.year) addSpec("year", data.year);
      if (data.make) addSpec("make", data.make);
      if (data.model) addSpec("model", data.model);
      if (data.trim) addSpec("trim", data.trim);

      setSpecifications(newSpecs);
      if (data.year && !buildYear) setBuildYear(data.year);
      if (data.make && !brand) {
        const matched = brandsList.find((b) => b.name.toLowerCase() === data.make?.toLowerCase());
        if (matched) setBrand(matched.name);
      }
      toast.success(`VIN decoded successfully! ${newSpecs.length} specifications populated.`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosErr?.response?.data?.message || axiosErr?.message || "Failed to decode VIN.");
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    try {
      const res = await uploadMediaMutation.mutateAsync({ files, folder: "exoticworld/listings" });
      if (res && res.length > 0) {
        const newItems: UploadedMediaItem[] = res.map((item, idx) => ({
          id: `media-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          url: item.url,
          type: "type" in item && typeof (item as { type?: string }).type === "string" ? (item as { type: string }).type : "IMAGE",
          displayOrder: mediaList.length + idx + 1,
          isCover: mediaList.length === 0 && idx === 0,
        }));
        setMediaList((prev) => [...prev, ...newItems]);
        toast.success(`${res.length} image(s) uploaded successfully!`);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosErr?.response?.data?.message || axiosErr?.message || "Failed to upload image(s).");
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index]?.isCover && updated.length > 0) updated[0].isCover = true;
      return updated;
    });
  };

  const handleSetCover = (index: number) => {
    setMediaList((prev) => prev.map((item, i) => ({ ...item, isCover: i === index })));
  };

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!title.trim()) { toast.error("Please enter a listing title."); return false; }
      if (!category) { toast.error("Please select a category."); return false; }
    }
    if (currentStep === 2 && mediaList.length === 0) {
      toast.error("Please upload at least one image."); return false;
    }
    if (currentStep === 3) {
      if (saleType === "FIXED_PRICE" && (!askingPrice || Number(askingPrice) <= 0)) {
        toast.error("Please enter a valid asking price."); return false;
      }
      if (saleType === "AUCTION") {
        if (!startingBid || Number(startingBid) <= 0) { toast.error("Please enter a valid starting bid."); return false; }
        if (!auctionEndsAt) { toast.error("Please set auction end date."); return false; }
      }
    }
    return true;
  };

  const handleSubmitListing = async () => {
    if (!validateCurrentStep()) return;

    const specsObject: Record<string, string | number> = {};
    specifications.forEach((item) => {
      const k = item.key.trim();
      const v = item.value.trim();
      if (k) specsObject[k] = v && !isNaN(Number(v)) ? Number(v) : v;
    });

    const askingPriceNum = askingPrice ? Number(askingPrice) : saleType === "AUCTION" && startingBid ? Number(startingBid) : 0;

    const payload = {
      title: title.trim(),
      categoryId: selectedCategoryId || undefined,
      brandId: selectedBrandId || undefined,
      modelId: selectedModelId || undefined,
      trimId: selectedTrimId || undefined,
      saleType,
      allowCounterOffers: saleType === "FIXED_PRICE" ? allowCounterOffers : false,
      askingPrice: askingPriceNum,
      startingBid: saleType === "AUCTION" && startingBid ? Number(startingBid) : undefined,
      auctionEndsAt: saleType === "AUCTION" && auctionEndsAt ? auctionEndsAt : undefined,
      currency: currency || "USD",
      isOffMarket,
      locationCity: locationCity.trim() || undefined,
      locationCountry: locationCountry.trim() || undefined,
      buildYear: buildYear ? Number(buildYear) : undefined,
      specifications: Object.keys(specsObject).length > 0 ? JSON.stringify(specsObject) : undefined,
      media: mediaList.map((m, idx) => ({
        url: m.url,
        type: m.type || "IMAGE",
        displayOrder: idx + 1,
        isCover: Boolean(m.isCover || (mediaList.every((x) => !x.isCover) && idx === 0)),
      })),
    };

    try {
      const createdListing = await createListingMutation.mutateAsync(payload);
      const resListing = createdListing as unknown as { id?: string; data?: { id?: string; data?: { id?: string } }; listing?: { id?: string } };
      const createdListingId = resListing?.id || resListing?.data?.id || resListing?.data?.data?.id || resListing?.listing?.id;

      if (!hasActiveSubscription && selectedPlan === "featured") {
        if (!createdListingId) {
          toast.error("Listing created, but listing ID was not returned for checkout.");
          router.push(finalRedirect);
          return;
        }

        try {
          const checkoutRes = await createCheckoutMutation.mutateAsync({
            type: "FEATURED_SINGLE_LISTING",
            targetId: String(createdListingId),
            successUrl: getPaymentReturnUrl("/payment/success"),
            cancelUrl: getPaymentReturnUrl("/payment/cancel"),
          });
          const resCheckout = checkoutRes as unknown as { checkoutUrl?: string; data?: { checkoutUrl?: string }; url?: string };
          const checkoutUrl = checkoutRes?.checkoutUrl || resCheckout?.data?.checkoutUrl || resCheckout?.url;
          if (checkoutUrl) {
            toast.success("Listing created! Redirecting to Stripe checkout for VIP promotion...");
            window.location.assign(checkoutUrl);
            return;
          }
          toast.error("Checkout session created, but no checkout URL was returned.");
        } catch (paymentErr: unknown) {
          const axiosErr = paymentErr as { response?: { data?: { message?: string } }; message?: string };
          toast.error(`Listing created, but payment error: ${axiosErr?.response?.data?.message || axiosErr?.message || "Failed to initiate checkout."}`);
        }
      } else {
        toast.success("Listing created successfully!");
      }

      router.push(finalRedirect);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosErr?.response?.data?.message || axiosErr?.message || "Failed to create listing. Please check required fields.");
    }
  };

  const isSubmitting = createListingMutation.isPending || createCheckoutMutation.isPending;

  return (
    <div className="min-h-screen text-white font-sans max-w-5xl mx-auto pb-16">
      <AnimationWrapper type="fade-down" duration={0.6}>
        <div className="mb-8">
          <h2 className="text-[40px] font-clash font-medium tracking-tight text-white">Create New Listing</h2>
          <p className="text-gray-400 mt-1 text-base">Add your luxury item to the marketplace catalog.</p>
        </div>
      </AnimationWrapper>

      <AnimationWrapper type="fade-up" duration={0.6} delay={0.1}>
        <div className="bg-[#1C1C1E] p-6 md:p-10 rounded-2xl border border-[#2C2C2E] shadow-2xl overflow-hidden" style={{ boxShadow: "0 0 50px -12px rgba(178, 114, 31, 0.15)" }}>
          <StepIndicator currentStep={currentStep} />

          <div className="bg-[#111113]/50 rounded-2xl p-6 md:p-8 border border-[#2C2C2E]/60 min-h-105">
            <AnimationWrapper key={currentStep} type="zoom" duration={0.4}>
              {currentStep === 0 && (
                <BasicInfoStep
                  title={title} setTitle={setTitle}
                  category={category} setCategory={setCategory}
                  brand={brand} setBrand={setBrand}
                  model={model} setModel={setModel}
                  trim={trim} setTrim={setTrim}
                  buildYear={buildYear} setBuildYear={setBuildYear}
                  locationCity={locationCity} setLocationCity={setLocationCity}
                  locationCountry={locationCountry} setLocationCountry={setLocationCountry}
                  isOffMarket={isOffMarket} setIsOffMarket={setIsOffMarket}
                  categoriesList={categoriesList} isLoadingCategories={isLoadingCategories}
                  brandsList={brandsList} isLoadingBrands={isLoadingBrands}
                  modelsList={modelsList} isLoadingModels={isLoadingModels}
                  trimsList={trimsList} isLoadingTrims={isLoadingTrims}
                />
              )}
              {currentStep === 1 && (
                <SpecificationsStep
                  vin={vin} setVin={setVin}
                  onDecodeVin={handleDecodeVin} isDecodingVin={decodeVinMutation.isPending}
                  specifications={specifications}
                  onAddSpecRow={handleAddSpecRow}
                  onSpecChange={handleSpecChange}
                  onRemoveSpecRow={handleRemoveSpecRow}
                  onClearAllSpecs={() => setSpecifications([])}
                />
              )}
              {currentStep === 2 && (
                <MediaStep
                  mediaList={mediaList} setMediaList={setMediaList}
                  onFilesUpload={handleFilesUpload} isUploading={uploadMediaMutation.isPending}
                  onRemoveMedia={handleRemoveMedia} onSetCover={handleSetCover}
                />
              )}
              {currentStep === 3 && (
                <PricingStep
                  saleType={saleType} setSaleType={setSaleType}
                  askingPrice={askingPrice} setAskingPrice={setAskingPrice}
                  startingBid={startingBid} setStartingBid={setStartingBid}
                  auctionEndsAt={auctionEndsAt} setAuctionEndsAt={setAuctionEndsAt}
                  currency={currency}
                  allowCounterOffers={allowCounterOffers} setAllowCounterOffers={setAllowCounterOffers}
                  selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}
                  hasActiveSubscription={hasActiveSubscription}
                  minAuctionDate={minAuctionDate} maxAuctionDate={maxAuctionDate}
                />
              )}
              {currentStep === 4 && (
                <ReviewStep
                  title={title} category={category} brand={brand} model={model} trim={trim}
                  buildYear={buildYear} locationCity={locationCity} locationCountry={locationCountry}
                  isOffMarket={isOffMarket} vin={vin} specifications={specifications} mediaList={mediaList}
                  saleType={saleType} askingPrice={askingPrice} startingBid={startingBid}
                  auctionEndsAt={auctionEndsAt} currency={currency} allowCounterOffers={allowCounterOffers}
                  selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}
                  hasActiveSubscription={hasActiveSubscription}
                />
              )}
            </AnimationWrapper>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2C2C2E]">
            <button
              type="button"
              onClick={() => currentStep > 0 && setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2C2C2E] text-gray-300 font-semibold text-sm hover:bg-[#252528] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {currentStep < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => validateCurrentStep() && setCurrentStep((prev) => prev + 1)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-xl text-sm hover:bg-yellow-400 transition-all cursor-pointer shadow-lg shadow-primary/20 active:scale-95"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitListing}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-xl text-sm hover:bg-yellow-400 transition-all cursor-pointer shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Listing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    Confirm & Publish
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
