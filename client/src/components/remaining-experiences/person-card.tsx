import { Pencil, Trash2 } from "lucide-react";
import type { Person } from "@/types/experiences";
import { RELATIONSHIP_LABELS } from "@/types/experiences";

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (personId: string) => void;
}

export default function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const birth = new Date(person.birthDate);
  const now = new Date();
  const ageInYears =
    (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const currentAge = Math.floor(ageInYears);
  const lifeProgress = Math.min(
    100,
    Math.round((ageInYears / person.lifeExpectancy) * 100)
  );

  return (
    <div
      className="exp-person-card"
      style={{ borderLeftColor: person.color }}
    >
      <div className="exp-person-header">
        <div className="exp-person-info">
          <div
            className="exp-person-dot"
            style={{ backgroundColor: person.color }}
          />
          <div>
            <h3 className="exp-person-name">{person.name}</h3>
            <span className="exp-person-meta">
              {RELATIONSHIP_LABELS[person.relationship]} &middot; {currentAge}{" "}
              years old
            </span>
          </div>
        </div>
        <div className="exp-person-actions">
          <button
            className="exp-person-action-btn"
            onClick={() => onEdit(person)}
            aria-label={`Edit ${person.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            className="exp-person-action-btn exp-person-action-btn--danger"
            onClick={() => onDelete(person.id)}
            aria-label={`Remove ${person.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="exp-person-progress">
        <div className="exp-person-progress-bar">
          <div
            className="exp-person-progress-fill"
            style={{
              width: `${lifeProgress}%`,
              backgroundColor: person.color,
            }}
          />
        </div>
        <span className="exp-person-progress-label">
          {lifeProgress}% of expected life lived
        </span>
      </div>
    </div>
  );
}
