import React from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { D } from "../lib/helpers";

export function Field({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all"
      />
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(28,25,23,.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl border border-[#E7E3DC] w-full max-w-md p-6 max-h-[88vh] overflow-y-auto" style={{ boxShadow: "0 24px 60px rgba(0,0,0,.18)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#1C1917]" style={{ fontFamily: D, fontSize: "1.1rem" }}>{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#F0EDE8] transition-all">
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Shared search / group-by / filter / sort-by toolbar used across list screens (per wireframes). */
export function ToolBar({
  search, onSearch, placeholder = "Search ....",
  sortOptions, sort, onSort,
  filterLabel = "Filter", groupLabel = "Group by",
}: {
  search: string; onSearch: (v: string) => void; placeholder?: string;
  sortOptions?: string[]; sort?: string; onSort?: (v: string) => void;
  filterLabel?: string; groupLabel?: string;
}) {
  const [showSort, setShowSort] = React.useState(false);
  return (
    <div className="flex items-center gap-2 mb-5 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
        <input
          value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E7E3DC] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all"
        />
      </div>
      <button className="px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F0EDE8] transition-all">
        {groupLabel}
      </button>
      <button className="px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F0EDE8] transition-all">
        {filterLabel}
      </button>
      {sortOptions && (
        <div className="relative">
          <button onClick={() => setShowSort((p) => !p)}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F0EDE8] transition-all">
            {sort || "Sort by..."} <ChevronDown size={12} />
          </button>
          {showSort && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#E7E3DC] rounded-xl shadow-lg py-1 min-w-[160px]">
              {sortOptions.map((o) => (
                <button key={o} onClick={() => { onSort?.(o); setShowSort(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#374151] hover:bg-[#F0EDE8]">
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
