import { useMemo, useState, useEffect } from "react";
import {
  format,
  getDaysInMonth,
  isWeekend,
  isToday,
  getDay,
} from "date-fns";
import type { CalendarNote } from "@/types/calendar";
import {
  getDatesWithNotes,
  isMultiDay,
  getMultiDayPosition,
  getDateRangeLabel,
} from "@/types/calendar";

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const DAY_NUMBERS = Array.from({ length: 31 }, (_, i) => i + 1);

interface CalendarGridProps {
  year: number;
  notes: CalendarNote[];
  onDayClick: (date: string) => void;
}

export default function CalendarGrid({
  year,
  notes,
  onDayClick,
}: CalendarGridProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [year]);

  const notesByDate = useMemo(() => getDatesWithNotes(notes), [notes]);

  const gridData = useMemo(() => {
    return MONTH_NAMES.map((monthName, monthIndex) => {
      const daysInMonth = getDaysInMonth(new Date(year, monthIndex));
      const days = Array.from({ length: 31 }, (_, dayIndex) => {
        const dayNum = dayIndex + 1;
        if (dayNum > daysInMonth) {
          return { exists: false as const, dayNum };
        }

        const date = new Date(year, monthIndex, dayNum);
        const dateStr = format(date, "yyyy-MM-dd");
        const dayNotes = notesByDate.get(dateStr) || [];
        const multiDayNotes = dayNotes.filter((n) => isMultiDay(n));
        const singleDayNotes = dayNotes.filter((n) => !isMultiDay(n));
        const lastSingleNoteColor =
          singleDayNotes.length > 0
            ? singleDayNotes[singleDayNotes.length - 1].color
            : null;

        return {
          exists: true as const,
          dayNum,
          dateStr,
          isToday: isToday(date),
          isWeekend: isWeekend(date),
          dayOfWeek: getDay(date),
          hasNotes: singleDayNotes.length > 0,
          noteColor: lastSingleNoteColor,
          multiDayNotes,
        };
      });

      return { monthName, monthIndex, days };
    });
  }, [year, notesByDate]);

  return (
    <div className={`cal-grid-wrapper ${fadeIn ? "fade-in" : ""}`}>
      <div className="cal-grid">
        {/* Header row: empty corner + day numbers */}
        <div className="cal-grid-corner" />
        {DAY_NUMBERS.map((day) => (
          <div key={`h-${day}`} className="cal-grid-day-header">
            {day}
          </div>
        ))}

        {/* Month rows */}
        {gridData.map(({ monthName, days }) => (
          <>
            <div key={`m-${monthName}`} className="cal-grid-month-label">
              {monthName}
            </div>
            {days.map((day) => {
              if (!day.exists) {
                return (
                  <div
                    key={`${monthName}-${day.dayNum}`}
                    className="cal-grid-cell cal-grid-cell--empty"
                  />
                );
              }

              const multiCount = day.multiDayNotes.length;

              return (
                <div
                  key={`${monthName}-${day.dayNum}`}
                  className={[
                    "cal-grid-cell",
                    day.isToday && "cal-grid-cell--today",
                    day.isWeekend && "cal-grid-cell--weekend",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => onDayClick(day.dateStr)}
                  title={
                    multiCount > 0
                      ? day.multiDayNotes
                          .map(
                            (n) =>
                              `${n.text} (${getDateRangeLabel(n.date, n.endDate!)})`
                          )
                          .join("\n")
                      : format(
                          new Date(
                            year,
                            MONTH_NAMES.indexOf(monthName),
                            day.dayNum
                          ),
                          "EEEE, MMMM d, yyyy"
                        )
                  }
                >
                  {day.multiDayNotes.map((note, i) => {
                    const position = getMultiDayPosition(note, day.dateStr);
                    const height =
                      multiCount > 1 ? `${100 / multiCount}%` : "100%";
                    const top =
                      multiCount > 1
                        ? `${(100 / multiCount) * i}%`
                        : "0";

                    return (
                      <span
                        key={note.id}
                        className={`cal-grid-multiday cal-grid-multiday--${position}`}
                        style={{
                          backgroundColor: note.color,
                          height,
                          top,
                        }}
                      />
                    );
                  })}
                  {day.hasNotes && (
                    <span
                      className="cal-grid-dot"
                      style={{ backgroundColor: day.noteColor! }}
                    />
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
