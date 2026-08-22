import React, { useState } from "react";
import { Check } from "lucide-react";
import type { Trip } from "../data/types";
import { D, M } from "../lib/helpers";

export function CreateTripScreen({ onSave }: { onSave: (t: Trip) => void }) {
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

  if (saved) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-[#E8F4F4] flex items-center justify-center mb-6">
          <Check size={36} style={{ color: "#0D7377" }} />
        </div>
        <h2 className="font-bold text-[#1C1917] mb-2" style={{ fontFamily: D, fontSize: "1.75rem" }}>Trip created!</h2>
        <p className="text-[#78716C] mb-6">Now build your itinerary by adding stops and activities.</p>
        <button onClick={() => setSaved(false)}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
          Create another trip
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bold text-[#1C1917] mb-2" style={{ fontFamily: D, fontSize: "1.75rem" }}>Plan a new trip</h1>
      <p className="text-[#78716C] text-sm mb-8">Start with the basics — you can add stops and activities next.</p>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-[#E7E3DC] p-7 flex flex-col gap-5"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
        <div>
          <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">Trip name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mediterranean Summer 2025"
            required className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">Start date *</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">End date *</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">Trip description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
            placeholder="What are you most excited about on this trip?"
            className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">Total budget (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C] text-sm font-medium" style={{ fontFamily: M }}>$</span>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="3000"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" style={{ fontFamily: M }} />
          </div>
        </div>
        <button type="submit"
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all mt-2"
          style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)", boxShadow: "0 4px 16px rgba(13,115,119,.25)" }}>
          Create trip &amp; build itinerary →
        </button>
      </form>
    </div>
  );
}
