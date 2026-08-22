import { useState } from "react";
import { Star, Plus, Check } from "lucide-react";
import type { Trip, Stop, CityListing } from "../data/types";
import { CITIES } from "../data/seed";
import { D, M } from "../lib/helpers";
import { ToolBar } from "../components/Shared";

const REGIONS = ["All", "Europe", "Asia", "Africa", "South America", "Oceania"];

export function CitySearchScreen({
  trip, onAddStop,
}: {
  trip: Trip | null; onAddStop: (stop: Stop) => void;
}) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [sort, setSort] = useState("Rating");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  let results = CITIES.filter((c) =>
    (region === "All" || c.region === region) &&
    (c.city.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === "Rating") results = [...results].sort((a, b) => b.rating - a.rating);
  if (sort === "Cost: Low to High") results = [...results].sort((a, b) => a.costPerDay - b.costPerDay);
  if (sort === "Cost: High to Low") results = [...results].sort((a, b) => b.costPerDay - a.costPerDay);
  if (sort === "Name (A-Z)") results = [...results].sort((a, b) => a.city.localeCompare(b.city));

  function handleAdd(c: CityListing) {
    const stop: Stop = {
      id: "s" + Date.now(),
      city: c.city, country: c.country, flag: c.flag,
      startDate: "", endDate: "", img: c.img, activities: [],
    };
    onAddStop(stop);
    setAdded((p) => ({ ...p, [c.city]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [c.city]: false })), 2000);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "1.75rem" }}>Discover Cities</h1>
        <p className="text-[#78716C] text-sm">
          {trip ? <>Adding stops to <span className="font-semibold text-[#0D7377]">{trip.name}</span></> : "Select a trip first from My Trips to add cities directly."}
        </p>
      </div>

      <ToolBar
        search={search} onSearch={setSearch} placeholder="Search cities or countries..."
        sortOptions={["Rating", "Cost: Low to High", "Cost: High to Low", "Name (A-Z)"]}
        sort={sort} onSort={setSort}
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {REGIONS.map((r) => (
          <button key={r} onClick={() => setRegion(r)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={region === r
              ? { background: "#0D7377", color: "white", borderColor: "#0D7377" }
              : { background: "white", color: "#78716C", borderColor: "#E7E3DC" }}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((c) => (
          <div key={c.city} className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="relative h-36">
              <img src={c.img} alt={c.city} className="w-full h-full object-cover bg-[#F0EDE8]" />
              <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-[#0D7377] font-semibold">{c.tag}</span>
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-[#1C1917]/70 text-white font-bold flex items-center gap-0.5">
                <Star size={9} fill="#E8A838" color="#E8A838" /> {c.rating}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>{c.flag} {c.city}</h3>
              <p className="text-xs text-[#78716C] mb-3">{c.country}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#374151]" style={{ fontFamily: M }}>${c.costPerDay}/day</span>
                <button onClick={() => handleAdd(c)} disabled={!trip}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: added[c.city] ? "#16A34A" : "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
                  {added[c.city] ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add to trip</>}
                </button>
              </div>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#78716C] text-sm">No cities match your search.</div>
        )}
      </div>
    </div>
  );
}
