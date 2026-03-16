import { useState } from "react";
import { Switch, Route } from "wouter";
import { Users, CalendarRange } from "lucide-react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseSync } from "@/hooks/use-supabase-sync";
import LifeInWeeksPage from "@/pages/life-in-weeks";
import type { ViewMode } from "@/pages/life-in-weeks";
import RemainingExperiencesPage from "@/pages/remaining-experiences";
import CalendarPage from "@/pages/calendar";
import AuthGate from "@/components/auth/AuthGate";
import NotFound from "@/pages/not-found";
import type { Person, Experience } from "@/types/experiences";
import type { CalendarNote } from "@/types/calendar";

const IS_CREATOR_BYPASS = import.meta.env.VITE_CREATOR_BYPASS === "true";

function Router() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [currentView, setCurrentView] = useState<ViewMode>("lifetime");
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [people, setPeople] = useState<Person[]>([]);
  const [customExperiences, setCustomExperiences] = useState<Experience[]>([]);
  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);

  const { user } = useAuth();
  const hasAccess = !!user || IS_CREATOR_BYPASS;
  const { saveStatus } = useSupabaseSync({
    user,
    birthDate,
    people,
    customExperiences,
    calendarNotes,
    setBirthDate,
    setPeople,
    setCustomExperiences,
    setCalendarNotes,
  });

  return (
    <Switch>
      <Route path="/">
        <LifeInWeeksPage
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          currentView={currentView}
          setCurrentView={setCurrentView}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          saveStatus={saveStatus}
        />
      </Route>
      <Route path="/experiences">
        {hasAccess ? (
          <RemainingExperiencesPage
            people={people}
            setPeople={setPeople}
            customExperiences={customExperiences}
            setCustomExperiences={setCustomExperiences}
            saveStatus={saveStatus}
          />
        ) : (
          <AuthGate
            title="Remaining Experiences"
            description="Track the moments you have left with the people who matter most."
            icon={Users}
            saveStatus={saveStatus}
          />
        )}
      </Route>
      <Route path="/calendar">
        {hasAccess ? (
          <CalendarPage
            calendarNotes={calendarNotes}
            setCalendarNotes={setCalendarNotes}
            saveStatus={saveStatus}
          />
        ) : (
          <AuthGate
            title="Calendar"
            description="Visualize your year and capture notes for every day that matters."
            icon={CalendarRange}
            saveStatus={saveStatus}
          />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
