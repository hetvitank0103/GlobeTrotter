export type Screen =
  | "dashboard"
  | "my-trips"
  | "create-trip"
  | "itinerary"
  | "budget"
  | "timeline"
  | "calendar"
  | "city-search"
  | "activity-search"
  | "community"
  | "profile";

export type ActivityType = "sightseeing" | "food" | "adventure" | "stay" | "transport" | "culture";

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  cost: number;
  duration: string;
  time: string;
  note?: string;
}

export interface Stop {
  id: string;
  city: string;
  country: string;
  flag: string;
  startDate: string;
  endDate: string;
  img: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImg: string;
  stops: Stop[];
  status: "upcoming" | "ongoing" | "completed";
  budget: number;
}

export interface CityListing {
  city: string;
  country: string;
  flag: string;
  rating: number;
  costPerDay: number;
  img: string;
  tag: string;
  region: string;
}

export interface ActivityListing {
  id: string;
  name: string;
  city: string;
  type: ActivityType;
  cost: number;
  duration: string;
  rating: number;
  img: string;
  description: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorInitials: string;
  tripName: string;
  destination: string;
  flag: string;
  coverImg: string;
  excerpt: string;
  likes: number;
  comments: number;
  daysAgo: number;
  tag: string;
}
