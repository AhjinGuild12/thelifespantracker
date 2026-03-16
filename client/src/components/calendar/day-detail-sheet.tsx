import { useState, useMemo } from "react";
import { format, parseISO, addDays } from "date-fns";
import { Plus, CalendarRange } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { CalendarNote } from "@/types/calendar";
import {
  getNotesForDate,
  DEFAULT_NOTE_COLOR,
  isMultiDay,
  getDateRangeLabel,
} from "@/types/calendar";
import NoteCard from "./note-card";
import NoteColorPicker from "./note-color-picker";

interface DayDetailSheetProps {
  selectedDate: string | null;
  notes: CalendarNote[];
  onClose: () => void;
  onAddNote: (date: string, text: string, color: string, endDate?: string) => void;
  onEditNote: (id: string, text: string, color: string, endDate?: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function DayDetailSheet({
  selectedDate,
  notes,
  onClose,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: DayDetailSheetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_NOTE_COLOR);
  const [newIsMultiDay, setNewIsMultiDay] = useState(false);
  const [newEndDate, setNewEndDate] = useState<Date | undefined>(undefined);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const dayNotes = selectedDate ? getNotesForDate(notes, selectedDate) : [];

  const { multiDayNotes, singleDayNotes } = useMemo(() => {
    const multi = dayNotes.filter((n) => isMultiDay(n));
    const single = dayNotes.filter((n) => !isMultiDay(n));
    return { multiDayNotes: multi, singleDayNotes: single };
  }, [dayNotes]);

  const formattedDate = selectedDate
    ? format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")
    : "";

  const handleAdd = () => {
    if (!selectedDate || !newText.trim()) return;
    const endDateStr =
      newIsMultiDay && newEndDate
        ? format(newEndDate, "yyyy-MM-dd")
        : undefined;
    onAddNote(selectedDate, newText.trim(), newColor, endDateStr);
    resetForm();
  };

  const resetForm = () => {
    setNewText("");
    setNewColor(DEFAULT_NOTE_COLOR);
    setNewIsMultiDay(false);
    setNewEndDate(undefined);
    setIsAdding(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const totalNotes = dayNotes.length;

  return (
    <Sheet open={!!selectedDate} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="cal-sheet">
        <SheetHeader>
          <SheetTitle className="cal-sheet-title">{formattedDate}</SheetTitle>
          <SheetDescription className="cal-sheet-desc">
            {totalNotes === 0
              ? "No notes for this day yet"
              : `${totalNotes} note${totalNotes !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="cal-sheet-notes">
          {multiDayNotes.length > 0 && (
            <div className="cal-sheet-section">
              <p className="cal-sheet-section-label">Multi-day events</p>
              {multiDayNotes.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={i}
                  onEdit={onEditNote}
                  onDelete={onDeleteNote}
                />
              ))}
            </div>
          )}

          {singleDayNotes.length > 0 && (
            <div className="cal-sheet-section">
              {multiDayNotes.length > 0 && (
                <p className="cal-sheet-section-label">Notes</p>
              )}
              {singleDayNotes.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={i}
                  onEdit={onEditNote}
                  onDelete={onDeleteNote}
                />
              ))}
            </div>
          )}
        </div>

        {isAdding ? (
          <div className="cal-add-note-form">
            <textarea
              className="cal-note-textarea"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="What's on this day?"
              rows={3}
              autoFocus
            />
            <NoteColorPicker
              selectedColor={newColor}
              onSelectColor={setNewColor}
            />

            <div className="cal-multiday-toggle">
              <div className="cal-multiday-toggle-row">
                <CalendarRange size={16} />
                <span className="cal-multiday-toggle-label">Multi-day event</span>
                <Switch
                  checked={newIsMultiDay}
                  onCheckedChange={(checked) => {
                    setNewIsMultiDay(checked);
                    if (!checked) setNewEndDate(undefined);
                  }}
                />
              </div>

              {newIsMultiDay && selectedDate && (
                <div className="cal-multiday-picker">
                  <Popover
                    open={endDatePickerOpen}
                    onOpenChange={setEndDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <button className="cal-multiday-date-btn">
                        {newEndDate
                          ? format(newEndDate, "MMM d, yyyy")
                          : "Pick end date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[60] w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newEndDate}
                        onSelect={(date) => {
                          setNewEndDate(date || undefined);
                          setEndDatePickerOpen(false);
                        }}
                        disabled={{
                          before: addDays(parseISO(selectedDate), 1),
                        }}
                        defaultMonth={parseISO(selectedDate)}
                      />
                    </PopoverContent>
                  </Popover>
                  {newEndDate && (
                    <span className="cal-multiday-range-summary">
                      {getDateRangeLabel(
                        selectedDate,
                        format(newEndDate, "yyyy-MM-dd")
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="cal-note-edit-actions">
              <button
                className="cal-note-btn cal-note-btn--save"
                onClick={handleAdd}
                disabled={
                  !newText.trim() || (newIsMultiDay && !newEndDate)
                }
              >
                Add Note
              </button>
              <button
                className="cal-note-btn cal-note-btn--cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="cal-add-note-btn"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={16} />
            Add Note
          </button>
        )}
      </SheetContent>
    </Sheet>
  );
}
