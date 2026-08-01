export type OrganizationStatusValue = "planning" | "in-progress" | "submitted" | "approved" | "not-applicable";

export type OrganizationStatusItem = {
  label: string;
  status: OrganizationStatusValue;
  statusLabel: string;
  description: string;
  publicDocumentUrl: string | null;
  lastUpdated: string;
  plannedDocuments?: string[];
};

export type PlannedPublicDocument = {
  label: string;
  description: string;
  publicDocumentUrl: string | null;
  lastUpdated: string;
};

export const organizationStatusItems: OrganizationStatusItem[] = [
  {
    label: "Legal formation",
    status: "planning",
    statusLabel: "Not yet formed",
    description: "Kentucky nonprofit corporation formation is being prepared.",
    publicDocumentUrl: null,
    lastUpdated: "2026-08-01",
  },
  {
    label: "Federal tax exemption",
    status: "planning",
    statusLabel: "Not yet applied or not yet approved",
    description: "Outside Inmates must not be described as a 501(c)(3) until IRS recognition is received.",
    publicDocumentUrl: null,
    lastUpdated: "2026-08-01",
  },
  {
    label: "Board of directors",
    status: "in-progress",
    statusLabel: "In development",
    description: "Founding directors and governance roles will be published after appointment.",
    publicDocumentUrl: null,
    lastUpdated: "2026-08-01",
  },
  {
    label: "Charitable registration",
    status: "planning",
    statusLabel: "Not yet active",
    description: "Required registrations will be completed before public charitable fundraising begins.",
    publicDocumentUrl: null,
    lastUpdated: "2026-08-01",
  },
  {
    label: "Financial reporting",
    status: "not-applicable",
    statusLabel: "Not yet available",
    description: "Budgets, annual reports, and appropriate public filings will be added as the organization develops.",
    publicDocumentUrl: null,
    lastUpdated: "2026-08-01",
  },
  {
    label: "Policies",
    status: "in-progress",
    statusLabel: "In development",
    description: "Core governance and public-facing policies are being prepared for publication.",
    publicDocumentUrl: null,
    lastUpdated: "2026-08-01",
    plannedDocuments: ["Bylaws", "Conflict of interest policy", "Privacy policy", "Community guidelines", "Resource verification standards", "Content correction policy"],
  },
];

export const plannedPublicDocuments: PlannedPublicDocument[] = [
  { label: "Articles of Incorporation", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "IRS determination letter", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "Bylaws", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "Board roster", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "Conflict of interest policy", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "Annual report", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "Form 990", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
  { label: "Financial statements", description: "Not yet available", publicDocumentUrl: null, lastUpdated: "2026-08-01" },
];

export const organizationValues = ["Dignity", "Practical help", "Accuracy", "Privacy", "Lived experience", "Accessibility", "No judgment"];

export const peopleWeServe = [
  "People who are incarcerated",
  "People returning home",
  "Parents, partners, children, relatives, and friends",
  "Caregivers",
  "Advocates and peer supporters",
  "Employers and service providers",
  "Community organizations",
];

export const workInProgress = [
  "A searchable resource directory",
  "Guided pathways for families and returning citizens",
  "Printable planning tools",
  "Family education and support",
  "Reentry guidance",
  "A future moderated community",
  "Resource verification and correction tools",
];

export const supportOpportunities = [
  { title: "Share a resource", description: "Point us toward a program, tool, or local service that people should be able to find more easily.", href: "/resources#submit-resource", action: "Explore the resource directory" },
  { title: "Suggest a correction", description: "Help us notice where a listing, contact detail, or plain-language explanation needs another look.", href: "/resources#submit-resource", action: "See correction information" },
  { title: "Join the founding board", description: "Help shape early governance, accountability, and the decisions that should not be made in isolation.", href: "#participation-note", action: "Read participation notes" },
  { title: "Volunteer professional expertise", description: "Bring practical knowledge that can make a guide, resource, or future process more useful.", href: "#participation-note", action: "See areas of expertise" },
  { title: "Share lived experience", description: "Help identify what information is missing without needing to submit private details through an unsecured form.", href: "#participation-note", action: "Read the safety note" },
  { title: "Become a community partner", description: "Help connect local knowledge, responsible referrals, and future verification work.", href: "#participation-note", action: "Read partnership notes" },
];

export const supportExpertise = ["Reentry", "Family support", "Social work", "Law", "Mental health", "Substance use recovery", "Child development", "Technology", "Accessibility", "Nonprofit governance", "Fundraising", "Communications"];

export function readableStatusDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
