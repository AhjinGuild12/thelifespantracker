import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Person, Experience, Relationship } from "@/types/experiences";
import { PRESET_EXPERIENCES } from "@/types/experiences";

interface ExperienceSelectorProps {
  person: Person;
  customExperiences: Experience[];
  onToggleExperience: (personId: string, experienceId: string) => void;
  onAddCustomExperience: (experience: Experience) => void;
}

export default function ExperienceSelector({
  person,
  customExperiences,
  onToggleExperience,
  onAddCustomExperience,
}: ExperienceSelectorProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customFrequency, setCustomFrequency] = useState("12");

  const relevantPresets = PRESET_EXPERIENCES.filter((exp) =>
    exp.suggestedFor.includes(person.relationship)
  );

  const otherPresets = PRESET_EXPERIENCES.filter(
    (exp) => !exp.suggestedFor.includes(person.relationship)
  );

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const freq = parseInt(customFrequency, 10);
    if (isNaN(freq) || freq <= 0) return;

    const experience: Experience = {
      id: `custom-${crypto.randomUUID()}`,
      name: customName.trim(),
      timesPerYear: freq,
      suggestedFor: [person.relationship],
    };

    onAddCustomExperience(experience);
    onToggleExperience(person.id, experience.id);
    setCustomName("");
    setCustomFrequency("12");
    setShowCustomForm(false);
  };

  const renderChip = (exp: Experience, dimmed = false) => {
    const isSelected = person.selectedExperienceIds.includes(exp.id);
    return (
      <button
        key={exp.id}
        className={cn(
          "exp-chip",
          isSelected && "exp-chip--selected",
          dimmed && !isSelected && "exp-chip--dimmed"
        )}
        onClick={() => onToggleExperience(person.id, exp.id)}
      >
        {exp.name}
        <span className="exp-chip-freq">
          {exp.timesPerYear === 1
            ? "1x/yr"
            : exp.timesPerYear === 52
              ? "weekly"
              : exp.timesPerYear === 26
                ? "biweekly"
                : exp.timesPerYear === 12
                  ? "monthly"
                  : exp.timesPerYear === 4
                    ? "quarterly"
                    : `${exp.timesPerYear}x/yr`}
        </span>
      </button>
    );
  };

  return (
    <div className="exp-selector">
      <p className="exp-selector-label">Add experiences</p>

      <div className="exp-chips">
        {relevantPresets.map((exp) => renderChip(exp))}
        {otherPresets.map((exp) => renderChip(exp, true))}
        {customExperiences.map((exp) => renderChip(exp))}

        <button
          className="exp-chip exp-chip--add"
          onClick={() => setShowCustomForm(!showCustomForm)}
        >
          <Plus size={14} />
          Custom
        </button>
      </div>

      {showCustomForm && (
        <div className="exp-custom-form">
          <input
            type="text"
            className="exp-custom-input"
            placeholder="Experience name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            autoFocus
          />
          <div className="exp-custom-freq">
            <input
              type="number"
              className="exp-custom-input exp-custom-input--small"
              placeholder="12"
              value={customFrequency}
              onChange={(e) => setCustomFrequency(e.target.value)}
              min={1}
              max={365}
            />
            <span className="exp-custom-freq-label">times per year</span>
          </div>
          <button
            className="exp-custom-save"
            onClick={handleAddCustom}
            disabled={!customName.trim()}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
