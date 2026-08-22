import { useState } from "react";
import { Bell } from "lucide-react";
import type { Screen, Trip, Stop, Activity } from "./data/types";
import { SEED_TRIPS } from "./data/seed";
import { B } from "./lib/helpers";
import { Sidebar } from "./components/Sidebar";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { MyTripsScreen } from "./screens/MyTripsScreen";
import { CreateTripScreen } from "./screens/CreateTripScreen";
import { ItineraryScreen } from "./screens/ItineraryScreen";
import { BudgetScreen } from "./screens/BudgetScreen";
import { TimelineScreen } from "./screens/TimelineScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { CitySearchScreen } from "./screens/CitySearchScreen";
import { ActivitySearchScreen } from "./screens/ActivitySearchScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { CommunityScreen } from "./screens/CommunityScreen";

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════
function AppShell({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const [trips, setTrips] = useState<Trip[]>(SEED_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<Trip>(SEED_TRIPS[0]);

  function updateTrip(t: Trip) {
    setTrips((p) => p.map((x) => (x.id === t.id ? t : x)));
    setSelectedTrip(t);
  }
  function addTrip(t: Trip) {
    setTrips((p) => [...p, t]);
    setSelectedTrip(t);
  }
  function deleteTrip(id: string) {
    setTrips((p) => p.filter((t) => t.id !== id));
  }
  function addStopToSelected(stop: Stop) {
    const updated = { ...selectedTrip, stops: [...selectedTrip.stops, stop] };
    updateTrip(updated);
  }
  function addActivityToStop(stopId: string, activity: Activity) {
    const updated = {
      ...selectedTrip,
      stops: selectedTrip.stops.map((s) => (s.id === stopId ? { ...s, activities: [...s.activities, activity] } : s)),
    };
    updateTrip(updated);
  }

  const ml = collapsed ? 64 : 220;

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: B }}>
      <Sidebar current={screen} onNav={setScreen} onLogout={onLogout} collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

      <div style={{ marginLeft: ml, transition: "margin .3s" }}>
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E7E3DC] flex items-center px-6 gap-4">
          <div className="flex-1" />
          <button className="relative w-8 h-8 rounded-xl bg-[#F0EDE8] flex items-center justify-center text-[#78716C] hover:bg-[#E7E3DC] transition-all">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E8A838]" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0EDE8]">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0D7377] to-[#14A3A8] flex items-center justify-center text-[10px] font-bold text-white">SJ</div>
            <span className="text-xs font-semibold text-[#1C1917] hidden sm:block">Sarah Johnson</span>
          </div>
        </header>

        <main>
          {screen === "dashboard" && (
            <DashboardScreen trips={trips} onNav={setScreen} onSelect={setSelectedTrip} />
          )}
          {screen === "my-trips" && (
            <MyTripsScreen trips={trips} onNav={setScreen} onSelect={(t) => setSelectedTrip(t)} onDelete={deleteTrip} />
          )}
          {screen === "create-trip" && (
            <CreateTripScreen onSave={(t) => { addTrip(t); setSelectedTrip(t); }} />
          )}
          {screen === "itinerary" && (
            <ItineraryScreen trip={selectedTrip} onUpdate={updateTrip} onNav={setScreen} />
          )}
          {screen === "city-search" && (
            <CitySearchScreen trip={selectedTrip} onAddStop={addStopToSelected} />
          )}
          {screen === "activity-search" && (
            <ActivitySearchScreen trip={selectedTrip} onAddActivity={addActivityToStop} />
          )}
          {screen === "calendar" && (
            <CalendarScreen trips={trips} onSelectTrip={setSelectedTrip} onNav={setScreen} />
          )}
          {screen === "budget" && (
            <BudgetScreen trip={selectedTrip} />
          )}
          {screen === "timeline" && (
            <TimelineScreen trip={selectedTrip} />
          )}
          {screen === "community" && (
            <CommunityScreen />
          )}
          {screen === "profile" && (
            <ProfileScreen />
          )}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [auth, setAuth] = useState(false);
  return auth ? <AppShell onLogout={() => setAuth(false)} /> : <LoginScreen onLogin={() => setAuth(true)} />;
}
