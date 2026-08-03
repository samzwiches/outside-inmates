export const resourceCategoryOptions = [
  {
    slug: "housing",
    name: "Housing",
    description: "A place to land and a way to stay housed.",
  },
  {
    slug: "employment",
    name: "Employment",
    description: "Work, training, and second-chance career support.",
  },
  {
    slug: "identification-documents",
    name: "Identification and Documents",
    description: "IDs, records, and the paperwork that opens doors.",
  },
  {
    slug: "legal-help",
    name: "Legal Help",
    description: "Rights information and community advocacy.",
  },
  {
    slug: "family-support",
    name: "Family Support",
    description: "Support for the people carrying this, too.",
  },
  {
    slug: "mental-health",
    name: "Mental Health",
    description: "Care, counseling, and someone to talk to.",
  },
  {
    slug: "substance-use-recovery",
    name: "Substance Use Recovery",
    description: "Recovery planning and peer support.",
  },
  {
    slug: "transportation",
    name: "Transportation",
    description: "Getting to appointments, work, and home.",
  },
  {
    slug: "education",
    name: "Education",
    description: "Learning, credentials, and a fresh start.",
  },
  {
    slug: "food-basic-needs",
    name: "Food and Basic Needs",
    description: "Food, clothing, and everyday essentials.",
  },
  {
    slug: "reentry-planning",
    name: "Reentry Planning",
    description: "A steady checklist for the next chapter.",
  },
  {
    slug: "communication-visitation",
    name: "Communication and Visitation",
    description: "Staying connected from the outside.",
  },
] as const;

export type ResourceCategorySlug =
  (typeof resourceCategoryOptions)[number]["slug"];

export type ServiceAreaType =
  | "Local"
  | "Statewide"
  | "Remote / national";

export type ResourceData = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categories: ResourceCategorySlug[];
  services: string[];
  eligibility: string;
  location: string;
  city: string;
  state: string;
  zipCode: string;
  countiesServed: string[];
  serviceArea: string;
  serviceAreaType: ServiceAreaType;
  phone: string | null;
  website: string | null;
  email: string | null;
  hours: string;
  cost: string;
  freeOrLowCost: boolean;
  applicationProcess: string;
  documentsNeeded: string[];
  languages: string[];
  accessibilityNotes: string;
  verifiedDate: string;
  featured: boolean;
  emergency: boolean;
  remoteServices: boolean;
};

export const resourcePathways = [
  {
    title: "I just need a place to start",
    detail: "Build a small reentry plan first.",
    href: "/resources/results?category=reentry-planning",
  },
  {
    title: "I am trying to get documents together",
    detail: "Start with ID and record support.",
    href: "/resources/results?category=identification-documents",
  },
  {
    title: "I need work or training",
    detail: "Find employment support and learning options.",
    href: "/resources/results?category=employment",
  },
  {
    title: "My family needs help staying connected",
    detail: "Explore family and visitation support.",
    href: "/resources/results?category=family-support",
  },
] as const;

export const stateOptions = [
  { value: "", label: "Any state" },
  { value: "DE", label: "Delaware" },
  { value: "IN", label: "Indiana" },
  { value: "KY", label: "Kentucky" },
  { value: "ME", label: "Maine" },
  { value: "MA", label: "Massachusetts" },
  { value: "NH", label: "New Hampshire" },
  { value: "NY", label: "New York" },
  { value: "OH", label: "Ohio" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "VT", label: "Vermont" },
  { value: "WV", label: "West Virginia" },
] as const;

export function getCategoryName(
  slug: ResourceCategorySlug
): string {
  return (
    resourceCategoryOptions.find(
      (category) => category.slug === slug
    )?.name ?? slug
  );
}

export function isResourceCategorySlug(
  value: string
): value is ResourceCategorySlug {
  return resourceCategoryOptions.some(
    (category) => category.slug === value
  );
}
