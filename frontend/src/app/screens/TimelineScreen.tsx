import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Trip } from "../data/types";
import { ACTIVITY_META } from "../data/seed";
import { D, M, fmt } from "../lib/helpers";

export function TimelineScreen({ trip }: { trip: Trip }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "1.75rem" }}>Trip Timeline</h1>
      <p className="text-[#78716C] text-sm mb-8">{trip.name} · {fmt(trip.startDate)} → {fmt(trip.endDate)}</p>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-[#E7E3DC]" />

        <div className="flex flex-col gap-0">
          {trip.stops.map((s, i) => (
            <div key={s.id} className="relative pl-14 mb-6">
              <div className="absolute left-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)", boxShadow: "0 0 0 3px #E8F4F4" }}>
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>

              <div className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                <button
                  onClick={() => setCollapsed((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#FAF8F4] transition-colors">
                  <img src={s.img} alt={s.city} className="w-14 h-14 rounded-xl object-cover bg-[#F0EDE8] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>{s.flag} {s.city}, {s.country}</h3>
                    <p className="text-xs text-[#78716C] mt-0.5" style={{ fontFamily: M }}>
                      {s.startDate ? `${fmt(s.startDate)} → ${fmt(s.endDate)}` : "Dates TBD"} · {s.activities.length} activities
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-[#78716C] flex-shrink-0 transition-transform"
                    style={{ transform: collapsed[s.id] ? "rotate(-90deg)" : "rotate(0deg)" }} />
                </button>

                {!collapsed[s.id] && s.activities.length > 0 && (
                  <div className="border-t border-[#E7E3DC]">
                    {s.activities.map((a) => {
                      const meta = ACTIVITY_META[a.type];
                      const Icon = meta.icon;
                      return (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#E7E3DC] last:border-0 hover:bg-[#FAF8F4] transition-colors">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                          {a.time && (
                            <span className="text-[10px] w-10 flex-shrink-0 text-[#78716C]" style={{ fontFamily: M }}>{a.time}</span>
                          )}
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                            <Icon size={13} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1C1917]">{a.name}</p>
                            <p className="text-[10px] text-[#78716C]">{a.duration} · <span className="capitalize">{a.type}</span></p>
                          </div>
                          <span className="text-xs font-semibold flex-shrink-0" style={{ fontFamily: M, color: a.cost === 0 ? "#16A34A" : "#1C1917" }}>
                            {a.cost === 0 ? "Free" : `$${a.cost}`}
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
            <div className="pl-14 text-center py-16 text-[#78716C]">
              <p className="text-sm">No stops added yet. Build your itinerary first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
