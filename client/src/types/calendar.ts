import {
  eachDayOfInterval,
  parseISO,
  format,
  differenceInCalendarDays,
} from "date-fns";

export interface CalendarNote {
  id: string;
  date: string; // ISO date string "YYYY-MM-DD"
  text: string;
  color: string; // hex color from NOTE_COLORS
  endDate?: string; // ISO date string for multi-day events
}

export interface NoteColor {
  name: string;
  hex: string;
}

export const NOTE_COLORS: NoteColor[] = [
  { name: "Yellow", hex: "#F5D565" },
  { name: "Pink", hex: "#E88BA5" },
  { name: "Blue", hex: "#6BA3D6" },
  { name: "Green", hex: "#6BBF8A" },
  { name: "Purple", hex: "#A78BDB" },
  { name: "Orange", hex: "#E8975A" },
];

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].hex;

export type MultiDayPosition = "start" | "middle" | "end";

export function isMultiDay(note: CalendarNote): boolean {
  return !!note.endDate && note.endDate !== note.date;
}

export function getMultiDayPosition(
  note: CalendarNote,
  dateStr: string
): MultiDayPosition {
  if (dateStr === note.date) return "start";
  if (dateStr === note.endDate) return "end";
  return "middle";
}

export function getDateRangeLabel(start: string, end: string): string {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const days = differenceInCalendarDays(endDate, startDate) + 1;
  return `${format(startDate, "MMM d")} – ${format(endDate, "MMM d")} (${days} day${days !== 1 ? "s" : ""})`;
}

export function getNotesForDate(
  notes: CalendarNote[],
  date: string
): CalendarNote[] {
  return notes.filter((note) => {
    if (isMultiDay(note)) {
      return date >= note.date && date <= note.endDate!;
    }
    return note.date === date;
  });
}

export function getDatesWithNotes(
  notes: CalendarNote[]
): Map<string, CalendarNote[]> {
  const map = new Map<string, CalendarNote[]>();
  for (const note of notes) {
    if (isMultiDay(note)) {
      const interval = eachDayOfInterval({
        start: parseISO(note.date),
        end: parseISO(note.endDate!),
      });
      for (const day of interval) {
        const dateStr = format(day, "yyyy-MM-dd");
        const existing = map.get(dateStr) || [];
        existing.push(note);
        map.set(dateStr, existing);
      }
    } else {
      const existing = map.get(note.date) || [];
      existing.push(note);
      map.set(note.date, existing);
    }
  }
  return map;
}
