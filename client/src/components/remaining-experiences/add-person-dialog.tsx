import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import type { Person, Relationship } from "@/types/experiences";
import { RELATIONSHIP_LABELS, getNextColor } from "@/types/experiences";

interface AddPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (person: Person) => void;
  existingColors: string[];
  editingPerson?: Person | null;
}

const RELATIONSHIP_OPTIONS: Relationship[] = [
  "parent",
  "grandparent",
  "sibling",
  "partner",
  "child",
  "friend",
  "extended-family",
  "other",
];

export default function AddPersonDialog({
  open,
  onOpenChange,
  onSave,
  existingColors,
  editingPerson,
}: AddPersonDialogProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("parent");
  const [lifeExpectancy, setLifeExpectancy] = useState(80);

  useEffect(() => {
    if (editingPerson) {
      setName(editingPerson.name);
      setBirthDate(editingPerson.birthDate);
      setRelationship(editingPerson.relationship);
      setLifeExpectancy(editingPerson.lifeExpectancy);
    } else {
      setName("");
      setBirthDate("");
      setRelationship("parent");
      setLifeExpectancy(80);
    }
  }, [editingPerson, open]);

  const handleSave = () => {
    if (!name.trim() || !birthDate) return;

    const person: Person = {
      id: editingPerson?.id || crypto.randomUUID(),
      name: name.trim(),
      birthDate,
      relationship,
      lifeExpectancy,
      color: editingPerson?.color || getNextColor(existingColors),
      selectedExperienceIds: editingPerson?.selectedExperienceIds || [],
    };

    onSave(person);
    onOpenChange(false);
  };

  const isValid = name.trim().length > 0 && birthDate.length > 0;

  const currentAge = birthDate
    ? Math.floor(
        (new Date().getTime() - new Date(birthDate).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="exp-dialog">
        <DialogHeader>
          <DialogTitle className="exp-dialog-title">
            {editingPerson ? "Edit Person" : "Add Someone You Love"}
          </DialogTitle>
          <DialogDescription className="exp-dialog-desc">
            {editingPerson
              ? "Update their details below."
              : "Who do you want to count your remaining moments with?"}
          </DialogDescription>
        </DialogHeader>

        <div className="exp-dialog-form">
          <div className="exp-dialog-field">
            <label className="exp-dialog-label" htmlFor="person-name">
              Name
            </label>
            <input
              id="person-name"
              type="text"
              className="exp-dialog-input"
              placeholder="e.g., Mom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="exp-dialog-field">
            <label className="exp-dialog-label" htmlFor="person-birth">
              Birth Date
            </label>
            <input
              id="person-birth"
              type="date"
              className="exp-dialog-input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
            {currentAge !== null && currentAge >= 0 && (
              <span className="exp-dialog-hint">
                Currently {currentAge} years old
              </span>
            )}
          </div>

          <div className="exp-dialog-field">
            <label className="exp-dialog-label" htmlFor="person-relationship">
              Relationship
            </label>
            <select
              id="person-relationship"
              className="exp-dialog-input"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as Relationship)}
            >
              {RELATIONSHIP_OPTIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {RELATIONSHIP_LABELS[rel]}
                </option>
              ))}
            </select>
          </div>

          <div className="exp-dialog-field">
            <label className="exp-dialog-label">
              Life Expectancy:{" "}
              <span className="exp-dialog-slider-value">
                {lifeExpectancy} years
              </span>
            </label>
            <Slider
              value={[lifeExpectancy]}
              onValueChange={(val) => setLifeExpectancy(val[0])}
              min={50}
              max={110}
              step={1}
              className="exp-dialog-slider"
            />
            <div className="exp-dialog-slider-labels">
              <span>50</span>
              <span>110</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            className="exp-dialog-cancel"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className="exp-dialog-save"
            onClick={handleSave}
            disabled={!isValid}
          >
            {editingPerson ? "Save Changes" : "Add Person"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
