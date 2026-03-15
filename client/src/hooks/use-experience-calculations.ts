import { useMemo } from "react";
import type { Person, Experience, ExperienceResult } from "@/types/experiences";
import { PRESET_EXPERIENCES } from "@/types/experiences";

export function useExperienceCalculations(
  people: Person[],
  customExperiences: Experience[]
) {
  return useMemo(() => {
    const allExperiences = [...PRESET_EXPERIENCES, ...customExperiences];
    const results: ExperienceResult[] = [];
    const now = new Date();

    for (const person of people) {
      const birth = new Date(person.birthDate);
      if (isNaN(birth.getTime())) continue;

      const ageInYears =
        (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      const remainingYears = Math.max(0, person.lifeExpectancy - ageInYears);

      for (const expId of person.selectedExperienceIds) {
        const experience = allExperiences.find((e) => e.id === expId);
        if (!experience) continue;

        const remaining = Math.floor(remainingYears * experience.timesPerYear);
        const elapsed = Math.floor(ageInYears * experience.timesPerYear);
        const total = remaining + elapsed;

        const summary = `You have ${remaining} ${experience.name.toLowerCase()}${remaining !== 1 ? "s" : ""} left with ${person.name}.`;

        results.push({
          experienceId: experience.id,
          experienceName: experience.name,
          personId: person.id,
          personName: person.name,
          personColor: person.color,
          remaining,
          elapsed,
          total,
          summary,
        });
      }
    }

    return results;
  }, [people, customExperiences]);
}

export function generatePersonSummary(results: ExperienceResult[]): string[] {
  const byPerson = new Map<string, ExperienceResult[]>();

  for (const r of results) {
    const existing = byPerson.get(r.personId) || [];
    existing.push(r);
    byPerson.set(r.personId, existing);
  }

  const summaries: string[] = [];

  Array.from(byPerson.values()).forEach((personResults) => {
    if (personResults.length === 0) return;
    const personName = personResults[0].personName;
    const parts = personResults.map(
      (r: ExperienceResult) =>
        `${r.remaining} ${r.experienceName.toLowerCase()}${r.remaining !== 1 ? "s" : ""}`
    );

    if (parts.length === 1) {
      summaries.push(`You have ${parts[0]} left with ${personName}.`);
    } else if (parts.length === 2) {
      summaries.push(
        `You have ${parts[0]} and ${parts[1]} left with ${personName}.`
      );
    } else {
      const last = parts.pop();
      summaries.push(
        `You have ${parts.join(", ")}, and ${last} left with ${personName}.`
      );
    }
  });

  return summaries;
}
