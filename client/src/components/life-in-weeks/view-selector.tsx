import { ViewMode } from "@/pages/life-in-weeks";

interface ViewSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ViewSelector({ 
  currentView, 
  onViewChange, 
  selectedMonth, 
  onMonthChange 
}: ViewSelectorProps) {
  return (
    <>
      <div className="view-selector">
        <button
          className={`view-btn ${currentView === 'lifetime' ? 'active' : ''}`}
          onClick={() => onViewChange('lifetime')}
        >
          Lifetime
        </button>
        <button
          className={`view-btn ${currentView === 'year2025' ? 'active' : ''}`}
          onClick={() => onViewChange('year2025')}
        >
          2025 Progress
        </button>
        <button
          className={`view-btn ${currentView === 'monthly' ? 'active' : ''}`}
          onClick={() => onViewChange('monthly')}
        >
          Monthly
        </button>
      </div>

      <div className={`month-selector-container ${currentView !== 'monthly' ? 'hidden' : ''}`}>
        <label htmlFor="month" className="age-input-label">Select Month:</label>
        <select
          id="month"
          className="month-select"
          value={selectedMonth}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index}>
              {month} 2025
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
