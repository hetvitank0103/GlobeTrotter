import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Trip } from "../data/types";
import { D, M } from "../lib/helpers";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TRIP_COLORS = ["#0D7377", "#B45309", "#7C3AED", "#BE185D", "#0369A1"];

function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function CalendarScreen({ trips, onSelectTrip, onNav }: {
  trips: Trip[]; onSelectTrip: (t: Trip) => void; onNav: (s: "itinerary") => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const upcoming = trips.find((t) => t.status === "upcoming");
    return upcoming ? new Date(upcoming.startDate) : new Date();
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  function tripsOnDay(day: Date) {
    return trips.filter((t) => {
      if (!t.startDate || !t.endDate) return false;
      const start = toDateOnly(new Date(t.startDate));
      const end = toDateOnly(new Date(t.endDate));
      return day >= start && day <= end;
    });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "1.75rem" }}>Calendar View</h1>
      <p className="text-[#78716C] text-sm mb-6">See all your trips plotted across the year.</p>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#E7E3DC] hover:bg-[#F0EDE8] transition-all">
            <ChevronLeft size={15} />
          </button>
          <h2 className="font-bold text-[#1C1917]" style={{ fontFamily: D, fontSize: "1.2rem" }}>
            {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#E7E3DC] hover:bg-[#F0EDE8] transition-all">
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-[10px] font-bold text-[#78716C] uppercase tracking-wide py-1">{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((day, i) => {
            if (!day) return <div key={i} className="aspect-square" />;
            const dayTrips = tripsOnDay(day);
            const isToday = toDateOnly(day).getTime() === toDateOnly(new Date()).getTime();
            return (
              <button
                key={i}
                onClick={() => { if (dayTrips[0]) { onSelectTrip(dayTrips[0]); onNav("itinerary"); } }}
                className="aspect-square rounded-lg p-1 flex flex-col items-start text-left border transition-all hover:border-[#0D7377]"
                style={{
                  background: dayTrips.length ? `${TRIP_COLORS[trips.indexOf(dayTrips[0]) % TRIP_COLORS.length]}14` : "white",
                  borderColor: isToday ? "#0D7377" : "#F0EDE8",
                }}
              >
                <span className="text-[11px] font-semibold" style={{ fontFamily: M, color: isToday ? "#0D7377" : "#374151" }}>
                  {day.getDate()}
                </span>
                <div className="flex flex-col gap-0.5 mt-auto w-full">
                  {dayTrips.slice(0, 1).map((t) => (
                    <span key={t.id}
                      className="text-[8px] font-bold px-1 py-0.5 rounded truncate w-full text-white"
                      style={{ background: TRIP_COLORS[trips.indexOf(t) % TRIP_COLORS.length] }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        {trips.map((t, i) => (
          <div key={t.id} className="flex items-center gap-2 text-xs text-[#374151]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: TRIP_COLORS[i % TRIP_COLORS.length] }} />
            {t.name}
          </div>
        ))}
      </div>
    </div>
  );
}
