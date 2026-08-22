import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Trip, ActivityType } from "../data/types";
import { ACTIVITY_META } from "../data/seed";
import { D, B, M, fmt, days } from "../lib/helpers";

const BUDGET_COLORS: Record<ActivityType, string> = {
  stay: "#BE185D", transport: "#374151", sightseeing: "#0D7377",
  food: "#B45309", adventure: "#7C3AED", culture: "#0369A1",
};

export function BudgetScreen({ trip }: { trip: Trip }) {
  const allActs = trip.stops.flatMap((s) => s.activities);
  const total = allActs.reduce((s, a) => s + a.cost, 0);
  const over = total > trip.budget;

  const byType: Record<string, number> = {};
  allActs.forEach((a) => { byType[a.type] = (byType[a.type] || 0) + a.cost; });
  const pieData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  const barData = trip.stops.map((s) => ({
    name: s.city,
    cost: s.activities.reduce((sum, a) => sum + a.cost, 0),
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="font-bold text-[#1C1917] mb-2" style={{ fontFamily: D, fontSize: "1.75rem" }}>
        Budget Breakdown
      </h1>
      <p className="text-[#78716C] text-sm mb-6">{trip.name} · {fmt(trip.startDate)} → {fmt(trip.endDate)}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total estimated", value: `$${total.toLocaleString()}`, color: "#1C1917" },
          { label: "Budget set", value: `$${trip.budget.toLocaleString()}`, color: "#0D7377" },
          { label: over ? "Over by" : "Remaining", value: `$${Math.abs(trip.budget - total).toLocaleString()}`, color: over ? "#DC2626" : "#16A34A" },
          { label: "Avg per day", value: `$${Math.round(total / Math.max(days(trip.startDate, trip.endDate), 1))}`, color: "#B45309" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-[#E7E3DC]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <p className="text-[11px] text-[#78716C] font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className="font-bold" style={{ fontFamily: M, fontSize: "1.5rem", color }}>{value}</p>
          </div>
        ))}
      </div>

      {over && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            You are <span className="font-bold">${(total - trip.budget).toLocaleString()}</span> over your ${trip.budget.toLocaleString()} budget. Consider trimming some activities.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#E7E3DC]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <h3 className="font-bold text-[#1C1917] mb-5" style={{ fontFamily: D }}>By Category</h3>
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
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
                {pieData.map((e) => (
                  <div key={e.name} className="flex items-center gap-1.5 text-xs text-[#374151]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: BUDGET_COLORS[e.name as ActivityType] }} />
                    <span className="capitalize">{e.name}</span>
                    <span className="font-bold" style={{ fontFamily: M }}>${e.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-center text-[#78716C] text-sm py-10">No costs recorded yet.</p>}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E7E3DC]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <h3 className="font-bold text-[#1C1917] mb-5" style={{ fontFamily: D }}>Cost per Destination</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: B, fill: "#78716C" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: M, fill: "#78716C" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Cost"]} contentStyle={{ fontFamily: M, fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="cost" fill="#0D7377" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-[#78716C] text-sm py-10">No stops with costs yet.</p>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div className="px-5 py-4 border-b border-[#E7E3DC]">
          <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>Itemized Costs</h3>
        </div>
        <div className="divide-y divide-[#E7E3DC]">
          {trip.stops.map((s) => (
            <div key={s.id}>
              <div className="px-5 py-2.5 bg-[#FAF8F4] flex items-center justify-between">
                <span className="text-xs font-bold text-[#374151] uppercase tracking-wide">{s.flag} {s.city}, {s.country}</span>
                <span className="text-xs font-bold text-[#0D7377]" style={{ fontFamily: M }}>
                  ${s.activities.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}
                </span>
              </div>
              {s.activities.map((a) => {
                const meta = ACTIVITY_META[a.type];
                return (
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                      <div>
                        <p className="text-sm text-[#1C1917]">{a.name}</p>
                        <p className="text-[10px] text-[#78716C] capitalize">{a.type} {a.duration && `· ${a.duration}`}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#1C1917]" style={{ fontFamily: M }}>
                      {a.cost === 0 ? <span className="text-[#16A34A]">Free</span> : `$${a.cost}`}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t-2 border-[#E7E3DC] flex justify-between items-center bg-[#FAF8F4]">
          <span className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>Grand Total</span>
          <span className="font-bold text-xl" style={{ fontFamily: M, color: over ? "#DC2626" : "#0D7377" }}>
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
