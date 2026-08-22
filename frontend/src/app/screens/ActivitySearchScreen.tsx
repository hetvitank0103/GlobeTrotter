import { useState } from "react";
import { Star, Plus, Check, Clock } from "lucide-react";
import type { Trip, Activity, ActivityType, ActivityListing } from "../data/types";
import { ACTIVITY_CATALOG, ACTIVITY_META } from "../data/seed";
import { D, M } from "../lib/helpers";
import { ToolBar } from "../components/Shared";

const TYPES: ("all" | ActivityType)[] = ["all", "sightseeing", "food", "adventure", "culture", "stay", "transport"];

export function ActivitySearchScreen({
  trip, onAddActivity,
}: {
  trip: Trip | null; onAddActivity: (stopId: string, activity: Activity) => void;
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | ActivityType>("all");
  const [sort, setSort] = useState("Rating");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  let results = ACTIVITY_CATALOG.filter((a) =>
    (type === "all" || a.type === type) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === "Rating") results = [...results].sort((a, b) => b.rating - a.rating);
  if (sort === "Cost: Low to High") results = [...results].sort((a, b) => a.cost - b.cost);
  if (sort === "Cost: High to Low") results = [...results].sort((a, b) => b.cost - a.cost);

  function targetStopId(a: ActivityListing): string | null {
    if (!trip || trip.stops.length === 0) return null;
    const match = trip.stops.find((s) => s.city.toLowerCase() === a.city.toLowerCase());
    return (match || trip.stops[0]).id;
  }

  function handleAdd(a: ActivityListing) {
    const stopId = targetStopId(a);
    if (!stopId) return;
    const activity: Activity = {
      id: "a" + Date.now(), name: a.name, type: a.type, cost: a.cost, duration: a.duration, time: "",
    };
    onAddActivity(stopId, activity);
    setAdded((p) => ({ ...p, [a.id]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [a.id]: false })), 2000);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "1.75rem" }}>Discover Activities</h1>
        <p className="text-[#78716C] text-sm">
          {trip && trip.stops.length > 0
            ? <>Adding to the closest matching stop in <span className="font-semibold text-[#0D7377]">{trip.name}</span></>
            : "Select a trip with at least one stop to add activities directly."}
        </p>
      </div>

      <ToolBar
        search={search} onSearch={setSearch} placeholder="Search activities or cities..."
        sortOptions={["Rating", "Cost: Low to High", "Cost: High to Low"]}
        sort={sort} onSort={setSort}
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setType(t)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all"
            style={type === t
              ? { background: "#0D7377", color: "white", borderColor: "#0D7377" }
              : { background: "white", color: "#78716C", borderColor: "#E7E3DC" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((a) => {
          const meta = ACTIVITY_META[a.type];
          return (
            <div key={a.id} className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <div className="relative h-36">
                <img src={a.img} alt={a.name} className="w-full h-full object-cover bg-[#F0EDE8]" />
                <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: meta.bg, color: meta.color }}>
                  {a.type}
                </span>
                <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-[#1C1917]/70 text-white font-bold flex items-center gap-0.5">
                  <Star size={9} fill="#E8A838" color="#E8A838" /> {a.rating}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1C1917] text-sm leading-snug mb-1" style={{ fontFamily: D }}>{a.name}</h3>
                <p className="text-xs text-[#78716C] mb-2">{a.city}</p>
                <p className="text-xs text-[#78716C] leading-relaxed mb-3 line-clamp-2">{a.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#374151]">
                    <span className="font-bold" style={{ fontFamily: M }}>{a.cost === 0 ? "Free" : `$${a.cost}`}</span>
                    <span className="flex items-center gap-0.5 text-[#78716C]"><Clock size={10} />{a.duration}</span>
                  </div>
                  <button onClick={() => handleAdd(a)} disabled={!trip || trip.stops.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: added[a.id] ? "#16A34A" : "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
                    {added[a.id] ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {results.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#78716C] text-sm">No activities match your search.</div>
        )}
      </div>
    </div>
  );
}
