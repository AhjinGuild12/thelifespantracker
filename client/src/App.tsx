import { useState } from "react";
import { Switch, Route } from "wouter";
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
import NotFound from "@/pages/not-found";
import type { Person, Experience } from "@/types/experiences";

function Router() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [currentView, setCurrentView] = useState<ViewMode>("lifetime");
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [people, setPeople] = useState<Person[]>([]);
  const [customExperiences, setCustomExperiences] = useState<Experience[]>([]);

  const { user } = useAuth();
  const { saveStatus } = useSupabaseSync({
    user,
    birthDate,
    people,
    customExperiences,
    setBirthDate,
    setPeople,
    setCustomExperiences,
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
        <RemainingExperiencesPage
          people={people}
          setPeople={setPeople}
          customExperiences={customExperiences}
          setCustomExperiences={setCustomExperiences}
          saveStatus={saveStatus}
        />
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
