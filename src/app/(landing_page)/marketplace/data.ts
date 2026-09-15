export interface ServiceItem {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  tags: string[];
  experience: string;
  image: string;
  expertImage: string;
  badge: string;
  coverImage: string;
  projects: number;
  countries: number;
  awards: number;
  servicesOffered: string[];
  portfolioImages: string[];
}

export const DEMO_SERVICES: ServiceItem[] = [
  {
    id: 1,
    name: "John Whitson",
    title: "Interior Designer at Rolex",
    rating: 5,
    reviews: 120,
    description: "John Whitson founded his eponymous atelier in Paris after a decade at the world's most prestigious design houses. Her philosophy centers on the marriage of classic French elegance with contemporary aesthetics.",
    category: "Interior Designers",
    tags: ["RESIDENTIAL DESIGN", "SUPER YACHT INTERIOR"],
    experience: "18+ years experience",
    image: "/images/services/interior-1.png",
    expertImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    badge: "INTERIOR DESIGNS",
    coverImage: "/images/services/cover.png",
    projects: 45,
    countries: 16,
    awards: 24,
    servicesOffered: [
      "Full Interior Design & Concept",
      "Superyacht Cabin Design",
      "Art & Antiques Curation",
      "Bespoke Furniture Commissioning",
      "Lighting Design",
      "Project Management"
    ],
    portfolioImages: [
      "/images/services/interior-1.png",
      "/images/services/interior-2.png",
      "/images/services/interior-3.png",
      "/images/services/interior-1.png",
      "/images/services/interior-2.png"
    ]
  },
  {
    id: 2,
    name: "Cameron Williamson",
    title: "Yacht Service Provider Toyota",
    rating: 5,
    reviews: 120,
    description: "Captain Cameron Williamson founded her eponymous atelier in Paris after a decade at the world's most prestigious design houses. Her philosophy centers on the marriage of classic French elegance with contemporary aesthetics.",
    category: "Yacht Services",
    tags: ["YACHT MANAGEMENT", "SKY TRAVEL PROVISION"],
    experience: "5 years experience",
    image: "/images/services/yacht-1.png",
    expertImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
    badge: "YACHT SERVICES",
    coverImage: "/images/services/cover.png",
    projects: 12,
    countries: 5,
    awards: 3,
    servicesOffered: [
      "Yacht Management",
      "Crew Placement",
      "Charter Brokerage",
      "Refit Supervision",
      "Operational Logistics"
    ],
    portfolioImages: [
      "/images/services/yacht-1.png",
      "/images/services/yacht-2.png",
      "/images/services/yacht-1.png",
      "/images/services/yacht-2.png"
    ]
  },
  {
    id: 3,
    name: "John Whitson",
    title: "Interior Designer at Rolex",
    rating: 5,
    reviews: 120,
    description: "John Whitson founded his eponymous atelier in Paris after a decade at the world's most prestigious design houses. Her philosophy centers on the marriage of classic French elegance with contemporary aesthetics.",
    category: "Interior Designers",
    tags: ["RESIDENTIAL DESIGN", "SUPER YACHT INTERIOR"],
    experience: "18+ years experience",
    image: "/images/services/interior-2.png",
    expertImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John2",
    badge: "INTERIOR DESIGNS",
    coverImage: "/images/services/cover.png",
    projects: 40,
    countries: 10,
    awards: 15,
    servicesOffered: ["Full Interior Design & Concept", "Lighting Design", "Project Management"],
    portfolioImages: ["/images/services/interior-2.png"]
  },
  {
    id: 4,
    name: "John Whitson",
    title: "Interior Designer at Rolex",
    rating: 5,
    reviews: 120,
    description: "John Whitson founded his eponymous atelier in Paris after a decade at the world's most prestigious design houses. Her philosophy centers on the marriage of classic French elegance with contemporary aesthetics.",
    category: "Aviation Services",
    tags: ["RESIDENTIAL DESIGN", "SUPER YACHT INTERIOR"],
    experience: "14+ years experience",
    image: "/images/services/aviation-1.png",
    expertImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John3",
    badge: "AVIATION SERVICES",
    coverImage: "/images/services/cover.png",
    projects: 110,
    countries: 35,
    awards: 8,
    servicesOffered: ["Aircraft Acquisition", "Maintenance Coordination", "Crew Management"],
    portfolioImages: ["/images/services/aviation-1.png"]
  },
  {
    id: 5,
    name: "Cameron Williamson",
    title: "Yacht Service Provider Toyota",
    rating: 5,
    reviews: 120,
    description: "Captain Cameron Williamson founded her eponymous atelier in Paris after a decade at the world's most prestigious design houses. Her philosophy centers on the marriage of classic French elegance with contemporary aesthetics.",
    category: "Yacht Services",
    tags: ["YACHT MANAGEMENT", "SKY TRAVEL PROVISION"],
    experience: "5 years experience",
    image: "/images/services/yacht-2.png",
    expertImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron2",
    badge: "YACHT SERVICES",
    coverImage: "/images/services/cover.png",
    projects: 20,
    countries: 12,
    awards: 5,
    servicesOffered: ["Yacht Management", "Refit Supervision"],
    portfolioImages: ["/images/services/yacht-2.png"]
  },
  {
    id: 6,
    name: "John Whitson",
    title: "Interior Designer at Rolex",
    rating: 5,
    reviews: 120,
    description: "John Whitson founded his eponymous atelier in Paris after a decade at the world's most prestigious design houses. Her philosophy centers on the marriage of classic French elegance with contemporary aesthetics.",
    category: "Interior Designers",
    tags: ["RESIDENTIAL DESIGN", "SUPER YACHT INTERIOR"],
    experience: "18+ years experience",
    image: "/images/services/interior-3.png",
    expertImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John4",
    badge: "INTERIOR DESIGNS",
    coverImage: "/images/services/cover.png",
    projects: 55,
    countries: 22,
    awards: 30,
    servicesOffered: ["Full Interior Design & Concept", "Superyacht Cabin Design", "Bespoke Furniture Commissioning"],
    portfolioImages: ["/images/services/interior-3.png"]
  }
];
