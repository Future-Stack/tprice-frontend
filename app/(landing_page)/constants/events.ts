export interface Event {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: string;
  description: string;
}

export const EVENTS_DATA: Event[] = [
  {
    id: 1,
    slug: "pebble-beach-concours-delegance",
    title: "Pebble Beach Concours D'Elegance",
    category: "Automotive",
    date: "3rd April, 2026",
    time: "9 Pm",
    location: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    image: "/images/landing/hero-car.png",
    status: "UPCOMING",
    description: "Experience the world's premier automotive event. Explore the latest in vintage car restoration, cutting-edge automotive design, and exclusive networking opportunities with industry legends and collectors. Join us for a weekend of elegance and performance in the heart of Pebble Beach."
  },
  {
    id: 2,
    slug: "prestige-property-showcase",
    title: "Prestige Property Showcase",
    category: "Real Estate",
    date: "3rd April, 2026",
    time: "9 Pm",
    location: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    image: "/images/landing/hero-villa.png",
    status: "UPCOMING",
    description: "Discover the pinnacle of luxury living. This showcase features exclusive tours of the most prestigious architectural masterpieces, modern interior design trends, and insights from the world's leading real estate developers. A must-attend for discerning investors and design enthusiasts."
  },
  {
    id: 3,
    slug: "monaco-yacht-show",
    title: "Monaco Yacht Show",
    category: "Yacht",
    date: "3rd April, 2026",
    time: "9 Pm",
    location: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    image: "/images/landing/hero-yacht.png",
    status: "UPCOMING",
    description: "The world's premier superyacht event returns to the iconic Port Hercules. EBACE brings together the global yachting community for three days of discovery, innovation, and high-end networking. Explore a curated selection of the finest yachts and luxury tenders available on the market."
  },
  {
    id: 4,
    slug: "ebace-private-aviation-summit",
    title: "EBACE Private Aviation Summit",
    category: "Aviation",
    date: "3rd April, 2026",
    time: "9 Pm",
    location: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    image: "/images/landing/hero-jet.png",
    status: "UPCOMING",
    description: "Europe's Premier Business Aviation Event. Explore the latest in private jet technology, sustainable aviation, and exclusive charter opportunities from the world's leading operators. EBACE brings together the global business aviation community for three days of discovery, innovation, and networking."
  }
];
