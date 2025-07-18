import { useState, useEffect } from "react";
import AgeInput from "@/components/life-in-weeks/age-input";
import ViewSelector from "@/components/life-in-weeks/view-selector";
import StatisticsCards from "@/components/life-in-weeks/statistics-cards";
import WeeksGrid from "@/components/life-in-weeks/weeks-grid";
import InspirationQuote from "@/components/life-in-weeks/inspiration-quote";
import { useLifeCalculations } from "@/hooks/use-life-calculations";

export type ViewMode = 'lifetime' | 'year2025' | 'monthly';

export default function LifeInWeeksPage() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [currentView, setCurrentView] = useState<ViewMode>('lifetime');
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // July (0-indexed)
  
  const calculations = useLifeCalculations(birthDate);

  return (
    <div className="life-weeks-container">
      <div className="life-weeks-main">
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

        {/* Debug timezone and time accuracy */}
        <div style={{padding: '8px', background: '#f8f9fa', margin: '10px 0', borderRadius: '4px', fontSize: '12px', textAlign: 'center', color: '#666'}}>
          Local time: {new Date().toLocaleString()} | Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>

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
