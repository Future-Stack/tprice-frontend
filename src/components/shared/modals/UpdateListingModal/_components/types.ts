import { ListingItem } from "@/lib/api/listings";
import { UploadedMediaItem } from "@/components/SortableMediaGallery";

export type UpdateListingTab = "general" | "pricing" | "specs" | "media";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface UpdateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingItem | null;
}

export interface GeneralTabProps {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  trim: string;
  setTrim: (v: string) => void;
  buildYear: number | "";
  setBuildYear: (v: number | "") => void;
  locationCity: string;
  setLocationCity: (v: string) => void;
  locationCountry: string;
  setLocationCountry: (v: string) => void;
  isOffMarket: boolean;
  setIsOffMarket: (v: boolean) => void;
  categoriesList: Array<{ id: string; name: string }>;
  isLoadingCategories: boolean;
  brandsList: Array<{ id: string; name: string }>;
  isLoadingBrands: boolean;
  modelsList: Array<{ id: string; name: string }>;
  isLoadingModels: boolean;
  trimsList: Array<{ id: string; name: string }>;
  isLoadingTrims: boolean;
}

export interface PricingTabProps {
  saleType: "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE";
  setSaleType: (v: "FIXED_PRICE" | "AUCTION" | "PRIVATE_SALE") => void;
  askingPrice: string;
  setAskingPrice: (v: string) => void;
  startingBid: string;
  setStartingBid: (v: string) => void;
  auctionEndsAt: string;
  setAuctionEndsAt: (v: string) => void;
  currency: string;
  allowCounterOffers: boolean;
  setAllowCounterOffers: (v: boolean) => void;
}

export interface SpecsTabProps {
  specifications: KeyValuePair[];
  onAddRow: () => void;
  onChangeRow: (id: string, field: "key" | "value", val: string) => void;
  onRemoveRow: (id: string) => void;
}

export interface MediaTabProps {
  mediaList: UploadedMediaItem[];
  setMediaList: React.Dispatch<React.SetStateAction<UploadedMediaItem[]>>;
  isUploading: boolean;
  onFilesUpload: (files: File[]) => Promise<void>;
}
