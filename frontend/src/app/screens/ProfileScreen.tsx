import { useState } from "react";
import { Check } from "lucide-react";
import { D, M } from "../lib/helpers";
import { Field } from "../components/Shared";

export function ProfileScreen() {
  const [name, setName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah@example.com");
  const [bio, setBio] = useState("Passionate traveller, amateur photographer, coffee addict ☕");
  const [saved, setSaved] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bold text-[#1C1917] mb-6" style={{ fontFamily: D, fontSize: "1.75rem" }}>Profile & Settings</h1>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden mb-5"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div className="h-28" style={{ background: "linear-gradient(135deg,#0D7377,#E8A838)" }} />
        <div className="px-6 pb-6">
          <div className="w-20 h-20 rounded-2xl border-4 border-white -mt-10 mb-4 flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)", boxShadow: "0 4px 12px rgba(0,0,0,.12)" }}>
            SJ
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name" value={name} onChange={setName} placeholder="Sarah Johnson" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="sarah@example.com" type="email" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wide">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] bg-[#FAF8F4] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0D7377]/30 focus:border-[#0D7377] transition-all" />
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-sm text-[#16A34A] bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                <Check size={14} /> Profile saved successfully
              </div>
            )}
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
              className="self-start px-6 py-2.5 text-sm font-bold rounded-xl text-white hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#0D7377,#14A3A8)" }}>
              Save changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <h3 className="font-bold text-[#1C1917] mb-4" style={{ fontFamily: D }}>Preferences</h3>
        {[
          { label: "Language", value: "English (US)" },
          { label: "Currency", value: "USD ($)" },
          { label: "Date format", value: "MM/DD/YYYY" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-[#E7E3DC] last:border-0">
            <span className="text-sm text-[#374151]">{label}</span>
            <span className="text-sm font-semibold text-[#0D7377]">{value}</span>
          </div>
        ))}
        <button className="mt-5 w-full py-2.5 text-sm font-semibold rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
          Delete account
        </button>
      </div>
    </div>
  );
}
