import { useState, useEffect } from "react";
import AgeInput from "@/components/life-in-weeks/age-input";
import ViewSelector from "@/components/life-in-weeks/view-selector";
import StatisticsCards from "@/components/life-in-weeks/statistics-cards";
import WeeksGrid from "@/components/life-in-weeks/weeks-grid";
import InspirationQuote from "@/components/life-in-weeks/inspiration-quote";
import { useLifeCalculations } from "@/hooks/use-life-calculations";

export type ViewMode = 'lifetime' | 'year2025' | 'monthly';

export default function LifeInWeeksPage() {
  const [age, setAge] = useState<number>(0);
  const [currentView, setCurrentView] = useState<ViewMode>('lifetime');
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // July (0-indexed)
  
  const calculations = useLifeCalculations(age);

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
          <AgeInput age={age} onAgeChange={setAge} />
          
          <ViewSelector 
            currentView={currentView} 
            onViewChange={setCurrentView}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </section>

        {/* Statistics Cards */}
        <StatisticsCards calculations={calculations} />

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
              href="https://www.amazon.com/Four-Thousand-Weeks-Management-Mortals/dp/0374159122" 
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
