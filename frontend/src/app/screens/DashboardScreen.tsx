import { PlusCircle, Map, Calendar, Wallet, Eye, Star, AlertTriangle } from "lucide-react";
import type { Trip, Screen } from "../data/types";
import { CITIES } from "../data/seed";
import { D, M, fmt, days, tripTotal } from "../lib/helpers";

export function DashboardScreen({
  trips, onNav, onSelect,
}: {
  trips: Trip[]; onNav: (s: Screen) => void; onSelect: (t: Trip) => void;
}) {
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const featured = upcoming[0] || trips[0];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-[#78716C] mb-1">Good morning ✈️</p>
        <h1 className="font-bold text-[#1C1917]" style={{ fontFamily: D, fontSize: "1.9rem" }}>Where to next, Sarah?</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6">
          {featured && (
            <div className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
              <div className="relative h-56">
                <img src={featured.coverImg} alt={featured.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(28,25,23,.7) 0%,transparent 60%)" }} />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#E8A838", color: "#1C1917" }}>
                    {featured.status === "upcoming" ? "Upcoming" : "Featured trip"}
                  </span>
                </div>
                <div className="absolute bottom-5 left-6 right-6">
                  <h2 className="text-white font-bold text-2xl" style={{ fontFamily: D }}>{featured.name}</h2>
                  <p className="text-white/70 text-sm mt-1" style={{ fontFamily: M }}>
                    {fmt(featured.startDate)} → {fmt(featured.endDate)} · {days(featured.startDate, featured.endDate)} days
                  </p>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[11px] text-[#78716C] uppercase tracking-wide font-semibold">Estimated cost</p>
                  <p className="font-bold text-lg" style={{ fontFamily: M, color: "#1C1917" }}>
                    ${tripTotal(featured).toLocaleString()}
                  </p>
                  {tripTotal(featured) > featured.budget && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5"><AlertTriangle size={10} /> Over budget</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { onSelect(featured); onNav("itinerary"); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
                    <Eye size={13} /> View itinerary
                  </button>
                  <button onClick={() => { onSelect(featured); onNav("budget"); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-[#E7E3DC] text-[#374151] hover:bg-[#F0EDE8] transition-all">
                    <Wallet size={13} /> Budget
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-5 border border-[#E7E3DC]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <h3 className="font-bold text-[#1C1917] mb-4" style={{ fontFamily: D }}>Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New trip", icon: PlusCircle, screen: "create-trip" as Screen, color: "#0D7377", bg: "#E8F4F4" },
                { label: "My trips", icon: Map, screen: "my-trips" as Screen, color: "#B45309", bg: "#FEF3C7" },
                { label: "Timeline", icon: Calendar, screen: "timeline" as Screen, color: "#7C3AED", bg: "#EDE9FE" },
                { label: "Budget", icon: Wallet, screen: "budget" as Screen, color: "#BE185D", bg: "#FCE7F3" },
              ].map(({ label, icon: Icon, screen, color, bg }) => (
                <button key={label} onClick={() => onNav(screen)}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-[#E7E3DC] hover:shadow-sm hover:-translate-y-0.5 transition-all">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-xs font-semibold text-[#374151]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E7E3DC]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>Trending Destinations</h3>
              <button onClick={() => onNav("city-search")} className="text-xs font-semibold text-[#0D7377] hover:underline">See all</button>
            </div>
            <div className="flex flex-col gap-3">
              {CITIES.slice(0, 3).map((d) => (
                <div key={d.city} className="flex items-center gap-3">
                  <img src={d.img} alt={d.city} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-[#F0EDE8]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1C1917] truncate">{d.flag} {d.city}</p>
                    <p className="text-xs text-[#78716C]">{d.country} · <span style={{ fontFamily: M }}>${d.costPerDay}/day</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-[#B45309] flex items-center gap-0.5"><Star size={10} fill="#B45309" /> {d.rating}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8F4F4] text-[#0D7377] font-semibold">{d.tag}</span>
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
