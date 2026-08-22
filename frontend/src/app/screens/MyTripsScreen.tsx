import { useState } from "react";
import { PlusCircle, Eye, Calendar, Wallet, Trash2, AlertTriangle } from "lucide-react";
import type { Trip, Screen } from "../data/types";
import { D, M, fmt, days, tripTotal } from "../lib/helpers";
import { ToolBar } from "../components/Shared";

export function MyTripsScreen({
  trips, onNav, onSelect, onDelete,
}: {
  trips: Trip[]; onNav: (s: Screen) => void;
  onSelect: (t: Trip) => void; onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [search, setSearch] = useState("");
  const filtered = trips
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-bold text-[#1C1917]" style={{ fontFamily: D, fontSize: "1.75rem" }}>My Trips</h1>
        <button onClick={() => onNav("create-trip")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl text-white hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
          <PlusCircle size={15} /> Plan new trip
        </button>
      </div>

      <ToolBar search={search} onSearch={setSearch} placeholder="Search trips..." />

      <div className="flex gap-2 mb-6">
        {(["all", "upcoming", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize border transition-all"
            style={filter === f
              ? { background: "#0D7377", color: "white", borderColor: "#0D7377" }
              : { background: "white", color: "#78716C", borderColor: "#E7E3DC" }}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((t) => {
          const total = tripTotal(t);
          const over = total > t.budget;
          return (
            <div key={t.id} className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <div className="relative h-44">
                <img src={t.coverImg} alt={t.name} className="w-full h-full object-cover bg-[#F0EDE8]" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(28,25,23,.65) 0%,transparent 55%)" }} />
                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={t.status === "upcoming"
                    ? { background: "#E8A838", color: "#1C1917" }
                    : { background: "rgba(255,255,255,.2)", color: "white", backdropFilter: "blur(4px)" }}>
                  {t.status === "upcoming" ? "Upcoming" : "Completed"}
                </span>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: D }}>{t.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5" style={{ fontFamily: M }}>
                    {fmt(t.startDate)} → {fmt(t.endDate)} · {days(t.startDate, t.endDate)} days
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {t.stops.map((s) => (
                    <span key={s.id} className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0EDE8] text-[#374151] font-medium">
                      {s.flag} {s.city}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-[#78716C] uppercase tracking-wide font-semibold">Estimated cost</p>
                    <p className="font-bold text-[#1C1917]" style={{ fontFamily: M }}>${total.toLocaleString()}</p>
                    {over && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertTriangle size={9} /> Over budget by ${(total - t.budget).toLocaleString()}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#78716C] uppercase tracking-wide font-semibold">Stops</p>
                    <p className="font-bold text-[#1C1917]" style={{ fontFamily: M }}>{t.stops.length} cities</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { onSelect(t); onNav("itinerary"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl text-white hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
                    <Eye size={12} /> View
                  </button>
                  <button onClick={() => { onSelect(t); onNav("timeline"); }}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-[#E7E3DC] text-[#374151] hover:bg-[#F0EDE8] transition-all">
                    <Calendar size={12} />
                  </button>
                  <button onClick={() => { onSelect(t); onNav("budget"); }}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-[#E7E3DC] text-[#374151] hover:bg-[#F0EDE8] transition-all">
                    <Wallet size={12} />
                  </button>
                  <button onClick={() => onDelete(t.id)}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button onClick={() => onNav("create-trip")}
          className="border-2 border-dashed border-[#E7E3DC] rounded-2xl flex flex-col items-center justify-center gap-3 py-16 hover:border-[#0D7377] hover:bg-[#E8F4F4]/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F4F4] flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle size={22} style={{ color: "#0D7377" }} />
          </div>
          <p className="text-sm font-semibold text-[#78716C] group-hover:text-[#0D7377] transition-colors">Plan a new trip</p>
        </button>
      </div>
    </div>
  );
}
