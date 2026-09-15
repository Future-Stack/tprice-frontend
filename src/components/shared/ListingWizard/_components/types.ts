import type { Category } from "@/lib/api/categories";
import type { Brand } from "@/lib/api/brands";
import type { ModelItem as Model } from "@/lib/api/models";
import type { TrimItem as Trim } from "@/lib/api/trims";
import { UploadedMediaItem } from "@/components/SortableMediaGallery";

export const WIZARD_STEPS = ["Basic Info", "Specifications", "Media", "Pricing", "Review"];

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export type SaleType = "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE";
export type PlanType = "standard" | "featured";

export interface ListingWizardProps {
  role?: "dealer" | "seller";
  redirectPath?: string;
}

export interface BasicInfoStepProps {
  title: string;
  setTitle: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  trim: string;
  setTrim: (val: string) => void;
  buildYear: number | "";
  setBuildYear: (val: number | "") => void;
  locationCity: string;
  setLocationCity: (val: string) => void;
  locationCountry: string;
  setLocationCountry: (val: string) => void;
  isOffMarket: boolean;
  setIsOffMarket: (val: boolean) => void;
  categoriesList: Category[];
  isLoadingCategories: boolean;
  brandsList: Brand[];
  isLoadingBrands: boolean;
  modelsList: Model[];
  isLoadingModels: boolean;
  trimsList: Trim[];
  isLoadingTrims: boolean;
}

export interface SpecificationsStepProps {
  vin: string;
  setVin: (val: string) => void;
  onDecodeVin: () => Promise<void>;
  isDecodingVin: boolean;
  specifications: KeyValuePair[];
  onAddSpecRow: () => void;
  onSpecChange: (id: string, field: "key" | "value", val: string) => void;
  onRemoveSpecRow: (id: string) => void;
  onClearAllSpecs: () => void;
}

export interface MediaStepProps {
  mediaList: UploadedMediaItem[];
  setMediaList: React.Dispatch<React.SetStateAction<UploadedMediaItem[]>>;
  onFilesUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
  onRemoveMedia: (index: number) => void;
  onSetCover: (index: number) => void;
}

export interface PricingStepProps {
  saleType: SaleType;
  setSaleType: (val: SaleType) => void;
  askingPrice: string;
  setAskingPrice: (val: string) => void;
  startingBid: string;
  setStartingBid: (val: string) => void;
  auctionEndsAt: string;
  setAuctionEndsAt: (val: string) => void;
  currency: string;
  allowCounterOffers: boolean;
  setAllowCounterOffers: (val: boolean) => void;
  selectedPlan: PlanType;
  setSelectedPlan: (val: PlanType) => void;
  hasActiveSubscription: boolean;
  minAuctionDate: Date;
  maxAuctionDate: Date;
}

export interface ReviewStepProps {
  title: string;
  category: string;
  brand: string;
  model: string;
  trim: string;
  buildYear: number | "";
  locationCity: string;
  locationCountry: string;
  isOffMarket: boolean;
  vin: string;
  specifications: KeyValuePair[];
  mediaList: UploadedMediaItem[];
  saleType: SaleType;
  askingPrice: string;
  startingBid: string;
  auctionEndsAt: string;
  currency: string;
  allowCounterOffers: boolean;
  selectedPlan: PlanType;
  hasActiveSubscription: boolean;
  onStepSelect: (step: number) => void;
}
