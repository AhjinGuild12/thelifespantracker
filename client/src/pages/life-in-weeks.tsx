import AgeInput from "@/components/life-in-weeks/age-input";
import ViewSelector from "@/components/life-in-weeks/view-selector";
import StatisticsCards from "@/components/life-in-weeks/statistics-cards";
import WeeksGrid from "@/components/life-in-weeks/weeks-grid";
import InspirationQuote from "@/components/life-in-weeks/inspiration-quote";
import Navigation from "@/components/navigation";
import { useLifeCalculations } from "@/hooks/use-life-calculations";

import type { SaveStatus } from "@/components/auth/SaveIndicator";

export type ViewMode = 'lifetime' | 'year2025' | 'monthly';

interface LifeInWeeksProps {
  birthDate: string;
  setBirthDate: (value: string) => void;
  currentView: ViewMode;
  setCurrentView: (value: ViewMode) => void;
  selectedMonth: number;
  setSelectedMonth: (value: number) => void;
  saveStatus?: SaveStatus;
}

export default function LifeInWeeksPage({
  birthDate,
  setBirthDate,
  currentView,
  setCurrentView,
  selectedMonth,
  setSelectedMonth,
  saveStatus,
}: LifeInWeeksProps) {

  const calculations = useLifeCalculations(birthDate);

  return (
    <div className="life-weeks-container">
      <div className="life-weeks-main">
        <Navigation saveStatus={saveStatus} />

        {/* Header */}
        <header className="life-weeks-header">
          <h1 className="life-weeks-title">Life In Weeks</h1>
          <p className="life-weeks-subtitle">
            Visualizing your 4,000 weeks to inspire action on what matters most
          </p>
        </header>

        {/* Main Controls */}
        <section className="life-weeks-controls">
          <AgeInput birthDate={birthDate} onBirthDateChange={setBirthDate} />
          
          <ViewSelector 
            currentView={currentView} 
            onViewChange={setCurrentView}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </section>



        {/* Statistics Cards */}
        <StatisticsCards calculations={calculations} birthDate={birthDate} />

        {/* Visualization Grid */}
        <WeeksGrid 
          currentView={currentView}
          selectedMonth={selectedMonth}
          calculations={calculations}
        />

        {/* Inspiration Section */}
        <InspirationQuote />

        {/* Footer */}
        <footer className="footer-section">
          <p className="footer-text">
            Inspired by Oliver Burkeman's book{" "}
            <a 
              href="https://amzn.to/40iGaoR" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              "Four Thousand Weeks: Time Management for Mortals"
            </a>
          </p>
          <p className="footer-subtext">
            A powerful reminder that time is finite and precious. 
            Use this visualization to inspire action on what matters most.
          </p>
        </footer>
      </div>
    </div>
  );
}
