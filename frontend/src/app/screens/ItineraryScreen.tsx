import { useState } from "react";
import { Plus, X, Compass, Camera, Clock, Search } from "lucide-react";
import type { Trip, Stop, Activity, ActivityType, Screen } from "../data/types";
import { ACTIVITY_META } from "../data/seed";
import { D, M, fmt } from "../lib/helpers";
import { Field, Modal } from "../components/Shared";

export function ItineraryScreen({
  trip, onUpdate, onNav,
}: {
  trip: Trip; onUpdate: (t: Trip) => void; onNav?: (s: Screen) => void;
}) {
  const [selected, setSelected] = useState<string | null>(trip.stops[0]?.id ?? null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddAct, setShowAddAct] = useState(false);
  const [stopForm, setStopForm] = useState({ city: "", country: "", flag: "", start: "", end: "" });
  const [actForm, setActForm] = useState({ name: "", type: "sightseeing" as ActivityType, cost: "", duration: "", time: "" });

  const stop = trip.stops.find((s) => s.id === selected);

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
      stops: trip.stops.map((s) => (s.id === selected ? { ...s, activities: [...s.activities, act] } : s)),
    };
    onUpdate(updated);
    setShowAddAct(false);
    setActForm({ name: "", type: "sightseeing", cost: "", duration: "", time: "" });
  }

  function removeActivity(stopId: string, actId: string) {
    onUpdate({ ...trip, stops: trip.stops.map((s) => (s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== actId) } : s)) });
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-[#1C1917]" style={{ fontFamily: D, fontSize: "1.75rem" }}>{trip.name}</h1>
          <p className="text-[#78716C] text-sm mt-0.5" style={{ fontFamily: M }}>
            {fmt(trip.startDate)} → {fmt(trip.endDate)} · {trip.stops.length} stops
          </p>
        </div>
        <div className="flex gap-2">
          {onNav && (
            <button onClick={() => onNav("city-search")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border border-[#0D7377] text-[#0D7377] hover:bg-[#E8F4F4] transition-all">
              <Search size={15} /> Find a city
            </button>
          )}
          <button onClick={() => setShowAddStop(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl text-white hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
            <Plus size={15} /> Add stop
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="flex flex-col gap-2">
          {trip.stops.map((s, i) => (
            <button key={s.id} onClick={() => setSelected(s.id)}
              className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
              style={selected === s.id
                ? { background: "#E8F4F4", borderColor: "#0D7377" }
                : { background: "white", borderColor: "#E7E3DC" }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: selected === s.id ? "#0D7377" : "#E7E3DC" }} />
              <img src={s.img} alt={s.city} className="w-10 h-10 rounded-lg object-cover bg-[#F0EDE8] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1917] truncate">{s.flag} {s.city}</p>
                <p className="text-[10px] text-[#78716C]">{s.activities.length} activities</p>
              </div>
              <span className="text-[10px] font-bold text-[#0D7377] bg-[#E8F4F4] px-1.5 py-0.5 rounded-full flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}

          {trip.stops.length === 0 && (
            <div className="p-8 text-center text-[#78716C] border-2 border-dashed border-[#E7E3DC] rounded-xl">
              <Compass size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No stops yet. Add your first city!</p>
            </div>
          )}
        </div>

        {stop ? (
          <div className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="relative h-40">
              <img src={stop.img} alt={stop.city} className="w-full h-full object-cover bg-[#F0EDE8]" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(28,25,23,.65) 0%,transparent 55%)" }} />
              <div className="absolute bottom-4 left-5">
                <h2 className="text-white font-bold text-xl" style={{ fontFamily: D }}>{stop.flag} {stop.city}, {stop.country}</h2>
                {stop.startDate && (
                  <p className="text-white/70 text-xs mt-0.5" style={{ fontFamily: M }}>
                    {fmt(stop.startDate)} → {fmt(stop.endDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>Activities & Costs</h3>
                <div className="flex gap-2">
                  {onNav && (
                    <button onClick={() => onNav("activity-search")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E7E3DC] text-[#374151] hover:bg-[#F0EDE8] transition-all">
                      <Search size={12} /> Browse
                    </button>
                  )}
                  <button onClick={() => setShowAddAct(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#0D7377] text-[#0D7377] hover:bg-[#E8F4F4] transition-all">
                    <Plus size={12} /> Add activity
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {stop.activities.map((a) => {
                  const meta = ACTIVITY_META[a.type];
                  const Icon = meta.icon;
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#E7E3DC] hover:bg-[#FAF8F4] transition-colors group">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1C1917] truncate">{a.name}</p>
                        <div className="flex gap-3 text-[10px] text-[#78716C] mt-0.5">
                          {a.time && <span className="flex items-center gap-0.5"><Clock size={9} />{a.time}</span>}
                          {a.duration && <span>{a.duration}</span>}
                          <span className="capitalize" style={{ color: meta.color }}>{a.type}</span>
                        </div>
                      </div>
                      <p className="font-bold text-[#1C1917] flex-shrink-0" style={{ fontFamily: M }}>
                        {a.cost === 0 ? "Free" : `$${a.cost}`}
                      </p>
                      <button onClick={() => removeActivity(stop.id, a.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 ml-1">
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
                {stop.activities.length === 0 && (
                  <div className="py-10 text-center text-[#78716C]">
                    <Camera size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No activities yet. Add things to do in {stop.city}.</p>
                  </div>
                )}
              </div>

              {stop.activities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E7E3DC] flex items-center justify-between">
                  <span className="text-sm text-[#78716C] font-medium">Stop total</span>
                  <span className="font-bold text-[#1C1917]" style={{ fontFamily: M }}>
                    ${stop.activities.reduce((s, a) => s + a.cost, 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-white rounded-2xl border border-[#E7E3DC] py-24 text-[#78716C]">
            <div className="text-center">
              <Compass size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a stop to view details</p>
            </div>
          </div>
        )}
      </div>

      {showAddStop && (
        <Modal title="Add a new stop" onClose={() => setShowAddStop(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="City *" value={stopForm.city} onChange={(v) => setStopForm((p) => ({ ...p, city: v }))} placeholder="Paris" />
              <Field label="Country" value={stopForm.country} onChange={(v) => setStopForm((p) => ({ ...p, country: v }))} placeholder="France" />
            </div>
            <Field label="Flag emoji" value={stopForm.flag} onChange={(v) => setStopForm((p) => ({ ...p, flag: v }))} placeholder="🇫🇷" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Arrival" type="date" value={stopForm.start} onChange={(v) => setStopForm((p) => ({ ...p, start: v }))} />
              <Field label="Departure" type="date" value={stopForm.end} onChange={(v) => setStopForm((p) => ({ ...p, end: v }))} />
            </div>
            <button onClick={addStop} className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>Add stop</button>
          </div>
        </Modal>
      )}

      {showAddAct && (
        <Modal title={`Add activity in ${stop?.city ?? ""}`} onClose={() => setShowAddAct(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Activity name *" value={actForm.name} onChange={(v) => setActForm((p) => ({ ...p, name: v }))} placeholder="Eiffel Tower visit" />
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(ACTIVITY_META) as ActivityType[]).map((t) => {
                  const meta = ACTIVITY_META[t];
                  return (
                    <button key={t} onClick={() => setActForm((p) => ({ ...p, type: t }))}
                      className="py-2 text-xs font-semibold rounded-xl capitalize border transition-all"
                      style={actForm.type === t
                        ? { background: meta.bg, color: meta.color, borderColor: meta.color }
                        : { background: "white", color: "#78716C", borderColor: "#E7E3DC" }}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Cost (USD)" value={actForm.cost} onChange={(v) => setActForm((p) => ({ ...p, cost: v }))} placeholder="45" type="number" />
              <Field label="Duration" value={actForm.duration} onChange={(v) => setActForm((p) => ({ ...p, duration: v }))} placeholder="2h" />
              <Field label="Time" value={actForm.time} onChange={(v) => setActForm((p) => ({ ...p, time: v }))} placeholder="10:00" />
            </div>
            <button onClick={addActivity} className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>Add activity</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
