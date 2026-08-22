import React, { useState, useEffect, useRef } from "react";
import {
  Map, PlusCircle, Calendar, Wallet, UserCircle, LogOut,
  ArrowRight, Search, Star, MapPin, Clock, Trash2, Edit2,
  Share2, Eye, X, Plane, BedDouble, Utensils, Camera,
  Globe, ChevronRight, Check, Plus, Bell, Copy,
  BarChart3, List, Compass, Menu, ChevronDown, AlertTriangle,
  Sun, Moon, ChevronUp, Sparkles, TrendingUp,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
type Screen = "dashboard" | "my-trips" | "create-trip" | "itinerary" | "budget" | "timeline" | "profile";
type ActivityType = "sightseeing" | "food" | "adventure" | "stay" | "transport" | "culture";

interface Activity {
  id: string; name: string; type: ActivityType;
  cost: number; duration: string; time: string; note?: string;
}
interface Stop {
  id: string; city: string; country: string; flag: string;
  startDate: string; endDate: string; img: string; activities: Activity[];
}
interface Trip {
  id: string; name: string; startDate: string; endDate: string;
  description: string; coverImg: string; stops: Stop[];
  status: "upcoming" | "ongoing" | "completed"; budget: number;
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_TRIPS: Trip[] = [
  {
    id: "t1", name: "Mediterranean Dream",
    startDate: "2025-07-10", endDate: "2025-07-28",
    description: "Sun-drenched islands, ancient ruins, and the best food in Europe.",
    coverImg: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&h=500&fit=crop&auto=format",
    budget: 3500, status: "upcoming",
    stops: [
      {
        id: "s1", city: "Paris", country: "France", flag: "🇫🇷",
        startDate: "2025-07-10", endDate: "2025-07-13",
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
        id: "s2", city: "Santorini", country: "Greece", flag: "🇬🇷",
        startDate: "2025-07-13", endDate: "2025-07-18",
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
    id: "t2", name: "East Asia Explorer",
    startDate: "2024-11-03", endDate: "2024-11-18",
    description: "Neon streets, ancient temples, cherry blossoms and street food.",
    coverImg: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=900&h=500&fit=crop&auto=format",
    budget: 2800, status: "completed",
    stops: [
      {
        id: "s3", city: "Tokyo", country: "Japan", flag: "🇯🇵",
        startDate: "2024-11-03", endDate: "2024-11-09",
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

const DESTINATIONS = [
  { city: "Kyoto", country: "Japan", flag: "🇯🇵", rating: 4.9, costPerDay: 120, img: "https://images.unsplash.com/photo-1536031696538-924fe11c7037?w=400&h=260&fit=crop&auto=format", tag: "Culture" },
  { city: "Amalfi Coast", country: "Italy", flag: "🇮🇹", rating: 4.8, costPerDay: 185, img: "https://images.unsplash.com/photo-1620662892011-f5c2d523fae2?w=400&h=260&fit=crop&auto=format", tag: "Scenic" },
  { city: "Cartagena", country: "Colombia", flag: "🇨🇴", rating: 4.7, costPerDay: 75, img: "https://images.unsplash.com/photo-1472146936668-d987bf0a6e38?w=400&h=260&fit=crop&auto=format", tag: "Adventure" },
];

const ACTIVITY_META: Record<ActivityType, { color: string; bg: string; icon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> }> = {
  sightseeing: { color: "#4f46e5", bg: "#f5f3ff", icon: Camera },
  food:        { color: "#b45309", bg: "#fef3c7", icon: Utensils },
  adventure:   { color: "#7c3aed", bg: "#f3e8ff", icon: ({ size, className }) => <span className={`text-sm ${className}`} style={{ fontSize: size }}>🧗</span> },
  culture:     { color: "#0284c7", bg: "#e0f2fe", icon: Globe },
  stay:        { color: "#db2777", bg: "#fce7f3", icon: BedDouble },
  transport:   { color: "#475569", bg: "#f1f5f9", icon: Plane },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const D = "Playfair Display";
const B = "Plus Jakarta Sans";
const M = "DM Mono";

function fmt(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function days(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
function tripTotal(t: Trip) {
  return t.stops.flatMap(s => s.activities).reduce((s, a) => s + a.cost, 0);
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="glg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#glg)" />
      <circle cx="24" cy="24" r="10" stroke="white" strokeWidth="2" strokeDasharray="4 2" fill="none" opacity=".6" />
      <circle cx="24" cy="24" r="3" fill="white" />
      <line x1="24" y1="4" x2="24" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="24" y1="34" x2="24" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="4" y1="24" x2="14" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="34" y1="24" x2="44" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M24 16 L27 22 L24 20 L21 22 Z" fill="white" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION MODAL
// ══════════════════════════════════════════════════════════════════════════════
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  initialTab?: "login" | "signup";
}

function AuthModal({ isOpen, onClose, onLogin, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const [email, setEmail] = useState("sarah@example.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      onClose();
    }, 1100);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div className="bg-card text-card-foreground rounded-3xl border border-border w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-250">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
          <X size={16} />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <Logo size={28} />
          <span className="font-bold text-lg text-foreground" style={{ fontFamily: D }}>GlobeTrotter</span>
        </div>

        <h2 className="font-bold text-foreground mb-1 text-2xl" style={{ fontFamily: D }}>
          {tab === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {tab === "login" ? "Sign in to access your itineraries." : "Start planning your next adventure."}
        </p>

        {/* Tab toggle */}
        <div className="flex rounded-xl overflow-hidden border border-border mb-6 bg-muted p-1">
          {(["login", "signup"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold capitalize transition-all rounded-lg ${tab === t ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Johnson"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Password</label>
              {tab === "login" && <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot?</button>}
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-70 mt-2 bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
              : <>{tab === "login" ? "Sign in" : "Create account"} <ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {tab === "login" ? "New here? " : "Already have an account? "}
          <button onClick={() => setTab(tab === "login" ? "signup" : "login")}
            className="text-primary font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer">
            {tab === "login" ? "Create an account" : "Log in instead"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STORYTELLING LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════════
interface LandingPageProps {
  onLogin: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

function LandingPage({ onLogin, isDark, setIsDark }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [howStep, setHowStep] = useState(0);
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "annual">("annual");
  const [mockupTrip, setMockupTrip] = useState<"kyoto" | "paris" | "amalfi">("kyoto");

  // Custom mock data for the interactive planner widget
  const [kyotoActs, setKyotoActs] = useState([
    { id: "k1", name: "Fushimi Inari Shrine Hike", cost: 0, duration: "3h", time: "08:00", type: "sightseeing" as ActivityType },
    { id: "k2", name: "Gion Kaiseki Dinner", cost: 120, duration: "2h", time: "18:30", type: "food" as ActivityType },
    { id: "k3", name: "Zen Meditation at Tenryu-ji", cost: 15, duration: "1.5h", time: "11:00", type: "culture" as ActivityType },
  ]);
  const [parisActs, setParisActs] = useState([
    { id: "p1", name: "Louvre Museum Tour", cost: 22, duration: "4h", time: "10:00", type: "sightseeing" as ActivityType },
    { id: "p2", name: "Bistrot Dinner in Marais", cost: 45, duration: "2h", time: "19:30", type: "food" as ActivityType },
    { id: "p3", name: "Seine Cruise Tour", cost: 35, duration: "2h", time: "15:00", type: "adventure" as ActivityType },
  ]);
  const [amalfiActs, setAmalfiActs] = useState([
    { id: "m1", name: "Positano Beach Day", cost: 30, duration: "5h", time: "10:00", type: "adventure" as ActivityType },
    { id: "m2", name: "Coastal Boat Tour", cost: 85, duration: "3h", time: "14:00", type: "adventure" as ActivityType },
    { id: "m3", name: "Lemon Orchard Walk", cost: 25, duration: "1.5h", time: "17:00", type: "food" as ActivityType },
  ]);

  const [newActName, setNewActName] = useState("");
  const [newActType, setNewActType] = useState<ActivityType>("sightseeing");
  const [newActCost, setNewActCost] = useState("20");

  const acts = mockupTrip === "kyoto" ? kyotoActs : mockupTrip === "paris" ? parisActs : amalfiActs;
  const setActs = mockupTrip === "kyoto" ? setKyotoActs : mockupTrip === "paris" ? setParisActs : setAmalfiActs;

  const coverImgs = {
    kyoto: "https://images.unsplash.com/photo-1536031696538-924fe11c7037?w=800&fit=crop&auto=format",
    paris: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&fit=crop&auto=format",
    amalfi: "https://images.unsplash.com/photo-1620662892011-f5c2d523fae2?w=800&fit=crop&auto=format",
  };

  const tripNames = {
    kyoto: "Kyoto Autumn Retreat 🍁",
    paris: "Parisian Spring Weekend 🗼",
    amalfi: "Amalfi Coast Escapade 🍋",
  };

  const handleAddAct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName) return;
    const newAct = {
      id: "demo-" + Date.now(),
      name: newActName,
      cost: Number(newActCost) || 0,
      duration: "2h",
      time: "12:00",
      type: newActType,
    };
    setActs([...acts, newAct]);
    setNewActName("");
  };

  const handleRemoveAct = (id: string) => {
    setActs(acts.filter(a => a.id !== id));
  };

  const budgetLimits = { kyoto: 3000, paris: 2500, amalfi: 4000 };
  const tripBudget = budgetLimits[mockupTrip];
  const tripTotalCost = acts.reduce((s, a) => s + a.cost, 0);

  // FAQ state
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });
  const toggleFaq = (index: number) => {
    setFaqOpen(p => ({ ...p, [index]: !p[index] }));
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuth = (mode: "login" | "signup") => {
    setAuthTab(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white" style={{ fontFamily: B }}>
      {/* Decorative background orbs */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-primary/30 to-violet-500/20 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-accent/20 to-primary/20 blur-[100px]" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-bold text-xl text-foreground tracking-tight" style={{ fontFamily: D }}>GlobeTrotter</span>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Stories</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => openAuth("login")} className="hidden sm:block text-sm font-bold text-foreground/80 hover:text-foreground hover:bg-muted px-4 py-2 rounded-xl transition-all cursor-pointer">
              Log in
            </button>
            <button onClick={() => openAuth("signup")} className="bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer">
              Start Planning
            </button>

            {/* Mobile menu hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card text-foreground py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">How it works</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">Stories</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold">Pricing</a>
            <div className="border-t border-border pt-4 flex gap-2">
              <button onClick={() => { setMobileMenuOpen(false); openAuth("login"); }} className="flex-1 py-2 text-sm font-bold border border-border rounded-xl">Log In</button>
              <button onClick={() => { setMobileMenuOpen(false); openAuth("signup"); }} className="flex-1 py-2 text-sm font-bold bg-primary text-white rounded-xl">Sign Up</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Hero Info */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-primary/20 text-primary font-semibold text-xs mb-6 shadow-sm">
            <Sparkles size={12} /> Live interactive preview below!
          </div>
          <h1 className="font-extrabold text-foreground leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6" style={{ fontFamily: D }}>
            Plan Your Next <br />
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Adventure Together.</span>
          </h1>
          <p className="text-muted-foreground text-md sm:text-lg leading-relaxed mb-8 max-w-xl">
            Create custom multi-city itineraries, invite friends to collaborate, manage budgets seamlessly, and view your trip on a interactive timeline.
          </p>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <button onClick={() => openAuth("signup")} className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto text-center cursor-pointer">
              Plan Your First Trip <ArrowRight size={16} />
            </button>
            <a href="#demo" className="flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto text-center">
              Try Interactive Widget
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10 text-muted-foreground border-t border-border/80 w-full pt-6">
            <div>
              <p className="text-foreground font-extrabold text-2xl" style={{ fontFamily: D }}>50K+</p>
              <p className="text-xs">Travelers Joined</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-foreground font-extrabold text-2xl" style={{ fontFamily: D }}>120+</p>
              <p className="text-xs">Countries Explored</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-foreground font-extrabold text-2xl" style={{ fontFamily: D }}>4.9★</p>
              <p className="text-xs">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Hero Mockup (Interactive Itinerary Builder Widget) */}
        <div id="demo" className="lg:col-span-6 w-full">
          <div className="relative">
            {/* Background glowing rings */}
            <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl transform rotate-2 pointer-events-none" />

            {/* Widget container */}
            <div className="relative bg-card text-card-foreground rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-300">
              {/* Browser mockup top bar */}
              <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5 flex-shrink-0">
                  <span className="w-3 h-3 rounded-full bg-red-400 block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                  <span className="w-3 h-3 rounded-full bg-green-400 block" />
                </div>
                <div className="mx-auto bg-background/50 border border-border rounded-lg px-3 py-1 flex items-center gap-1.5 text-[10px] text-muted-foreground w-1/2 justify-center">
                  <Globe size={10} />
                  <span>globetrotter.io/trip/{mockupTrip}</span>
                </div>
              </div>

              {/* Destination buttons */}
              <div className="p-4 bg-background border-b border-border flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-foreground">Interactive Demo:</span>
                <div className="flex gap-1">
                  {(["kyoto", "paris", "amalfi"] as const).map(dest => (
                    <button key={dest} onClick={() => setMockupTrip(dest)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border capitalize transition-all cursor-pointer ${mockupTrip === dest ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}>
                      {dest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mockup Trip Preview Content */}
              <div className="relative h-40">
                <img src={coverImgs[mockupTrip]} alt={mockupTrip} className="w-full h-full object-cover transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">DEMO PLANNING</span>
                  <h3 className="font-bold text-lg mt-1">{tripNames[mockupTrip]}</h3>
                  <p className="text-white/80 text-[10px] font-mono mt-0.5">3 stops · 8 days · Est. Budget: ${tripBudget}</p>
                </div>
              </div>

              {/* Live activity items */}
              <div className="p-5 flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="font-bold text-sm text-foreground">Daily Itinerary List</h4>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Total Cost</span>
                    <span className={`font-mono text-sm font-bold ${tripTotalCost > tripBudget ? "text-destructive" : "text-primary"}`}>
                      ${tripTotalCost} / ${tripBudget}
                    </span>
                  </div>
                </div>

                {/* Overbudget Alert */}
                {tripTotalCost > tripBudget && (
                  <div className="p-2.5 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 flex items-center gap-2 text-xs text-red-700 dark:text-red-400 font-medium">
                    <AlertTriangle size={14} className="text-destructive flex-shrink-0" />
                    <span>Warning: You are over budget by ${tripTotalCost - tripBudget}!</span>
                  </div>
                )}

                <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {acts.map(act => {
                    const meta = ACTIVITY_META[act.type] || ACTIVITY_META.sightseeing;
                    const Icon = meta.icon;
                    return (
                      <div key={act.id} className="flex items-center justify-between bg-background border border-border rounded-xl p-3 hover:border-primary/40 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: meta.bg }}>
                            <Icon size={14} style={{ color: meta.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{act.name}</p>
                            <p className="text-[10px] text-muted-foreground">{act.time} · {act.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-foreground">{act.cost === 0 ? "Free" : `$${act.cost}`}</span>
                          <button onClick={() => handleRemoveAct(act.id)} className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-muted transition-colors cursor-pointer">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inline form to add demo activity */}
                <form onSubmit={handleAddAct} className="border-t border-border pt-4 flex flex-col gap-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Try it: Add custom activity</p>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input value={newActName} onChange={e => setNewActName(e.target.value)} placeholder="e.g. Kyoto Food Tour"
                      className="sm:col-span-6 bg-background border border-border text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary" required />
                    <input type="number" value={newActCost} onChange={e => setNewActCost(e.target.value)} placeholder="Cost"
                      className="sm:col-span-3 bg-background border border-border text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-primary" />
                    <select value={newActType} onChange={e => setNewActType(e.target.value as ActivityType)}
                      className="sm:col-span-3 bg-background border border-border text-xs px-2 py-2 rounded-lg focus:outline-none focus:border-primary">
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food">Food</option>
                      <option value="adventure">Adventure</option>
                      <option value="stay">Stay</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow shadow-primary/20 cursor-pointer">
                    <Plus size={13} /> Add Activity to Demo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="border-y border-border bg-card text-foreground py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "50,000+", label: "Active Globetrotters" },
            { value: "1,200+", label: "Cities Supported" },
            { value: "$24M+", label: "Travel Budgets Managed" },
            { value: "150,000+", label: "Itineraries Created" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-extrabold text-foreground text-2xl sm:text-3xl" style={{ fontFamily: D }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20">Complete Suite</span>
          <h2 className="font-extrabold text-foreground text-3xl sm:text-4xl mt-4 mb-5 leading-tight" style={{ fontFamily: D }}>Everything you need for travel planning</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">No more juggling spreadsheets, calendar apps, and map links. GlobeTrotter unifies your travel details into a clean workspace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: List,
              title: "Interactive Itinerary Builder",
              desc: "Add multiple stops and map out day-by-day sightseeing activities, transit options, hotels, and restaurant bookings."
            },
            {
              icon: BarChart3,
              title: "Smart Budget Analytics",
              desc: "Track total estimates and view pie/bar charts categorized by category or destination city to avoid budget overruns."
            },
            {
              icon: Calendar,
              title: "Visual Timelines",
              desc: "See your travel layout in a beautiful, vertical sequence. Collapse or expand city cards to zoom in on daily details."
            },
            {
              icon: Share2,
              title: "Public Link Sharing",
              desc: "Publish your customized trip schedules as public, read-only URLs so friends can review or copy them into their accounts."
            },
            {
              icon: Compass,
              title: "Destination Exploration",
              desc: "Browse through trending destinations, check rating metrics, approximate daily expenses, and add suggestions with one click."
            },
            {
              icon: UserCircle,
              title: "Personal Preferences",
              desc: "Define custom travel settings like language formats, currency settings, dates, bio details, and sync itineraries across devices."
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="bg-card text-card-foreground border border-border rounded-2xl p-7 flex flex-col items-start text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-secondary text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <h3 className="font-extrabold text-foreground mb-3 text-lg leading-tight" style={{ fontFamily: D }}>{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works interactive step selector */}
      <section id="how-it-works" className="border-t border-border bg-card py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20">How It Works</span>
            <h2 className="font-extrabold text-foreground text-3xl sm:text-4xl mt-4 mb-4 leading-tight" style={{ fontFamily: D }}>Plan in three simple steps</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Go from ideas to bookings in minutes. Try selecting each step below.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Step triggers */}
            <div className="lg:col-span-5 flex flex-col gap-4 text-left">
              {[
                { step: 0, title: "1. Build Your Core Itinerary", desc: "Select travel dates, choose trip name, and add multi-city stops. Our app generates clean templates for each destination automatically." },
                { step: 1, title: "2. Add Stays & Activities", desc: "Insert accommodation blocks, flight details, and daily events. Customize times, budget records, and attach detail summaries." },
                { step: 2, title: "3. Track Expenses & Sharing", desc: "Review visual budgets by category. Once ready, generate shared reading links to send to your group or save plans offline." }
              ].map(s => (
                <button key={s.step} onClick={() => setHowStep(s.step)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${howStep === s.step ? "bg-background border-primary shadow-md shadow-primary/5" : "bg-card border-border hover:bg-muted"}`}>
                  <h3 className={`font-bold text-base ${howStep === s.step ? "text-primary" : "text-foreground"}`}>{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Step visualization panel */}
            <div className="lg:col-span-7 bg-background border border-border rounded-2xl p-6 shadow-md min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 text-[10px] font-mono text-muted-foreground uppercase">Step Preview Graphics</div>
              {howStep === 0 && (
                <div className="flex flex-col gap-3 w-full max-w-sm text-left animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground">New Trip Setup</p>
                    <p className="text-sm font-bold text-foreground mt-1">✈️ European Summer Tour</p>
                    <div className="h-2 w-full bg-muted rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-xl shadow-sm">
                    <span className="text-xl">🇫🇷</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">Paris, France</p>
                      <p className="text-[10px] text-muted-foreground">July 10 → July 14 · 4 nights</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-xl shadow-sm opacity-60">
                    <span className="text-xl">🇮🇹</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">Rome, Italy</p>
                      <p className="text-[10px] text-muted-foreground">July 14 → July 20 · 6 nights</p>
                    </div>
                  </div>
                </div>
              )}
              {howStep === 1 && (
                <div className="flex flex-col gap-2.5 w-full max-w-sm text-left animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-card border border-border p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      <span className="text-xs font-bold">Resort Stay Reservation</span>
                    </div>
                    <span className="text-xs font-mono font-bold">$420</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold">Colosseum Walking Tour</span>
                    </div>
                    <span className="text-xs font-mono font-bold">$35</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold">Traditional Italian Dinner</span>
                    </div>
                    <span className="text-xs font-mono font-bold">$55</span>
                  </div>
                </div>
              )}
              {howStep === 2 && (
                <div className="flex flex-col gap-4 w-full max-w-sm text-left animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Financial Summary</p>
                    <p className="text-2xl font-extrabold text-foreground mt-1" style={{ fontFamily: D }}>$510 spent</p>
                    <p className="text-[10px] text-green-500 mt-1 font-semibold">✓ Under Trip Budget by $1,490</p>
                  </div>
                  <div className="bg-card border border-border p-3.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Share2 size={14} className="text-primary" />
                      <span className="text-xs font-bold">Public URL: globetrotter.io/share/t150</span>
                    </div>
                    <button type="button" className="text-[10px] font-bold text-primary bg-secondary px-2.5 py-1 rounded">Copy Link</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">
        <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20">Traveler Reviews</span>
        <h2 className="font-extrabold text-foreground text-3xl sm:text-4xl mt-4 mb-4 leading-tight" style={{ fontFamily: D }}>Shared by globetrotters</h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-16">Here's what our community says about their travel itinerary planning experience.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Jenkins",
              role: "Solo Backpacker",
              quote: "The interface is gorgeous and incredibly fluid. Planning my 3-week Japan itinerary was a breeze, especially matching activity costs against my budget in real-time.",
              color: "#3b82f6",
              initials: "SJ"
            },
            {
              name: "Alex & Maria",
              role: "Honeymoon Planners",
              quote: "Absolutely loved the shared itinerary view. I compiled all stops and hotels, sent the copy link to Alex, and he added his activity ideas directly. Highly recommend it!",
              color: "#10b981",
              initials: "AM"
            },
            {
              name: "David Chen",
              role: "Digital Nomad",
              quote: "Having charts on my budget breakdown screen is a lifesaver. The dark mode is beautiful and allows me to plan my next destination stops after hours.",
              color: "#8b5cf6",
              initials: "DC"
            }
          ].map((testi, i) => (
            <div key={i} className="bg-card text-card-foreground border border-border p-8 rounded-2xl flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300">
              <div>
                <div className="flex gap-1 text-amber-500 mb-5">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-6 italic">"{testi.quote}"</p>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-4 mt-2">
                <div className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: testi.color }}>
                  {testi.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{testi.name}</p>
                  <p className="text-[10px] text-muted-foreground">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Pricing Grid */}
      <section id="pricing" className="border-t border-border bg-card py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-secondary px-3.5 py-1.5 rounded-full border border-primary/20">Pricing Plans</span>
          <h2 className="font-extrabold text-foreground text-3xl sm:text-4xl mt-4 mb-4 leading-tight" style={{ fontFamily: D }}>Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-10">Choose the best fit for your planning scope. Switch between monthly and annual terms below.</p>

          {/* Pricing Period Toggle */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border shadow-inner">
              <button onClick={() => setPricingPeriod("monthly")}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${pricingPeriod === "monthly" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Monthly
              </button>
              <button onClick={() => setPricingPeriod("annual")}
                className={`relative text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${pricingPeriod === "annual" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Annually
                <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500 text-white font-extrabold scale-90">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left items-stretch">
            {/* Free Plan */}
            <div className="bg-background border border-border rounded-2xl p-8 flex flex-col justify-between shadow-sm relative">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Base plan</span>
                <h3 className="font-extrabold text-foreground text-xl mt-1" style={{ fontFamily: D }}>Free Starter</h3>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">Perfect for planning a single upcoming vacation.</p>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground" style={{ fontFamily: M }}>$0</span>
                  <span className="text-xs text-muted-foreground">/ forever</span>
                </div>
                <div className="border-t border-border pt-6 flex flex-col gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>1 Active Trip Itinerary</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>Up to 5 stops per trip</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>Real-time budget tracking</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>Timeline visualization</span></div>
                </div>
              </div>
              <button onClick={() => openAuth("signup")} className="w-full mt-8 py-3 rounded-xl border border-border text-xs font-bold text-foreground bg-card hover:bg-muted transition-all text-center cursor-pointer">
                Get Started Free
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-background border-2 border-primary rounded-2xl p-8 flex flex-col justify-between shadow-md relative scale-105">
              <span className="absolute top-4 right-4 bg-primary text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Power planner</span>
                <h3 className="font-extrabold text-foreground text-xl mt-1" style={{ fontFamily: D }}>Explorer Pro</h3>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">For passionate travelers building multiple itineraries.</p>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground" style={{ fontFamily: M }}>
                    {pricingPeriod === "monthly" ? "$9" : "$7"}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <div className="border-t border-border pt-6 flex flex-col gap-3 text-xs text-foreground/80">
                  <div className="flex items-center gap-2"><Check size={14} className="text-primary" /> <span className="font-semibold">Unlimited Active Trips</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-primary" /> <span>Unlimited city stops</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-primary" /> <span>Advanced pie & bar cost charts</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-primary" /> <span>Public link generation & sharing</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-primary" /> <span>Export trip details to PDF</span></div>
                </div>
              </div>
              <button onClick={() => openAuth("signup")} className="w-full mt-8 py-3 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition-all text-center shadow shadow-primary/20 cursor-pointer">
                Unlock Explorer Pro
              </button>
            </div>

            {/* Corporate Plan */}
            <div className="bg-background border border-border rounded-2xl p-8 flex flex-col justify-between shadow-sm relative">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Co-planning</span>
                <h3 className="font-extrabold text-foreground text-xl mt-1" style={{ fontFamily: D }}>Group Traveler</h3>
                <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">Collaborate with multiple friends on group trips.</p>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground" style={{ fontFamily: M }}>
                    {pricingPeriod === "monthly" ? "$19" : "$15"}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <div className="border-t border-border pt-6 flex flex-col gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>Everything in Explorer Pro</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span className="font-semibold">Collaborative multi-user editing</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>Chat & comment blocks inside stops</span></div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-green-500" /> <span>Priority customer support</span></div>
                </div>
              </div>
              <button onClick={() => openAuth("signup")} className="w-full mt-8 py-3 rounded-xl border border-border text-xs font-bold text-foreground bg-card hover:bg-muted transition-all text-center cursor-pointer">
                Try Group Planning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 lg:py-28 text-left">
        <h2 className="font-extrabold text-foreground text-3xl text-center mb-12" style={{ fontFamily: D }}>Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {[
            { q: "Can I share my itineraries with people who don't have an account?", a: "Yes! GlobeTrotter allows you to generate a unique public sharing link for each trip. Anyone with this link can view your itinerary layout and budget calculations in a gorgeous read-only mode, without needing to sign up." },
            { q: "Does the app support local currency conversions?", a: "Currently, all items are tracking in USD ($) or generic numeric values. We are actively developing a currency conversion feature for our upcoming release so you can input in local currencies and view summaries in USD." },
            { q: "Can I collaborate with friends in real-time?", a: "Real-time collaborative editing is supported in our Group Traveler plan. You can invite other registered users to edit, comment, and add stops or activities directly into your active planning draft." },
            { q: "What happens if I delete my account?", a: "Deleting your account is permanent. All your planned trips, stops, itinerary descriptions, and budget breakdowns will be removed from our database completely. You can delete your account under the profile settings page." }
          ].map((item, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200">
              <button onClick={() => toggleFaq(idx)} className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-foreground hover:bg-muted/50 transition-colors border-0">
                <span>{item.q}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${faqOpen[idx] ? "transform rotate-180" : ""}`} />
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-5 pt-1 border-t border-border/40 text-xs text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-150">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer & CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-12 pt-6">
        {/* CTA banner */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-10 lg:p-16 text-center text-white shadow-xl shadow-primary/25 relative overflow-hidden mb-16">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-xl pointer-events-none" />
          <h2 className="font-extrabold text-3xl sm:text-4xl mb-4 leading-tight" style={{ fontFamily: D }}>Your Next Journey Awaits</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto mb-8">Join thousands of globetrotters who are planning their next multi-city journeys with GlobeTrotter today.</p>
          <button onClick={() => openAuth("signup")} className="bg-white text-primary font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
            Plan Your Trip Free
          </button>
        </div>

        {/* Brand footer */}
        <footer className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-bold text-sm text-foreground" style={{ fontFamily: D }}>GlobeTrotter</span>
            <span className="text-[10px] pl-2 border-l border-border">© 2026 GlobeTrotter Inc.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Contact Support</a>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted text-foreground transition-all cursor-pointer">
            <ChevronUp size={14} />
          </button>
        </footer>
      </section>

      {/* Auth Modal Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={onLogin} initialTab={authTab} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { screen: "dashboard", icon: Globe, label: "Dashboard" },
  { screen: "my-trips", icon: Map, label: "My Trips" },
  { screen: "create-trip", icon: PlusCircle, label: "New Trip" },
  { screen: "itinerary", icon: List, label: "Itinerary" },
  { screen: "timeline", icon: Calendar, label: "Timeline" },
  { screen: "budget", icon: Wallet, label: "Budget" },
  { screen: "profile", icon: UserCircle, label: "Profile" },
] as const;

function Sidebar({ current, onNav, onLogout, collapsed, onToggle }: {
  current: Screen; onNav: (s: Screen) => void;
  onLogout: () => void; collapsed: boolean; onToggle: () => void;
}) {
  return (
    <aside
      className="fixed top-0 left-0 h-full z-40 flex flex-col bg-card border-r border-border transition-all duration-300 text-card-foreground shadow-sm"
      style={{ width: collapsed ? 64 : 220 }}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border flex-shrink-0">
        <Logo size={28} />
        {!collapsed && <span className="font-bold text-foreground" style={{ fontFamily: D }}>GlobeTrotter</span>}
      </div>

      <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5 overflow-hidden">
        {NAV.map(({ screen, icon: Icon, label }) => {
          const active = current === screen;
          return (
            <button key={screen} onClick={() => onNav(screen as Screen)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group w-full text-left cursor-pointer ${active ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-border pt-3 flex flex-col gap-0.5">
        <button onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full cursor-pointer">
          <Menu size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all w-full cursor-pointer">
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function DashboardScreen({ trips, onNav, onSelect }: {
  trips: Trip[]; onNav: (s: Screen) => void; onSelect: (t: Trip) => void;
}) {
  const upcoming = trips.filter(t => t.status === "upcoming");
  const featured = upcoming[0] || trips[0];

  return (
    <div className="p-6 max-w-6xl mx-auto text-left">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">Good morning ✈️</p>
        <h1 className="font-bold text-foreground text-3xl" style={{ fontFamily: D }}>
          Where to next, Sarah?
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total trips", value: trips.length, icon: Map, color: "text-primary", bg: "bg-primary/10" },
          { label: "Countries visited", value: 7, icon: Globe, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Days travelled", value: 43, icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Total spent", value: "$" + trips.reduce((s, t) => s + tripTotal(t), 0).toLocaleString(), icon: Wallet, color: "text-pink-500", bg: "bg-pink-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card text-card-foreground rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">{label}</p>
              <p className="font-bold text-foreground text-xl" style={{ fontFamily: D }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Featured upcoming trip */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground text-lg" style={{ fontFamily: D }}>Upcoming Trip</h2>
            <button onClick={() => onNav("my-trips")} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer">
              All trips <ChevronRight size={13} />
            </button>
          </div>
          {featured ? (
            <div className="rounded-2xl overflow-hidden border border-border bg-card text-card-foreground shadow-md hover:shadow-lg transition-all duration-300">
              <div className="relative h-52">
                <img src={featured.coverImg} alt={featured.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-accent-foreground bg-accent">
                      {featured.status === "upcoming" ? "Upcoming" : "Completed"}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl" style={{ fontFamily: D }}>{featured.name}</h3>
                  <p className="text-white/80 text-xs mt-0.5" style={{ fontFamily: M }}>
                    {fmt(featured.startDate)} → {fmt(featured.endDate)}
                  </p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{featured.description}</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {featured.stops.map(s => (
                    <div key={s.id} className="flex items-center gap-1.5 text-xs text-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                      <span>{s.flag}</span> {s.city}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Est. total</p>
                    <p className="font-bold text-foreground text-lg" style={{ fontFamily: M }}>
                      ${tripTotal(featured).toLocaleString()}
                    </p>
                    {tripTotal(featured) > featured.budget && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-0.5"><AlertTriangle size={10} /> Over budget</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { onSelect(featured); onNav("itinerary"); }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all hover:opacity-90 bg-gradient-to-r from-primary to-indigo-600 shadow shadow-primary/20 cursor-pointer">
                      <Eye size={13} /> View itinerary
                    </button>
                    <button onClick={() => { onSelect(featured); onNav("budget"); }}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer">
                      <Wallet size={13} /> Budget
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 py-16 bg-card text-muted-foreground">
              <Compass size={32} className="opacity-30" />
              <p className="text-sm font-semibold">No upcoming trips planned yet.</p>
              <button onClick={() => onNav("create-trip")} className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl">Create your first trip</button>
            </div>
          )}
        </div>

        {/* Right: destinations + quick actions */}
        <div className="flex flex-col gap-5">
          <div className="bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: D }}>Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New trip", icon: PlusCircle, screen: "create-trip" as Screen, color: "text-primary", bg: "bg-primary/10" },
                { label: "My trips", icon: Map, screen: "my-trips" as Screen, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Timeline", icon: Calendar, screen: "timeline" as Screen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                { label: "Budget", icon: Wallet, screen: "budget" as Screen, color: "text-pink-500", bg: "bg-pink-500/10" },
              ].map(({ label, icon: Icon, screen, color, bg }) => (
                <button key={label} onClick={() => onNav(screen)}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-border hover:border-primary/30 bg-background/50 hover:bg-background hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon size={16} className={color} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: D }}>Trending Destinations</h3>
            <div className="flex flex-col gap-3">
              {DESTINATIONS.map(d => (
                <div key={d.city} className="flex items-center gap-3">
                  <img src={d.img} alt={d.city} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{d.flag} {d.city}</p>
                    <p className="text-xs text-muted-foreground">{d.country} · <span style={{ fontFamily: M }}>${d.costPerDay}/day</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {d.rating}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{d.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MY TRIPS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function MyTripsScreen({ trips, onNav, onSelect, onDelete }: {
  trips: Trip[]; onNav: (s: Screen) => void;
  onSelect: (t: Trip) => void; onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const filtered = trips.filter(t => filter === "all" || t.status === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto text-left">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-bold text-foreground text-2xl" style={{ fontFamily: D }}>My Trips</h1>
        <button onClick={() => onNav("create-trip")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary to-indigo-600 shadow shadow-primary/20 hover:opacity-90 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
          <PlusCircle size={15} /> Plan new trip
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "upcoming", "completed"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border cursor-pointer transition-all ${filter === f ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(t => {
          const total = tripTotal(t);
          const over = total > t.budget;
          return (
            <div key={t.id} className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
              <div className="relative h-44">
                <img src={t.coverImg} alt={t.name} className="w-full h-full object-cover bg-muted" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-accent-foreground bg-accent shadow">
                  {t.status === "upcoming" ? "Upcoming" : "Completed"}
                </span>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg leading-tight" style={{ fontFamily: D }}>{t.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5" style={{ fontFamily: M }}>
                    {fmt(t.startDate)} → {fmt(t.endDate)} · {days(t.startDate, t.endDate)} days
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {t.stops.map(s => (
                    <span key={s.id} className="text-[10px] px-2.5 py-0.5 rounded-full bg-muted text-foreground font-semibold border border-border">
                      {s.flag} {s.city}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-3 border-b border-border/60 pb-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Estimated cost</p>
                    <p className="font-bold text-foreground font-mono" style={{ fontFamily: M }}>${total.toLocaleString()}</p>
                    {over && <p className="text-[9px] text-destructive flex items-center gap-1 font-semibold"><AlertTriangle size={9} /> Over budget by ${(total - t.budget).toLocaleString()}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Stops</p>
                    <p className="font-bold text-foreground" style={{ fontFamily: M }}>{t.stops.length} cities</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { onSelect(t); onNav("itinerary"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-primary to-indigo-600 shadow shadow-primary/10 hover:opacity-90 hover:shadow transition-all cursor-pointer">
                    <Eye size={12} /> View
                  </button>
                  <button onClick={() => { onSelect(t); onNav("timeline"); }}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer">
                    <Calendar size={12} />
                  </button>
                  <button onClick={() => { onSelect(t); onNav("budget"); }}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer">
                    <Wallet size={12} />
                  </button>
                  <button onClick={() => onDelete(t.id)}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all cursor-pointer">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty create card */}
        <button onClick={() => onNav("create-trip")}
          className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 py-16 hover:border-primary hover:bg-primary/5 transition-all group bg-card cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle size={22} className="text-primary" />
          </div>
          <p className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">Plan a new trip</p>
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CREATE TRIP SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function CreateTripScreen({ onSave }: { onSave: (t: Trip) => void }) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [desc, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !start || !end) return;
    const trip: Trip = {
      id: "t" + Date.now(),
      name, startDate: start, endDate: end, description: desc,
      budget: Number(budget) || 2000,
      coverImg: "https://images.unsplash.com/photo-1472146936668-d987bf0a6e38?w=900&h=500&fit=crop&auto=format",
      stops: [], status: "upcoming",
    };
    onSave(trip);
    setSaved(true);
  }

  if (saved) return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-full bg-secondary border border-primary/20 flex items-center justify-center mb-6">
        <Check size={36} className="text-primary" />
      </div>
      <h2 className="font-bold text-foreground mb-2 text-2xl" style={{ fontFamily: D }}>Trip created!</h2>
      <p className="text-muted-foreground mb-6">Now build your itinerary by adding stops and activities.</p>
      <button onClick={() => setSaved(false)}
        className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-primary shadow-lg shadow-primary/20 hover:opacity-90">
        Create another trip
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto text-left">
      <h1 className="font-bold text-foreground text-2xl mb-2" style={{ fontFamily: D }}>Plan a new trip</h1>
      <p className="text-muted-foreground text-sm mb-8">Start with the basics — you can add stops and activities next.</p>

      <form onSubmit={submit} className="bg-card text-card-foreground rounded-2xl border border-border p-7 flex flex-col gap-5 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Trip name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mediterranean Summer 2025"
            required className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Start date *</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">End date *</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Trip description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            placeholder="What are you most excited about on this trip?"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Total budget (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold" style={{ fontFamily: M }}>$</span>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="3000"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" style={{ fontFamily: M }} />
          </div>
        </div>
        <button type="submit"
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/25 hover:shadow-xl hover:opacity-90 transition-all mt-2 cursor-pointer">
          Create trip & build itinerary →
        </button>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ITINERARY SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function ItineraryScreen({ trip, onUpdate }: { trip: Trip; onUpdate: (t: Trip) => void }) {
  const [selected, setSelected] = useState<string | null>(trip?.stops[0]?.id ?? null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddAct, setShowAddAct] = useState(false);
  const [stopForm, setStopForm] = useState({ city: "", country: "", flag: "", start: "", end: "" });
  const [actForm, setActForm] = useState({ name: "", type: "sightseeing" as ActivityType, cost: "", duration: "", time: "" });

  const stop = trip?.stops?.find(s => s.id === selected);

  function addStop() {
    if (!stopForm.city) return;
    const imgs: Record<string, string> = {
      paris: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=260&fit=crop&auto=format",
      tokyo: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400&h=260&fit=crop&auto=format",
    };
    const ns: Stop = {
      id: "s" + Date.now(), city: stopForm.city, country: stopForm.country || "Unknown",
      flag: stopForm.flag || "🌍", startDate: stopForm.start, endDate: stopForm.end,
      img: imgs[stopForm.city.toLowerCase()] || "https://images.unsplash.com/photo-1472146936668-d987bf0a6e38?w=400&h=260&fit=crop&auto=format",
      activities: [],
    };
    const updated = { ...trip, stops: [...trip.stops, ns] };
    onUpdate(updated);
    setSelected(ns.id);
    setShowAddStop(false);
    setStopForm({ city: "", country: "", flag: "", start: "", end: "" });
  }

  function addActivity() {
    if (!actForm.name || !selected) return;
    const act: Activity = {
      id: "a" + Date.now(), name: actForm.name, type: actForm.type,
      cost: Number(actForm.cost) || 0, duration: actForm.duration, time: actForm.time,
    };
    const updated = {
      ...trip,
      stops: trip.stops.map(s => s.id === selected ? { ...s, activities: [...s.activities, act] } : s),
    };
    onUpdate(updated);
    setShowAddAct(false);
    setActForm({ name: "", type: "sightseeing", cost: "", duration: "", time: "" });
  }

  function removeActivity(stopId: string, actId: string) {
    onUpdate({ ...trip, stops: trip.stops.map(s => s.id === stopId ? { ...s, activities: s.activities.filter(a => a.id !== actId) } : s) });
  }

  if (!trip) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p className="text-sm font-semibold">Select or plan a trip first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-left">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-foreground text-2xl" style={{ fontFamily: D }}>{trip.name}</h1>
          <p className="text-muted-foreground text-sm mt-0.5" style={{ fontFamily: M }}>
            {fmt(trip.startDate)} → {fmt(trip.endDate)} · {trip.stops.length} stops
          </p>
        </div>
        <button onClick={() => setShowAddStop(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary to-indigo-600 shadow shadow-primary/20 hover:opacity-90 transition-all cursor-pointer">
          <Plus size={15} /> Add stop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Stop list */}
        <div className="flex flex-col gap-2">
          {trip.stops.map((s, i) => (
            <button key={s.id} onClick={() => setSelected(s.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${selected === s.id ? "bg-secondary/60 border-primary text-foreground" : "bg-card text-card-foreground border-border hover:bg-muted"}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${selected === s.id ? "bg-primary" : "bg-border"}`} />
              <img src={s.img} alt={s.city} className="w-10 h-10 rounded-lg object-cover bg-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{s.flag} {s.city}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{s.activities.length} activities</p>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}

          {trip.stops.length === 0 && (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card">
              <Compass size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No stops yet. Add your first city!</p>
            </div>
          )}
        </div>

        {/* Stop detail */}
        {stop ? (
          <div className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="relative h-40">
              <img src={stop.img} alt={stop.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-xl" style={{ fontFamily: D }}>{stop.flag} {stop.city}, {stop.country}</h3>
                  <p className="text-white/80 text-xs mt-0.5" style={{ fontFamily: M }}>
                    {fmt(stop.startDate)} → {fmt(stop.endDate)}
                  </p>
                </div>
                <button onClick={() => setShowAddAct(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-white hover:bg-slate-50 shadow cursor-pointer">
                  <Plus size={12} /> Add Activity
                </button>
              </div>
            </div>

            <div className="p-5">
              <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">Scheduled Activities</h4>
              <div className="flex flex-col gap-2.5">
                {stop.activities.map(a => {
                  const meta = ACTIVITY_META[a.type] || ACTIVITY_META.sightseeing;
                  const Icon = meta.icon;
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background/50 hover:border-primary/30 transition-colors group">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                        <Icon size={15} style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{a.name}</p>
                        <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
                          {a.time && <span className="flex items-center gap-0.5"><Clock size={9} />{a.time}</span>}
                          {a.duration && <span>{a.duration}</span>}
                          <span className="capitalize font-semibold" style={{ color: meta.color }}>{a.type}</span>
                        </div>
                      </div>
                      <p className="font-bold text-foreground flex-shrink-0 text-xs font-mono">
                        {a.cost === 0 ? <span className="text-green-500 font-bold">Free</span> : `$${a.cost}`}
                      </p>
                      <button onClick={() => removeActivity(stop.id, a.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-red-600 p-1.5 rounded hover:bg-muted cursor-pointer">
                        <X size={13} />
                      </button>
                    </div>
                  );
                })}
                {stop.activities.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground bg-background/30 rounded-xl border border-dashed border-border">
                    <Camera size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No activities yet. Add things to do in {stop.city}.</p>
                  </div>
                )}
              </div>

              {stop.activities.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">Stop total</span>
                  <span className="font-bold text-foreground font-mono" style={{ fontFamily: M }}>
                    ${stop.activities.reduce((s, a) => s + a.cost, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-card text-muted-foreground rounded-2xl border border-border py-24 shadow-sm">
            <div className="text-center">
              <Compass size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a stop to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Stop modal */}
      {showAddStop && (
        <Modal title="Add a new stop" onClose={() => setShowAddStop(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="City *" value={stopForm.city} onChange={v => setStopForm(p => ({ ...p, city: v }))} placeholder="Paris" />
              <Field label="Country" value={stopForm.country} onChange={v => setStopForm(p => ({ ...p, country: v }))} placeholder="France" />
            </div>
            <Field label="Flag emoji" value={stopForm.flag} onChange={v => setStopForm(p => ({ ...p, flag: v }))} placeholder="🇫🇷" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Arrival" type="date" value={stopForm.start} onChange={v => setStopForm(p => ({ ...p, start: v }))} />
              <Field label="Departure" type="date" value={stopForm.end} onChange={v => setStopForm(p => ({ ...p, end: v }))} />
            </div>
            <button onClick={addStop} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-primary hover:opacity-90 cursor-pointer">Add stop</button>
          </div>
        </Modal>
      )}

      {/* Add Activity modal */}
      {showAddAct && (
        <Modal title={`Add activity in ${stop?.city ?? ""}`} onClose={() => setShowAddAct(false)}>
          <div className="flex flex-col gap-4 text-left">
            <Field label="Activity name *" value={actForm.name} onChange={v => setActForm(p => ({ ...p, name: v }))} placeholder="Eiffel Tower visit" />
            <div>
              <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(ACTIVITY_META) as ActivityType[]).map(t => {
                  const meta = ACTIVITY_META[t];
                  return (
                    <button key={t} onClick={() => setActForm(p => ({ ...p, type: t }))}
                      className={`py-2 text-[10px] font-bold rounded-xl capitalize border cursor-pointer transition-all ${actForm.type === t ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Cost (USD)" value={actForm.cost} onChange={v => setActForm(p => ({ ...p, cost: v }))} placeholder="45" type="number" />
              <Field label="Duration" value={actForm.duration} onChange={v => setActForm(p => ({ ...p, duration: v }))} placeholder="2h" />
              <Field label="Time" value={actForm.time} onChange={v => setActForm(p => ({ ...p, time: v }))} placeholder="10:00" />
            </div>
            <button onClick={addActivity} className="w-full py-3 rounded-xl text-sm font-bold text-white bg-primary hover:opacity-90 cursor-pointer">Add activity</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BUDGET SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const BUDGET_COLORS: Record<ActivityType, string> = {
  stay: "#db2777", transport: "#475569", sightseeing: "#4f46e5",
  food: "#b45309", adventure: "#7c3aed", culture: "#0284c7",
};

function BudgetScreen({ trip }: { trip: Trip }) {
  if (!trip) return <div className="p-6 text-center text-muted-foreground">Select a trip first.</div>;

  const allActs = trip.stops.flatMap(s => s.activities);
  const total = allActs.reduce((s, a) => s + a.cost, 0);
  const over = total > trip.budget;

  // Pie data by category
  const byType: Record<string, number> = {};
  allActs.forEach(a => { byType[a.type] = (byType[a.type] || 0) + a.cost; });
  const pieData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  // Bar data by stop
  const barData = trip.stops.map(s => ({
    name: s.city,
    cost: s.activities.reduce((sum, a) => sum + a.cost, 0),
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto text-left">
      <h1 className="font-bold text-foreground text-2xl mb-2" style={{ fontFamily: D }}>
        Budget Breakdown
      </h1>
      <p className="text-muted-foreground text-sm mb-6">{trip.name} · {fmt(trip.startDate)} → {fmt(trip.endDate)}</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total estimated", value: `$${total.toLocaleString()}`, color: "text-foreground" },
          { label: "Budget set", value: `$${trip.budget.toLocaleString()}`, color: "text-primary" },
          { label: over ? "Over budget by" : "Remaining", value: `$${Math.abs(trip.budget - total).toLocaleString()}`, color: over ? "text-destructive" : "text-green-500" },
          { label: "Avg per day", value: `$${Math.round(total / Math.max(days(trip.startDate, trip.endDate), 1))}`, color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-bold ${color}`} style={{ fontFamily: M, fontSize: "1.35rem" }}>{value}</p>
          </div>
        ))}
      </div>

      {over && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 flex items-center gap-3">
          <AlertTriangle size={18} className="text-destructive flex-shrink-0" />
          <p className="text-xs text-red-700 dark:text-red-400 font-medium">
            You are <span className="font-bold">${(total - trip.budget).toLocaleString()}</span> over your ${trip.budget.toLocaleString()} budget. Consider trimming some activities.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie chart */}
        <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: D }}>By Category</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={BUDGET_COLORS[entry.name as ActivityType] || "#ccc"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v}`, ""]} contentStyle={{ fontFamily: M, fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
                {pieData.map(e => (
                  <div key={e.name} className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: BUDGET_COLORS[e.name as ActivityType] }} />
                    <span className="capitalize">{e.name}</span>
                    <span className="font-bold text-muted-foreground font-mono">${e.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-center text-muted-foreground text-xs py-10">No costs recorded yet.</p>}
        </div>

        {/* Bar chart by city */}
        <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: D }}>Cost per Destination</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.7 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: M, fill: "currentColor", opacity: 0.7 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Cost"]} contentStyle={{ fontFamily: M, fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="cost" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-muted-foreground text-xs py-10">No stops with costs yet.</p>}
        </div>
      </div>

      {/* Itemized table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wider" style={{ fontFamily: D }}>Itemized Costs</h3>
        </div>
        <div className="divide-y divide-border">
          {trip.stops.map(s => (
            <div key={s.id}>
              <div className="px-5 py-2.5 bg-muted/50 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">{s.flag} {s.city}, {s.country}</span>
                <span className="text-xs font-bold text-primary font-mono" style={{ fontFamily: M }}>
                  ${s.activities.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}
                </span>
              </div>
              {s.activities.map(a => {
                const meta = ACTIVITY_META[a.type] || ACTIVITY_META.sightseeing;
                return (
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{a.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize font-semibold">{a.type} {a.duration && `· ${a.duration}`}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-foreground font-mono" style={{ fontFamily: M }}>
                      {a.cost === 0 ? <span className="text-green-500">Free</span> : `$${a.cost}`}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t-2 border-border flex justify-between items-center bg-muted/40">
          <span className="font-bold text-foreground" style={{ fontFamily: D }}>Grand Total</span>
          <span className="font-bold text-xl font-mono" style={{ fontFamily: M, color: over ? "var(--destructive)" : "var(--primary)" }}>
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TIMELINE SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function TimelineScreen({ trip }: { trip: Trip }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  if (!trip) return <div className="p-6 text-center text-muted-foreground">Select a trip first.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto text-left">
      <h1 className="font-bold text-foreground text-2xl mb-1" style={{ fontFamily: D }}>Trip Timeline</h1>
      <p className="text-muted-foreground text-sm mb-8">{trip.name} · {fmt(trip.startDate)} → {fmt(trip.endDate)}</p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="flex flex-col gap-0">
          {trip.stops.map((s, i) => (
            <div key={s.id} className="relative pl-14 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Stop dot */}
              <div className="absolute left-0 w-10 h-10 rounded-full border-4 border-card flex items-center justify-center bg-gradient-to-r from-primary to-indigo-600 shadow-md shadow-primary/20 z-10">
                <span className="text-white text-xs font-extrabold font-mono">{i + 1}</span>
              </div>

              <div className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-sm">
                <button
                  onClick={() => setCollapsed(p => ({ ...p, [s.id]: !p[s.id] }))}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors cursor-pointer">
                  <img src={s.img} alt={s.city} className="w-14 h-14 rounded-xl object-cover bg-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-base" style={{ fontFamily: D }}>{s.flag} {s.city}, {s.country}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-semibold" style={{ fontFamily: M }}>
                      {s.startDate ? `${fmt(s.startDate)} → ${fmt(s.endDate)}` : "Dates TBD"} · {s.activities.length} activities
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-muted-foreground flex-shrink-0 transition-transform duration-250"
                    style={{ transform: collapsed[s.id] ? "rotate(-90deg)" : "rotate(0deg)" }} />
                </button>

                {!collapsed[s.id] && s.activities.length > 0 && (
                  <div className="border-t border-border divide-y divide-border/60 bg-muted/10">
                    {s.activities.map((a) => {
                      const meta = ACTIVITY_META[a.type] || ACTIVITY_META.sightseeing;
                      const Icon = meta.icon;
                      return (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/40 hover:bg-muted/30 transition-colors">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                          {a.time && (
                            <span className="text-[10px] w-10 flex-shrink-0 text-muted-foreground font-bold font-mono" style={{ fontFamily: M }}>{a.time}</span>
                          )}
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                            <Icon size={12} style={{ color: meta.color }} />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-bold text-foreground truncate">{a.name}</p>
                            <p className="text-[9px] text-muted-foreground font-semibold">{a.duration} · <span className="capitalize" style={{ color: meta.color }}>{a.type}</span></p>
                          </div>
                          <span className="text-xs font-bold flex-shrink-0 font-mono" style={{ fontFamily: M }}>
                            {a.cost === 0 ? <span className="text-green-500 font-bold">Free</span> : `$${a.cost}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {trip.stops.length === 0 && (
            <div className="pl-14 text-center py-16 text-muted-foreground">
              <p className="text-xs font-semibold">No stops added yet. Build your itinerary first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function ProfileScreen() {
  const [name, setName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah@example.com");
  const [bio, setBio] = useState("Passionate traveller, amateur photographer, coffee addict ☕");
  const [saved, setSaved] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto text-left">
      <h1 className="font-bold text-foreground text-2xl mb-6" style={{ fontFamily: D }}>Profile & Settings</h1>

      <div className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden mb-5 shadow-sm">
        {/* Cover banner */}
        <div className="h-28 bg-gradient-to-r from-primary to-violet-500" />
        <div className="px-6 pb-6">
          <div className="w-20 h-20 rounded-2xl border-4 border-card -mt-10 mb-4 flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-r from-primary to-indigo-600 shadow-md">
            SJ
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name" value={name} onChange={setName} placeholder="Sarah Johnson" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="sarah@example.com" type="email" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-950/20 dark:border-green-900/30 border border-green-200 rounded-xl px-4 py-2 font-semibold">
                <Check size={14} /> Profile saved successfully
              </div>
            )}
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
              className="self-start px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-primary hover:opacity-90 transition-all cursor-pointer">
              Save changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: D }}>Preferences</h3>
        {[
          { label: "Language", value: "English (US)" },
          { label: "Currency", value: "USD ($)" },
          { label: "Date format", value: "MM/DD/YYYY" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <span className="text-xs text-foreground/80 font-semibold">{label}</span>
            <span className="text-xs font-bold text-primary font-semibold">{value}</span>
          </div>
        ))}
        <button className="mt-5 w-full py-2.5 text-xs font-bold rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all cursor-pointer">
          Delete account
        </button>
      </div>
    </div>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="text-left">
      <label className="block text-xs font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground rounded-2xl border border-border w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: D }}>{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer border-0 p-0">
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════
function AppShell({ onLogout, isDark, setIsDark }: { onLogout: () => void; isDark: boolean; setIsDark: (d: boolean) => void }) {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const [trips, setTrips] = useState<Trip[]>(SEED_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<Trip>(SEED_TRIPS[0]);

  function updateTrip(t: Trip) {
    setTrips(p => p.map(x => x.id === t.id ? t : x));
    setSelectedTrip(t);
  }
  function addTrip(t: Trip) {
    setTrips(p => [...p, t]);
    setSelectedTrip(t);
  }
  function deleteTrip(id: string) {
    setTrips(p => p.filter(t => t.id !== id));
  }

  const ml = collapsed ? 64 : 220;

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: B }}>
      <Sidebar current={screen} onNav={setScreen} onLogout={onLogout} collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      <div style={{ marginLeft: ml, transition: "margin .3s" }}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-card border-b border-border flex items-center px-6 gap-4 text-card-foreground shadow-sm">
          <div className="flex-1" />
          <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-border hover:text-foreground transition-all cursor-pointer border-0">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="relative w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-all cursor-pointer border-0">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow">SJ</div>
            <span className="text-xs font-bold text-foreground hidden sm:block">Sarah Johnson</span>
          </div>
        </header>

        {/* Screen */}
        <main className="relative z-10 animate-in fade-in duration-300">
          {screen === "dashboard" && (
            <DashboardScreen trips={trips} onNav={setScreen} onSelect={setSelectedTrip} />
          )}
          {screen === "my-trips" && (
            <MyTripsScreen trips={trips} onNav={setScreen} onSelect={t => { setSelectedTrip(t); }} onDelete={deleteTrip} />
          )}
          {screen === "create-trip" && (
            <CreateTripScreen onSave={t => { addTrip(t); setSelectedTrip(t); }} />
          )}
          {screen === "itinerary" && (
            <ItineraryScreen trip={selectedTrip} onUpdate={updateTrip} />
          )}
          {screen === "budget" && (
            <BudgetScreen trip={selectedTrip} />
          )}
          {screen === "timeline" && (
            <TimelineScreen trip={selectedTrip} />
          )}
          {screen === "profile" && (
            <ProfileScreen />
          )}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [auth, setAuth] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  if (auth) {
    return <AppShell onLogout={() => setAuth(false)} isDark={isDark} setIsDark={setIsDark} />;
  }

  return <LandingPage onLogin={() => setAuth(true)} isDark={isDark} setIsDark={setIsDark} />;
}
