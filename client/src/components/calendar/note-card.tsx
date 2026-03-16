import { useState } from "react";
import { format, parseISO, addDays } from "date-fns";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X, CalendarRange } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { CalendarNote } from "@/types/calendar";
import { isMultiDay, getDateRangeLabel } from "@/types/calendar";
import NoteColorPicker from "./note-color-picker";

interface NoteCardProps {
  note: CalendarNote;
  index: number;
  onEdit: (id: string, text: string, color: string, endDate?: string) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({
  note,
  index,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [editColor, setEditColor] = useState(note.color);
  const [editIsMultiDay, setEditIsMultiDay] = useState(isMultiDay(note));
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(
    note.endDate ? parseISO(note.endDate) : undefined
  );
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const noteIsMultiDay = isMultiDay(note);

  const handleSave = () => {
    if (!editText.trim()) return;
    const endDateStr =
      editIsMultiDay && editEndDate
        ? format(editEndDate, "yyyy-MM-dd")
        : undefined;
    onEdit(note.id, editText.trim(), editColor, endDateStr);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(note.text);
    setEditColor(note.color);
    setEditIsMultiDay(isMultiDay(note));
    setEditEndDate(note.endDate ? parseISO(note.endDate) : undefined);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="cal-note-card"
      style={{ borderLeftColor: note.color }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {isEditing ? (
        <div className="cal-note-edit-form">
          <textarea
            className="cal-note-textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            autoFocus
          />
          <NoteColorPicker
            selectedColor={editColor}
            onSelectColor={setEditColor}
          />

          <div className="cal-multiday-toggle">
            <div className="cal-multiday-toggle-row">
              <CalendarRange size={16} />
              <span className="cal-multiday-toggle-label">Multi-day event</span>
              <Switch
                checked={editIsMultiDay}
                onCheckedChange={(checked) => {
                  setEditIsMultiDay(checked);
                  if (!checked) setEditEndDate(undefined);
                }}
              />
            </div>

            {editIsMultiDay && (
              <div className="cal-multiday-picker">
                <Popover
                  open={endDatePickerOpen}
                  onOpenChange={setEndDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button className="cal-multiday-date-btn">
                      {editEndDate
                        ? format(editEndDate, "MMM d, yyyy")
                        : "Pick end date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editEndDate}
                      onSelect={(date) => {
                        setEditEndDate(date || undefined);
                        setEndDatePickerOpen(false);
                      }}
                      disabled={{
                        before: addDays(parseISO(note.date), 1),
                      }}
                      defaultMonth={parseISO(note.date)}
                    />
                  </PopoverContent>
                </Popover>
                {editEndDate && (
                  <span className="cal-multiday-range-summary">
                    {getDateRangeLabel(
                      note.date,
                      format(editEndDate, "yyyy-MM-dd")
                    )}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="cal-note-edit-actions">
            <button
              className="cal-note-btn cal-note-btn--save"
              onClick={handleSave}
              disabled={!editText.trim() || (editIsMultiDay && !editEndDate)}
            >
              <Check size={14} />
              Save
            </button>
            <button
              className="cal-note-btn cal-note-btn--cancel"
              onClick={handleCancel}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cal-note-content">
            <p className="cal-note-text">{note.text}</p>
            {noteIsMultiDay && (
              <div className="cal-note-daterange">
                <CalendarRange size={13} />
                <span>
                  {getDateRangeLabel(note.date, note.endDate!)}
                </span>
              </div>
            )}
          </div>
          <div className="cal-note-actions">
            <button
              className="cal-note-action-btn"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              className="cal-note-action-btn cal-note-action-btn--danger"
              onClick={() => onDelete(note.id)}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
