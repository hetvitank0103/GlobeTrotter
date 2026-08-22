import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "../components/Logo";
import { D, B } from "../lib/helpers";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("sarah@example.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1100);
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: B }}>
      {/* Left: hero image */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=900&fit=crop&auto=format"
          alt="Santorini, Greece"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(13,115,119,.72) 0%, rgba(20,30,40,.75) 100%)" }} />
        <div className="relative p-10">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="text-white font-bold text-xl" style={{ fontFamily: D }}>GlobeTrotter</span>
          </div>
        </div>
        <div className="relative p-10 pb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#E8A838] mb-4">Your journey starts here</p>
          <h2 className="text-white font-bold leading-tight mb-4" style={{ fontFamily: D, fontSize: "2.6rem" }}>
            Dream it.<br />Plan it.<br /><em>Live it.</em>
          </h2>
          <p className="text-white/70 leading-relaxed max-w-sm text-sm">
            Build detailed multi-city itineraries, track your budget, and share unforgettable trips with the world.
          </p>
          <div className="flex gap-6 mt-8">
            {[["50K+", "Travelers"], ["120+", "Countries"], ["4.9★", "App rating"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-white font-bold text-lg" style={{ fontFamily: D }}>{v}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center p-8 bg-[#FAF8F4]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Logo size={28} />
            <span className="font-bold text-lg text-[#1C1917]" style={{ fontFamily: D }}>GlobeTrotter</span>
          </div>

          <h1 className="font-bold text-[#1C1917] mb-1" style={{ fontFamily: D, fontSize: "2rem" }}>
            {tab === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-[#78716C] text-sm mb-8">
            {tab === "login" ? "Sign in to access your itineraries." : "Start planning your next adventure."}
          </p>

          <div className="flex rounded-xl overflow-hidden border border-[#E7E3DC] mb-6 bg-[#F0EDE8]">
            {(["login", "signup"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-semibold capitalize transition-all"
                style={tab === t ? { background: "#0D7377", color: "white", borderRadius: "10px" } : { color: "#78716C" }}>
                {t === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah Johnson"
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#374151]">Password</label>
                {tab === "login" && <button type="button" className="text-xs text-[#0D7377] hover:underline font-medium">Forgot password?</button>}
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-70 mt-2"
              style={{ background: "linear-gradient(135deg, #0D7377, #14A3A8)", boxShadow: "0 4px 16px rgba(13,115,119,.3)" }}>
              {loading
                ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                : <>{tab === "login" ? "Sign in" : "Create account"} <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <p className="text-center text-xs text-[#78716C] mt-6">
            {tab === "login" ? "New here? " : "Already have an account? "}
            <button onClick={() => setTab(tab === "login" ? "signup" : "login")} className="text-[#0D7377] font-semibold hover:underline">
              {tab === "login" ? "Create a free account" : "Log in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
