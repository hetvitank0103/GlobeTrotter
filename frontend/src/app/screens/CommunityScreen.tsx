import { useState } from "react";
import { Heart, MessageCircle, Copy, Share2 } from "lucide-react";
import { COMMUNITY_POSTS } from "../data/seed";
import { D, M } from "../lib/helpers";
import { ToolBar } from "../components/Shared";

export function CommunityScreen() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most recent");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  let posts = COMMUNITY_POSTS.filter((p) =>
    p.tripName.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "Most recent") posts = [...posts].sort((a, b) => a.daysAgo - b.daysAgo);
  if (sort === "Most liked") posts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "1.75rem" }}>Community</h1>
        <p className="text-[#78716C] text-sm">
          Trip experiences shared by fellow travelers — get inspired, or copy a plan for yourself.
        </p>
      </div>

      <ToolBar
        search={search} onSearch={setSearch} placeholder="Search trips, destinations, travelers..."
        sortOptions={["Most recent", "Most liked"]} sort={sort} onSort={setSort}
      />

      <div className="flex flex-col gap-5">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div className="flex items-center gap-3 p-4 pb-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
                {p.authorInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1917]">{p.author}</p>
                <p className="text-[11px] text-[#78716C]">{p.daysAgo === 1 ? "1 day ago" : `${p.daysAgo} days ago`}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F4F4] text-[#0D7377] font-semibold">{p.tag}</span>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "1.1rem" }}>{p.tripName}</h3>
              <p className="text-xs text-[#78716C] mb-3">{p.flag} {p.destination}</p>
              <div className="rounded-xl overflow-hidden mb-3 h-52">
                <img src={p.coverImg} alt={p.tripName} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-[#374151] leading-relaxed">{p.excerpt}</p>
            </div>

            <div className="px-4 pb-4 flex items-center gap-4">
              <button onClick={() => setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                style={{ color: liked[p.id] ? "#DC2626" : "#78716C" }}>
                <Heart size={15} fill={liked[p.id] ? "#DC2626" : "none"} />
                {p.likes + (liked[p.id] ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#374151] transition-all">
                <MessageCircle size={15} /> {p.comments}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-[#78716C] hover:text-[#374151] transition-all">
                <Share2 size={14} /> Share
              </button>
              <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#0D7377] text-[#0D7377] hover:bg-[#E8F4F4] transition-all">
                <Copy size={12} /> Copy trip
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16 text-[#78716C] text-sm">No community trips match your search.</div>
        )}
      </div>
    </div>
  );
}
