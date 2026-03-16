import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
  onGoToToday: () => void;
}

export default function YearSelector({
  year,
  onYearChange,
  onGoToToday,
}: YearSelectorProps) {
  return (
    <div className="cal-year-selector">
      <div className="cal-year-nav">
        <button
          className="cal-year-btn"
          onClick={() => onYearChange(year - 1)}
          title="Previous year"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="cal-year-label">{year}</span>
        <button
          className="cal-year-btn"
          onClick={() => onYearChange(year + 1)}
          title="Next year"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <button className="cal-today-btn" onClick={onGoToToday}>
        Today
      </button>
    </div>
  );
}
