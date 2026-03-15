export type Relationship =
  | "parent"
  | "grandparent"
  | "sibling"
  | "partner"
  | "child"
  | "friend"
  | "extended-family"
  | "other";

export interface Person {
  id: string;
  name: string;
  birthDate: string;
  relationship: Relationship;
  lifeExpectancy: number;
  color: string;
  selectedExperienceIds: string[];
}

export interface Experience {
  id: string;
  name: string;
  timesPerYear: number;
  suggestedFor: Relationship[];
}

export interface ExperienceResult {
  experienceId: string;
  experienceName: string;
  personId: string;
  personName: string;
  personColor: string;
  remaining: number;
  elapsed: number;
  total: number;
  summary: string;
}

export const PERSON_COLORS = [
  "#E8627C", // rose
  "#D4943A", // amber
  "#3AA8A8", // teal
  "#8B7EC8", // lavender
  "#E07B53", // coral
  "#6B9E78", // sage
  "#5B9BD5", // sky
  "#B07AA1", // mauve
];

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  parent: "Parent",
  grandparent: "Grandparent",
  sibling: "Sibling",
  partner: "Partner",
  child: "Child",
  friend: "Friend",
  "extended-family": "Extended Family",
  other: "Other",
};

export const PRESET_EXPERIENCES: Experience[] = [
  {
    id: "christmas",
    name: "Christmas together",
    timesPerYear: 1,
    suggestedFor: ["parent", "grandparent", "sibling", "partner", "child", "extended-family"],
  },
  {
    id: "birthday",
    name: "Birthday celebration",
    timesPerYear: 1,
    suggestedFor: ["parent", "grandparent", "sibling", "partner", "child", "friend", "extended-family", "other"],
  },
  {
    id: "sunday-dinner",
    name: "Sunday dinner",
    timesPerYear: 52,
    suggestedFor: ["parent", "grandparent"],
  },
  {
    id: "summer-vacation",
    name: "Summer vacation",
    timesPerYear: 1,
    suggestedFor: ["parent", "grandparent", "sibling", "partner", "child", "extended-family"],
  },
  {
    id: "phone-call",
    name: "Phone call",
    timesPerYear: 52,
    suggestedFor: ["parent", "grandparent", "sibling", "friend", "extended-family", "other"],
  },
  {
    id: "coffee-catchup",
    name: "Coffee catch-up",
    timesPerYear: 12,
    suggestedFor: ["friend", "sibling", "other"],
  },
  {
    id: "movie-night",
    name: "Movie night",
    timesPerYear: 26,
    suggestedFor: ["partner", "friend", "sibling"],
  },
  {
    id: "weekend-visit",
    name: "Weekend visit",
    timesPerYear: 26,
    suggestedFor: ["parent", "sibling", "grandparent"],
  },
  {
    id: "holiday-gathering",
    name: "Holiday gathering",
    timesPerYear: 4,
    suggestedFor: ["extended-family", "grandparent"],
  },
  {
    id: "walk-together",
    name: "Walk together",
    timesPerYear: 52,
    suggestedFor: ["partner", "friend", "parent"],
  },
];

export function getNextColor(existingColors: string[]): string {
  const available = PERSON_COLORS.filter((c) => !existingColors.includes(c));
  return available.length > 0
    ? available[0]
    : PERSON_COLORS[existingColors.length % PERSON_COLORS.length];
}
