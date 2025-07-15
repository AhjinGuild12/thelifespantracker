import { useState, useEffect } from "react";
import { ViewMode } from "@/pages/life-in-weeks";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeeksGridProps {
  currentView: ViewMode;
  selectedMonth: number;
  calculations: {
    weeksLived: number;
    weeksRemaining: number;
    lifePercentage: number;
    yearProgress: {
      percentage: number;
      daysPassed: number;
      totalDays: number;
    };
  };
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function WeeksGrid({ currentView, selectedMonth, calculations }: WeeksGridProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const isMobile = useIsMobile();
  
  const currentDate = new Date(); // Use actual current date
  const totalLifeWeeks = 4160;
  const weeksPerYear = 52;

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [currentView, selectedMonth]);

  const getGridTitle = () => {
    const currentYear = currentDate.getFullYear();
    switch (currentView) {
      case 'lifetime':
        return 'Your Life in Weeks (80 years)';
      case 'year2025':
        return `${currentYear} Progress (52 weeks)`;
      case 'monthly':
        return `${monthNames[selectedMonth]} ${currentYear}`;
      default:
        return 'Your Life in Weeks';
    }
  };

  const getGridColumns = () => {
    if (currentView === 'monthly') return 'repeat(7, 1fr)';
    
    // Responsive columns based on view and screen size
    if (currentView === 'year2025') {
      return window.innerWidth < 768 ? 'repeat(13, 1fr)' : 'repeat(26, 1fr)';
    }
    
    // Lifetime view
    if (window.innerWidth < 480) return 'repeat(20, 1fr)';
    if (window.innerWidth < 768) return 'repeat(26, 1fr)';
    return 'repeat(52, 1fr)';
  };

  const calculateCurrentWeek = () => {
    const currentYear = currentDate.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const timeDiff = currentDate.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(timeDiff / (24 * 60 * 60 * 1000)) + 1;
    return Math.min(Math.ceil(dayOfYear / 7), 52);
  };

  const renderLifetimeView = () => {
    const boxes = [];
    for (let i = 0; i < totalLifeWeeks; i++) {
      const year = Math.floor(i / weeksPerYear) + 1;
      const week = (i % weeksPerYear) + 1;
      
      let className = 'week-box ';
      let content = '';
      
      if (i < calculations.weeksLived) {
        className += 'lived';
        content = '✓';
      } else if (i === calculations.weeksLived && calculations.weeksLived > 0) {
        className += 'current';
        content = '●';
      } else {
        className += 'empty';
      }
      
      boxes.push(
        <div
          key={i}
          className={className}
          title={`Year ${year}, Week ${week}`}
          data-week={i + 1}
        >
          {content}
        </div>
      );
    }
    return boxes;
  };

  const render2025View = () => {
    const currentWeek = calculateCurrentWeek();
    const boxes = [];
    
    for (let i = 0; i < 52; i++) {
      let className = 'week-box ';
      let content = '';
      
      if (i < currentWeek - 1) {
        className += 'lived';
        content = '✓';
      } else if (i === currentWeek - 1) {
        className += 'current';
        content = '●';
      } else {
        className += 'empty';
      }
      
      boxes.push(
        <div
          key={i}
          className={className}
          title={`Week ${i + 1} of 2025`}
          data-week={i + 1}
        >
          {content}
        </div>
      );
    }
    return boxes;
  };

  const renderMonthlyView = () => {
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
    const currentDay = selectedMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? currentDate.getDate() : 0;
    const firstDay = new Date(currentYear, selectedMonth, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    const boxes = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      boxes.push(
        <div key={`empty-${i}`} className="week-box" style={{ visibility: 'hidden' }} />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      let className = 'week-box ';
      
      const currentYear = currentDate.getFullYear();
      if (selectedMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
        if (day < currentDay) {
          className += 'lived';
        } else if (day === currentDay) {
          className += 'current';
        } else {
          className += 'empty';
        }
      } else if (selectedMonth < currentDate.getMonth() || currentYear < currentDate.getFullYear()) {
        className += 'lived';
      } else {
        className += 'empty';
      }
      
      boxes.push(
        <div
          key={day}
          className={className}
          title={`${monthNames[selectedMonth]} ${day}, ${currentDate.getFullYear()}`}
        >
          {day}
        </div>
      );
    }
    
    return boxes;
  };

  const renderGrid = () => {
    switch (currentView) {
      case 'lifetime':
        return renderLifetimeView();
      case 'year2025':
        return render2025View();
      case 'monthly':
        return renderMonthlyView();
      default:
        return [];
    }
  };

  return (
    <section className="visualization-section">
      <div className="grid-container">
        <div className="grid-header">
          <h2 className="grid-title">{getGridTitle()}</h2>
          <div className="grid-legend">
            <div className="legend-item">
              <div className="legend-box lived">✓</div>
              <span>Weeks lived</span>
            </div>
            <div className="legend-item">
              <div className="legend-box current">●</div>
              <span>Current week</span>
            </div>
            <div className="legend-item">
              <div className="legend-box remaining"></div>
              <span>Weeks remaining</span>
            </div>
          </div>
        </div>
        
        <div 
          className={`weeks-grid ${fadeIn ? 'fade-in' : ''}`}
          style={{ gridTemplateColumns: getGridColumns() }}
        >
          {renderGrid()}
        </div>
      </div>
    </section>
  );
}
