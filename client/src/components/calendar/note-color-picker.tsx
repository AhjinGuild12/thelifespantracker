import { NOTE_COLORS } from "@/types/calendar";

interface NoteColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function NoteColorPicker({
  selectedColor,
  onSelectColor,
}: NoteColorPickerProps) {
  return (
    <div className="cal-color-picker">
      {NOTE_COLORS.map((color) => (
        <button
          key={color.hex}
          className={`cal-color-dot ${selectedColor === color.hex ? "selected" : ""}`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onSelectColor(color.hex)}
          title={color.name}
          type="button"
        />
      ))}
    </div>
  );
}
