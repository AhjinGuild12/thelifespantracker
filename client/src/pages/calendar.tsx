import { useState, useCallback } from "react";
import Navigation from "@/components/navigation";
import CalendarGrid from "@/components/calendar/calendar-grid";
import YearSelector from "@/components/calendar/year-selector";
import DayDetailSheet from "@/components/calendar/day-detail-sheet";
import type { CalendarNote } from "@/types/calendar";
import type { SaveStatus } from "@/components/auth/SaveIndicator";

interface CalendarPageProps {
  calendarNotes: CalendarNote[];
  setCalendarNotes: React.Dispatch<React.SetStateAction<CalendarNote[]>>;
  saveStatus?: SaveStatus;
}

export default function CalendarPage({
  calendarNotes,
  setCalendarNotes,
  saveStatus,
}: CalendarPageProps) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleGoToToday = useCallback(() => {
    setSelectedYear(new Date().getFullYear());
  }, []);

  const handleDayClick = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const handleAddNote = useCallback(
    (date: string, text: string, color: string, endDate?: string) => {
      const newNote: CalendarNote = {
        id: crypto.randomUUID(),
        date,
        text,
        color,
        ...(endDate && { endDate }),
      };
      setCalendarNotes((prev) => [...prev, newNote]);
    },
    [setCalendarNotes]
  );

  const handleEditNote = useCallback(
    (id: string, text: string, color: string, endDate?: string) => {
      setCalendarNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, text, color, endDate: endDate || undefined }
            : note
        )
      );
    },
    [setCalendarNotes]
  );

  const handleDeleteNote = useCallback(
    (id: string) => {
      setCalendarNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setCalendarNotes]
  );

  return (
    <div className="exp-container">
      <div className="cal-main">
        <Navigation saveStatus={saveStatus} />

        <header className="exp-header">
          <h1 className="exp-title">Calendar</h1>
          <p className="exp-subtitle">
            Your year at a glance — click any day to add notes
          </p>
        </header>

        <YearSelector
          year={selectedYear}
          onYearChange={setSelectedYear}
          onGoToToday={handleGoToToday}
        />

        <CalendarGrid
          year={selectedYear}
          notes={calendarNotes}
          onDayClick={handleDayClick}
        />

        <DayDetailSheet
          selectedDate={selectedDate}
          notes={calendarNotes}
          onClose={handleCloseSheet}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />

        <footer className="footer-section">
          <p className="footer-text">
            Inspired by the{" "}
            <a
              href="https://www.alexisgrant.com/big-ass-calendar/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Big A## Calendar
            </a>
          </p>
          <p className="footer-subtext">
            See your whole year. Plan with intention. One day at a time.
          </p>
        </footer>
      </div>
    </div>
  );
}
