import {
  Globe, Map, PlusCircle, List, Calendar, Wallet, UserCircle,
  LogOut, Menu, CalendarDays, Compass, Users,
} from "lucide-react";
import type { Screen } from "../data/types";
import { Logo } from "./Logo";
import { D } from "../lib/helpers";

const NAV = [
  { screen: "dashboard", icon: Globe, label: "Dashboard" },
  { screen: "my-trips", icon: Map, label: "My Trips" },
  { screen: "create-trip", icon: PlusCircle, label: "New Trip" },
  { screen: "itinerary", icon: List, label: "Itinerary" },
  { screen: "city-search", icon: Compass, label: "Find Cities" },
  { screen: "activity-search", icon: Compass, label: "Find Activities" },
  { screen: "calendar", icon: CalendarDays, label: "Calendar" },
  { screen: "timeline", icon: Calendar, label: "Timeline" },
  { screen: "budget", icon: Wallet, label: "Budget" },
  { screen: "community", icon: Users, label: "Community" },
  { screen: "profile", icon: UserCircle, label: "Profile" },
] as const;

export function Sidebar({
  current, onNav, onLogout, collapsed, onToggle,
}: {
  current: Screen; onNav: (s: Screen) => void;
  onLogout: () => void; collapsed: boolean; onToggle: () => void;
}) {
  return (
    <aside
      className="fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-[#E7E3DC] transition-all duration-300"
      style={{ width: collapsed ? 64 : 220 }}
    >
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[#E7E3DC] flex-shrink-0">
        <Logo size={28} />
        {!collapsed && <span className="font-bold text-[#1C1917]" style={{ fontFamily: D }}>GlobeTrotter</span>}
      </div>

      <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ screen, icon: Icon, label }) => {
          const active = current === screen;
          return (
            <button
              key={screen}
              onClick={() => onNav(screen as Screen)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group w-full text-left flex-shrink-0"
              style={active ? { background: "#0D7377", color: "white" } : { color: "#78716C" }}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#1C1917] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-[#E7E3DC] pt-3 flex flex-col gap-0.5 flex-shrink-0">
        <button onClick={onToggle} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#78716C] hover:bg-[#F0EDE8] transition-all w-full">
          <Menu size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 transition-all w-full">
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
