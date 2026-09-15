import {
  Gauge, Cog, Calendar, Ruler, Home, Zap, Plane, Users, Wind, MapPin, Package, FileText, History, Move, Ship
} from "lucide-react";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

export interface MarketplaceItem {
  id: number;
  title: string;
  category: "Automotive" | "Yachts" | "Aviation" | "Real Estate";
  price: number;
  location: string;
  image: string;
  media: MediaItem[];
  type: "VIP" | "Private" | "Dealer Inventory";
  createdAt: string;
  specs: {
    label: string;
    value: string;
    icon: any;
  }[];
  detailedSpecs: {
    label: string;
    value: string;
  }[];
  description: string;
  history: string[];
  documents: { title: string; type: string }[];
  dealerName?: string;
  brand: string;
  condition: "New" | "Used";
  year: number;
  mileage: number;
}

export const DEMO_ITEMS: MarketplaceItem[] = [
  {
    id: 1,
    title: "Bugatti Chiron Super Sport",
    category: "Automotive",
    brand: "Bugatti",
    condition: "Used",
    year: 2021,
    mileage: 9250,
    price: 3800000,
    location: "Richardson, TX, United State",
    image: "/images/landing/hero-car.png",
    media: [
      { type: "video", url: "/video/footer.mp4", thumbnail: "/images/landing/hero-car.png" },
      { type: "image", url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000" },
    ],
    type: "VIP",
    createdAt: "2026-04-10",
    dealerName: "Elite Motors Collection",
    description: "The Bugatti Chiron Is One Of The World’s Most Exclusive And Powerful Hyper Cars...",
    specs: [
      { label: "9 2,500 kms", value: "9 2,500 kms", icon: Gauge },
      { label: "Diesel", value: "Diesel", icon: Wind },
      { label: "Automatic", value: "Automatic", icon: Cog },
      { label: "2021", value: "2021", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  },
  {
    id: 2,
    title: "McLaren 720S",
    category: "Automotive",
    brand: "McLaren",
    condition: "Used",
    year: 2021,
    mileage: 9250,
    price: 340000,
    location: "Richardson, TX, United State",
    image: "/images/landing/hero-car.png", // Demo fallback
    media: [],
    type: "VIP",
    createdAt: "2026-04-11",
    dealerName: "Elite Motors Collection",
    description: "A breathtaking masterpiece of modern automotive engineering.",
    specs: [
      { label: "9 2,500 kms", value: "9 2,500 kms", icon: Gauge },
      { label: "Diesel", value: "Diesel", icon: Wind },
      { label: "Automatic", value: "Automatic", icon: Cog },
      { label: "2021", value: "2021", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  },
  {
    id: 3,
    title: "Ferrari SF90 Stradale",
    category: "Automotive",
    brand: "Ferrari",
    condition: "New",
    year: 2024,
    mileage: 150,
    price: 610000,
    location: "Richardson, TX, United State",
    image: "/images/landing/hero-car.png", // Demo fallback
    media: [],
    type: "VIP",
    createdAt: "2026-04-12",
    dealerName: "Elite Motors Collection",
    description: "Ferrari's latest high-performance hybrid hypercar.",
    specs: [
      { label: "150 kms", value: "150 kms", icon: Gauge },
      { label: "Hybrid", value: "Hybrid", icon: Zap },
      { label: "Automatic", value: "Automatic", icon: Cog },
      { label: "2024", value: "2024", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  },
  {
    id: 4,
    title: "Porsche 911 GT3 RS",
    category: "Automotive",
    brand: "Porsche",
    condition: "Used",
    year: 2023,
    mileage: 4500,
    price: 298000,
    location: "Richardson, TX, United State",
    image: "/images/landing/hero-car.png", // Demo fallback
    media: [],
    type: "Private",
    createdAt: "2026-04-13",
    dealerName: "Elite Motors Collection",
    description: "Track-focused street-legal racer.",
    specs: [
      { label: "4 500 kms", value: "4 500 kms", icon: Gauge },
      { label: "Petrol", value: "Petrol", icon: Wind },
      { label: "Automatic", value: "Automatic", icon: Cog },
      { label: "2023", value: "2023", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  },
  {
    id: 5,
    title: "Modern Glass Villa",
    category: "Real Estate",
    brand: "Real Estate",
    condition: "New",
    year: 2023,
    mileage: 0,
    price: 12500000,
    location: "Malibu Coast, California, USA",
    image: "/images/landing/hero-villa.png",
    media: [],
    type: "VIP",
    createdAt: "2026-04-14",
    dealerName: "Elite Motors Collection",
    description: "A breathtaking masterpiece of modern architecture.",
    specs: [
      { label: "8 Beds", value: "8 Beds", icon: Home },
      { label: "4 Baths", value: "4 Baths", icon: Zap },
      { label: "5,000 sqft", value: "5,000 sqft", icon: Move },
      { label: "2023", value: "2023", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  },
  {
    id: 6,
    title: "Azimut Grande 35 Metri",
    category: "Yachts",
    brand: "Azimut",
    condition: "Used",
    year: 2021,
    mileage: 0,
    price: 9500000,
    location: "Monaco Harbor, France",
    image: "/images/landing/hero-yacht.png",
    media: [],
    type: "VIP",
    createdAt: "2026-04-15",
    dealerName: "Elite Motors Collection",
    description: "The Azimut Grande 35 Metri is a tri-deck marvel.",
    specs: [
      { label: "108 ft", value: "108 ft", icon: Ruler },
      { label: "5 Cabins", value: "5 Cabins", icon: Ship },
      { label: "12 Guests", value: "12 Guests", icon: Users },
      { label: "2021", value: "2021", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  },
  {
    id: 7,
    title: "Gulfstream G650ER",
    category: "Aviation",
    brand: "Gulfstream",
    condition: "Used",
    year: 2021,
    mileage: 12000,
    price: 65000000,
    location: "Teterboro Airport, NJ, USA",
    image: "/images/landing/hero-jet.png",
    media: [],
    type: "VIP",
    createdAt: "2026-04-16",
    dealerName: "Elite Motors Collection",
    description: "The Gulfstream G650ER is the gold standard for long-range travel.",
    specs: [
      { label: "7,000 nm Range", value: "7,000 nm Range", icon: Plane },
      { label: "5 Private Cabins", value: "5 Private Cabins", icon: Home },
      { label: "1850 passengers", value: "1850 passengers", icon: Users },
      { label: "2021", value: "2021", icon: Calendar },
    ],
    detailedSpecs: [],
    history: [],
    documents: []
  }
];
