export const DEALER_VIP_CATEGORIES = ["All", "Car", "Yacht", "Jet", "Real Estate", "Watch"];

export interface FilterState {
  type: string;
  model: string;
  yearFrom: string;
  yearTo: string;
  priceMin: number;
  priceMax: number;
}

export interface Asset {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  category: string;
  type?: string;
  model?: string;
  year?: number;
  priceValue: number;
}

export const MIN_PRICE_LIMIT = 0;
export const MAX_PRICE_LIMIT = 500000;

export const DEFAULT_VIP_FILTER_STATE: FilterState = {
  type: "All",
  model: "All",
  yearFrom: "2005",
  yearTo: "2024",
  priceMin: 12000,
  priceMax: 500000,
};

export interface DealerVIPHeaderProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenMobileFilter: () => void;
}

export interface DealerVIPFilterProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  draftFilters: FilterState;
  setDraftFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleReset: () => void;
  handleApply: () => void;
  minLimit: number;
  maxLimit: number;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export interface DealerVIPGridProps {
  assets: Asset[];
}

export interface DealerVIPCardProps {
  asset: Asset;
}

export const DEALER_VIP_ASSETS: Asset[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    title: "Ferrari 488 Spider",
    location: "Monaco",
    price: "$295,000",
    category: "Car",
    type: "Sport",
    model: "Ferrari",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Volvo",
    year: 2021,
    priceValue: 295000,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Luxury",
    model: "Rolex",
    year: 2023,
    priceValue: 295000,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Azimut",
    year: 2020,
    priceValue: 295000,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Sport",
    model: "Rolex",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    title: "Gulfstream G650ER",
    location: "Monaco",
    price: "$295,000",
    category: "Jet",
    type: "Private Jet",
    model: "Gulfstream",
    year: 2019,
    priceValue: 295000,
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    title: "Ferrari 488 Spider",
    location: "Monaco",
    price: "$295,000",
    category: "Car",
    type: "Convertible",
    model: "Ferrari",
    year: 2023,
    priceValue: 295000,
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Casual",
    model: "Rolex",
    year: 2024,
    priceValue: 295000,
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Azimut",
    year: 2021,
    priceValue: 295000,
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800",
    title: "Azimut Grande 27M",
    location: "Monaco",
    price: "$295,000",
    category: "Yacht",
    type: "Yacht",
    model: "Azimut",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
    title: "Rolex Daytona 116S",
    location: "Monaco",
    price: "$295,000",
    category: "Watch",
    type: "Luxury",
    model: "Rolex",
    year: 2022,
    priceValue: 295000,
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    title: "Gulfstream G650ER",
    location: "Monaco",
    price: "$295,000",
    category: "Jet",
    type: "Private Jet",
    model: "Gulfstream",
    year: 2023,
    priceValue: 295000,
  },
];
