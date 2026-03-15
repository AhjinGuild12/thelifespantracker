import { useState } from "react";
import { Plus } from "lucide-react";
import Navigation from "@/components/navigation";
import EmptyState from "@/components/remaining-experiences/empty-state";
import AddPersonDialog from "@/components/remaining-experiences/add-person-dialog";
import PersonCard from "@/components/remaining-experiences/person-card";
import ExperienceSelector from "@/components/remaining-experiences/experience-selector";
import ExperienceCard from "@/components/remaining-experiences/experience-card";
import SummaryBanner from "@/components/remaining-experiences/summary-banner";
import {
  useExperienceCalculations,
  generatePersonSummary,
} from "@/hooks/use-experience-calculations";
import type { Person, Experience } from "@/types/experiences";

interface RemainingExperiencesProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  customExperiences: Experience[];
  setCustomExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

export default function RemainingExperiencesPage({
  people,
  setPeople,
  customExperiences,
  setCustomExperiences,
}: RemainingExperiencesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const results = useExperienceCalculations(people, customExperiences);
  const summaries = generatePersonSummary(results);

  const existingColors = people.map((p) => p.color);

  const handleSavePerson = (person: Person) => {
    setPeople((prev) => {
      const existing = prev.findIndex((p) => p.id === person.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = person;
        return updated;
      }
      return [...prev, person];
    });
    setEditingPerson(null);
  };

  const handleDeletePerson = (personId: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== personId));
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setDialogOpen(true);
  };

  const handleToggleExperience = (personId: string, experienceId: string) => {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== personId) return p;
        const ids = p.selectedExperienceIds.includes(experienceId)
          ? p.selectedExperienceIds.filter((id) => id !== experienceId)
          : [...p.selectedExperienceIds, experienceId];
        return { ...p, selectedExperienceIds: ids };
      })
    );
  };

  const handleAddCustomExperience = (experience: Experience) => {
    setCustomExperiences((prev) => [...prev, experience]);
  };

  const handleAddPerson = () => {
    setEditingPerson(null);
    setDialogOpen(true);
  };

  const getResultsForPerson = (personId: string) =>
    results.filter((r) => r.personId === personId);

  return (
    <div className="exp-container">
      <div className="exp-main">
        <Navigation />

        <header className="exp-header">
          <h1 className="exp-title">Remaining Experiences</h1>
          <p className="exp-subtitle">
            Turn abstract time into countable moments with the people you love
          </p>
        </header>

        <SummaryBanner summaries={summaries} />

        {people.length === 0 ? (
          <EmptyState onAddPerson={handleAddPerson} />
        ) : (
          <div className="exp-people-list">
            {people.map((person) => {
              const personResults = getResultsForPerson(person.id);
              let cardIndex = 0;

              return (
                <section key={person.id} className="exp-person-section">
                  <PersonCard
                    person={person}
                    onEdit={handleEditPerson}
                    onDelete={handleDeletePerson}
                  />

                  <ExperienceSelector
                    person={person}
                    customExperiences={customExperiences}
                    onToggleExperience={handleToggleExperience}
                    onAddCustomExperience={handleAddCustomExperience}
                  />

                  {personResults.length > 0 && (
                    <div className="exp-results-grid">
                      {personResults.map((result) => (
                        <ExperienceCard
                          key={result.experienceId}
                          result={result}
                          index={cardIndex++}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            <button className="exp-add-another" onClick={handleAddPerson}>
              <Plus size={18} />
              Add Another Person
            </button>
          </div>
        )}

        <AddPersonDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSavePerson}
          existingColors={existingColors}
          editingPerson={editingPerson}
        />

        <footer className="footer-section">
          <p className="footer-text">
            Inspired by Sahil Bloom's{" "}
            <a
              href="https://www.sahilbloom.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              "Remaining Experiences"
            </a>{" "}
            concept
          </p>
          <p className="footer-subtext">
            A reminder that time with loved ones is finite and precious. Make
            every moment count.
          </p>
        </footer>
      </div>
    </div>
  );
}
