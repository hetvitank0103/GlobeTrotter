import { Camera, Utensils, Globe, BedDouble, Plane } from "lucide-react";
import type React from "react";
import type { Trip, CityListing, ActivityListing, ActivityType, CommunityPost } from "./types";

export const SEED_TRIPS: Trip[] = [
  {
    id: "t1",
    name: "Mediterranean Dream",
    startDate: "2025-07-10",
    endDate: "2025-07-28",
    description: "Sun-drenched islands, ancient ruins, and the best food in Europe.",
    coverImg: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&h=500&fit=crop&auto=format",
    budget: 3500,
    status: "upcoming",
    stops: [
      {
        id: "s1",
        city: "Paris",
        country: "France",
        flag: "🇫🇷",
        startDate: "2025-07-10",
        endDate: "2025-07-13",
        img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=260&fit=crop&auto=format",
        activities: [
          { id: "a1", name: "Eiffel Tower", type: "sightseeing", cost: 35, duration: "3h", time: "10:00" },
          { id: "a2", name: "Seine River Cruise", type: "adventure", cost: 55, duration: "1.5h", time: "15:00" },
          { id: "a3", name: "Café de Flore lunch", type: "food", cost: 42, duration: "1h", time: "13:00" },
          { id: "a4", name: "Hôtel Le Marais", type: "stay", cost: 840, duration: "3 nights", time: "" },
          { id: "a5", name: "CDG → Santorini flight", type: "transport", cost: 215, duration: "4h", time: "08:30" },
        ],
      },
      {
        id: "s2",
        city: "Santorini",
        country: "Greece",
        flag: "🇬🇷",
        startDate: "2025-07-13",
        endDate: "2025-07-18",
        img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=260&fit=crop&auto=format",
        activities: [
          { id: "a6", name: "Oia Sunset Walk", type: "sightseeing", cost: 0, duration: "2h", time: "18:30" },
          { id: "a7", name: "Volcanic Wine Tour", type: "food", cost: 95, duration: "4h", time: "12:00" },
          { id: "a8", name: "Caldera View Suites", type: "stay", cost: 1750, duration: "5 nights", time: "" },
          { id: "a9", name: "JTR → Rome flight", type: "transport", cost: 165, duration: "2.5h", time: "09:00" },
        ],
      },
    ],
  },
  {
    id: "t2",
    name: "East Asia Explorer",
    startDate: "2024-11-03",
    endDate: "2024-11-18",
    description: "Neon streets, ancient temples, cherry blossoms and street food.",
    coverImg: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=900&h=500&fit=crop&auto=format",
    budget: 2800,
    status: "completed",
    stops: [
      {
        id: "s3",
        city: "Tokyo",
        country: "Japan",
        flag: "🇯🇵",
        startDate: "2024-11-03",
        endDate: "2024-11-09",
        img: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400&h=260&fit=crop&auto=format",
        activities: [
          { id: "a10", name: "Shinjuku Gyoen Garden", type: "sightseeing", cost: 12, duration: "2h", time: "09:00" },
          { id: "a11", name: "Tsukiji Market Breakfast", type: "food", cost: 28, duration: "1h", time: "07:30" },
          { id: "a12", name: "Shibuya Crossing at night", type: "culture", cost: 0, duration: "1h", time: "21:00" },
          { id: "a13", name: "APA Hotel Shinjuku", type: "stay", cost: 720, duration: "6 nights", time: "" },
        ],
      },
    ],
  },
];

// ── City catalog for City Search screen ─────────────────────────────────────
export const CITIES: CityListing[] = [
  { city: "Kyoto", country: "Japan", flag: "🇯🇵", rating: 4.9, costPerDay: 120, img: "https://images.unsplash.com/photo-1536031696538-924fe11c7037?w=400&h=260&fit=crop&auto=format", tag: "Culture", region: "Asia" },
  { city: "Amalfi Coast", country: "Italy", flag: "🇮🇹", rating: 4.8, costPerDay: 185, img: "https://images.unsplash.com/photo-1620662892011-f5c2d523fae2?w=400&h=260&fit=crop&auto=format", tag: "Scenic", region: "Europe" },
  { city: "Cartagena", country: "Colombia", flag: "🇨🇴", rating: 4.7, costPerDay: 75, img: "https://images.unsplash.com/photo-1472146936668-d987bf0a6e38?w=400&h=260&fit=crop&auto=format", tag: "Adventure", region: "South America" },
  { city: "Paris", country: "France", flag: "🇫🇷", rating: 4.8, costPerDay: 165, img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=260&fit=crop&auto=format", tag: "Culture", region: "Europe" },
  { city: "Santorini", country: "Greece", flag: "🇬🇷", rating: 4.9, costPerDay: 210, img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=260&fit=crop&auto=format", tag: "Scenic", region: "Europe" },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵", rating: 4.8, costPerDay: 140, img: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400&h=260&fit=crop&auto=format", tag: "Culture", region: "Asia" },
  { city: "Bali", country: "Indonesia", flag: "🇮🇩", rating: 4.7, costPerDay: 65, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=260&fit=crop&auto=format", tag: "Beach", region: "Asia" },
  { city: "Marrakech", country: "Morocco", flag: "🇲🇦", rating: 4.6, costPerDay: 55, img: "https://images.unsplash.com/photo-1597212720158-2ca8dee14ac9?w=400&h=260&fit=crop&auto=format", tag: "Culture", region: "Africa" },
  { city: "Reykjavik", country: "Iceland", flag: "🇮🇸", rating: 4.8, costPerDay: 195, img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=260&fit=crop&auto=format", tag: "Adventure", region: "Europe" },
  { city: "Queenstown", country: "New Zealand", flag: "🇳🇿", rating: 4.9, costPerDay: 150, img: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400&h=260&fit=crop&auto=format", tag: "Adventure", region: "Oceania" },
  { city: "Lisbon", country: "Portugal", flag: "🇵🇹", rating: 4.7, costPerDay: 95, img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=260&fit=crop&auto=format", tag: "Scenic", region: "Europe" },
  { city: "Cape Town", country: "South Africa", flag: "🇿🇦", rating: 4.7, costPerDay: 85, img: "https://images.unsplash.com/photo-1580060839134-75a50c8c4c34?w=400&h=260&fit=crop&auto=format", tag: "Adventure", region: "Africa" },
];

// ── Activity catalog for Activity Search screen ─────────────────────────────
export const ACTIVITY_CATALOG: ActivityListing[] = [
  { id: "ac1", name: "Paragliding over the caldera", city: "Santorini", type: "adventure", cost: 120, duration: "2h", rating: 4.9, img: "https://images.unsplash.com/photo-1521673461164-de300ebcfb17?w=400&h=260&fit=crop&auto=format", description: "Soar above Santorini's caldera with a certified tandem instructor and panoramic sunset views." },
  { id: "ac2", name: "Louvre Museum guided tour", city: "Paris", type: "culture", cost: 65, duration: "3h", rating: 4.8, img: "https://images.unsplash.com/photo-1544413660-299165566b1d?w=400&h=260&fit=crop&auto=format", description: "Skip-the-line access with an art historian covering the museum's must-see masterpieces." },
  { id: "ac3", name: "Fushimi Inari sunrise hike", city: "Kyoto", type: "sightseeing", cost: 0, duration: "2.5h", rating: 4.9, img: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=260&fit=crop&auto=format", description: "Beat the crowds through thousands of vermilion torii gates at first light." },
  { id: "ac4", name: "Street food night market crawl", city: "Bangkok", type: "food", cost: 38, duration: "3h", rating: 4.7, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=260&fit=crop&auto=format", description: "Sample six local stalls with a guide who knows the best vendors." },
  { id: "ac5", name: "Amalfi coastal boat tour", city: "Amalfi Coast", type: "adventure", cost: 145, duration: "5h", rating: 4.8, img: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&h=260&fit=crop&auto=format", description: "Private boat along the coastline with swim stops in hidden coves." },
  { id: "ac6", name: "Sagrada Familia skip-the-line", city: "Barcelona", type: "culture", cost: 55, duration: "1.5h", rating: 4.9, img: "https://images.unsplash.com/photo-1583779457094-ab6f77f7bf1e?w=400&h=260&fit=crop&auto=format", description: "Gaudí's unfinished masterpiece with an expert local guide." },
  { id: "ac7", name: "Cartagena old town walking tour", city: "Cartagena", type: "sightseeing", cost: 25, duration: "2h", rating: 4.6, img: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=400&h=260&fit=crop&auto=format", description: "Colorful colonial streets, plazas, and hidden courtyards on foot." },
  { id: "ac8", name: "Ryokan onsen & kaiseki dinner", city: "Kyoto", type: "stay", cost: 310, duration: "1 night", rating: 4.9, img: "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?w=400&h=260&fit=crop&auto=format", description: "Traditional inn stay with private hot-spring bath and multi-course dinner." },
  { id: "ac9", name: "Seine sunset dinner cruise", city: "Paris", type: "food", cost: 89, duration: "2h", rating: 4.7, img: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=400&h=260&fit=crop&auto=format", description: "Three-course dinner gliding past illuminated Parisian landmarks." },
  { id: "ac10", name: "Airport transfer & rail pass", city: "Tokyo", type: "transport", cost: 45, duration: "1h", rating: 4.5, img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=260&fit=crop&auto=format", description: "Narita Express ticket plus a 3-day Tokyo subway pass." },
  { id: "ac11", name: "Blue lagoon geothermal spa", city: "Reykjavik", type: "adventure", cost: 95, duration: "3h", rating: 4.8, img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=260&fit=crop&auto=format", description: "Soak in mineral-rich geothermal waters against a lava field backdrop." },
  { id: "ac12", name: "Marrakech souk & spice tour", city: "Marrakech", type: "culture", cost: 32, duration: "2h", rating: 4.6, img: "https://images.unsplash.com/photo-1597212720158-2ca8dee14ac9?w=400&h=260&fit=crop&auto=format", description: "Navigate the medina's souks with a local guide, tasting spices and mint tea." },
];

export const ACTIVITY_META: Record<ActivityType, { color: string; bg: string; icon: React.FC<{ size?: number }> }> = {
  sightseeing: { color: "#0D7377", bg: "#E8F4F4", icon: Camera },
  food: { color: "#B45309", bg: "#FEF3C7", icon: Utensils },
  adventure: { color: "#7C3AED", bg: "#EDE9FE", icon: () => null },
  culture: { color: "#0369A1", bg: "#E0F2FE", icon: Globe },
  stay: { color: "#BE185D", bg: "#FCE7F3", icon: BedDouble },
  transport: { color: "#374151", bg: "#F3F4F6", icon: Plane },
};

// ── Community feed ───────────────────────────────────────────────────────────
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "c1", author: "Maya Chen", authorInitials: "MC", tripName: "Island Hopping Greece",
    destination: "Santorini, Greece", flag: "🇬🇷",
    coverImg: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&h=300&fit=crop&auto=format",
    excerpt: "Ten days chasing sunsets from Oia to Fira — including the exact wine tour spot everyone should book.",
    likes: 214, comments: 32, daysAgo: 2, tag: "Scenic",
  },
  {
    id: "c2", author: "Diego Alvarez", authorInitials: "DA", tripName: "Kyoto in Autumn",
    destination: "Kyoto, Japan", flag: "🇯🇵",
    coverImg: "https://images.unsplash.com/photo-1536031696538-924fe11c7037?w=500&h=300&fit=crop&auto=format",
    excerpt: "A slow 6-day loop through temples and tea houses, timed for peak foliage. Budget breakdown included.",
    likes: 341, comments: 58, daysAgo: 5, tag: "Culture",
  },
  {
    id: "c3", author: "Priya Nair", authorInitials: "PN", tripName: "Budget Backpacking Colombia",
    destination: "Cartagena, Colombia", flag: "🇨🇴",
    coverImg: "https://images.unsplash.com/photo-1472146936668-d987bf0a6e38?w=500&h=300&fit=crop&auto=format",
    excerpt: "Did the whole Caribbean coast for under $40/day. Hostel picks and the best ceviche stand.",
    likes: 156, comments: 21, daysAgo: 9, tag: "Adventure",
  },
  {
    id: "c4", author: "Tom Baker", authorInitials: "TB", tripName: "Iceland Ring Road",
    destination: "Reykjavik, Iceland", flag: "🇮🇸",
    coverImg: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=500&h=300&fit=crop&auto=format",
    excerpt: "7 days circling the whole island by car — waterfalls, glaciers, and where to catch the northern lights.",
    likes: 289, comments: 44, daysAgo: 12, tag: "Adventure",
  },
];
