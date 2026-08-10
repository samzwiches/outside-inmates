import { childAgeGuidance, familyGuides, familyJourney, familyPathways } from "./family";
import { journeys, type JourneySlug } from "./journeys";
import { organizationStatusItems, organizationValues, plannedPublicDocuments, supportOpportunities, workInProgress } from "./organization";
import { reentryGuides, reentryPathways, reentryResourceCategories } from "./reentry";
import { resourceCategoryOptions, resourcePathways, stateOptions } from "./resources";

export type SiteCardDefinition = {
  key: string;
  group: string;
  page: string;
  section: string;
  title: string;
  description?: string;
  eyebrow?: string;
  actionLabel?: string;
  href?: string;
  secondaryActionLabel?: string;
  secondaryHref?: string;
  tone?: string;
};

const journeyResourceLinks: Partial<Record<JourneySlug, { label: string; href: string }>> = {
  "just-arrested": { label: "Find jail or court contacts", href: "/resources/justice" },
  "currently-incarcerated": { label: "Find facility contacts", href: "/resources/justice?type=jails-corrections" },
  "coming-home": { label: "Find corrections and court contacts", href: "/resources/justice" },
  "supporting-someone": { label: "Find official contacts", href: "/resources/justice" },
};

const contactCards = [
  { key: "contact.route.direction", eyebrow: "Need direction", title: "I need help figuring out where to start.", description: "Use the guided help path when the question is personal, complicated, or you are not sure which resource category fits.", href: "/start/not-sure", actionLabel: "Ask for help", tone: "clay" },
  { key: "contact.route.resource", eyebrow: "Resource information", title: "I found a resource or something needs correcting.", description: "Send a new program, updated phone number, changed eligibility rule, closure, or other correction to the private review queue.", href: "/resources/submit", actionLabel: "Submit or correct a resource", tone: "sage" },
  { key: "contact.route.community", eyebrow: "Community question", title: "I want to ask people who understand.", description: "Use the community board for practical questions that are safe to discuss publicly. Leave names, case details, addresses, and private medical information out.", href: "/community#new-thread", actionLabel: "Ask the community", tone: "blue" },
  { key: "contact.route.contribute", eyebrow: "Work with us", title: "I want to volunteer, contribute, or help build this.", description: "Outside Inmates is still growing. If you have lived experience, professional knowledge, research skills, or community connections, start here.", href: "/support#participation-note", actionLabel: "See ways to contribute", tone: "clay" },
] as const;

const homeResourceCategoryMap: Record<string, string> = {
  Housing: "housing",
  Employment: "employment",
  Identification: "identification-documents",
  "Legal help": "legal-help",
  "Family support": "family-support",
  "Mental health": "mental-health",
  "Substance use recovery": "substance-use-recovery",
  Transportation: "transportation",
};

export const siteCardRegistry: SiteCardDefinition[] = [
  ...journeys.map((journey) => {
    const resource = journeyResourceLinks[journey.slug];
    return {
      key: `journey.${journey.slug}`,
      group: "Guided paths",
      page: "Home + Start Here",
      section: "Journey cards",
      title: journey.cardTitle,
      description: journey.shortDescription,
      actionLabel: "Open this path",
      href: `/start/${journey.slug}`,
      secondaryActionLabel: resource?.label,
      secondaryHref: resource?.href,
    };
  }),
  ...familyPathways.map((pathway, index) => ({
    key: `families.pathway.${String(index + 1).padStart(2, "0")}`,
    group: "Families",
    page: "Families",
    section: "Start here cards",
    title: pathway.title,
    description: pathway.description,
    actionLabel: "Open",
    href: pathway.href,
    tone: pathway.tone,
  })),
  ...familyGuides.map((guide) => ({
    key: `families.guide.${guide.slug}`,
    group: "Families",
    page: "Families + family guides",
    section: "Guide cards",
    title: guide.title,
    description: guide.intro,
    eyebrow: guide.kicker,
    actionLabel: "Read the guide",
    href: `/families/${guide.slug}`,
  })),
  ...familyJourney.map((item, index) => ({
    key: `families.journey.${String(index + 1).padStart(2, "0")}`,
    group: "Families",
    page: "Families",
    section: "Family journey cards",
    title: item.stage,
    description: item.detail,
    tone: "ink",
  })),
  ...childAgeGuidance.map((item, index) => ({
    key: `families.children.age.${String(index + 1).padStart(2, "0")}`,
    group: "Families",
    page: "Supporting Children",
    section: "Age guidance cards",
    title: item.label,
    description: item.example,
  })),
  ...reentryPathways.map((pathway, index) => ({
    key: `reentry.pathway.${String(index + 1).padStart(2, "0")}`,
    group: "Reentry",
    page: "Reentry",
    section: "Start with the essentials cards",
    title: pathway.title,
    description: pathway.detail,
    actionLabel: "Explore guide",
    href: pathway.href,
    secondaryActionLabel: "Find resources",
    secondaryHref: pathway.resourceHref,
    tone: pathway.tone,
  })),
  ...reentryGuides.map((guide) => ({
    key: `reentry.guide.${guide.slug}`,
    group: "Reentry",
    page: "Reentry + reentry guides",
    section: "Guide cards",
    title: guide.title,
    description: guide.shortDescription,
    eyebrow: guide.kicker,
    actionLabel: "Read guide",
    href: `/reentry/${guide.slug}`,
  })),
  ...reentryResourceCategories.map((category, index) => ({
    key: `reentry.directory.${String(index + 1).padStart(2, "0")}`,
    group: "Reentry",
    page: "Reentry",
    section: "Resource category cards",
    title: category.label,
    description: category.description,
    actionLabel: "Find resources",
    href: category.href,
  })),
  ...resourceCategoryOptions.map((category) => ({
    key: `resources.category.${category.slug}`,
    group: "Resources",
    page: "Resources",
    section: "Resource category cards",
    title: category.name,
    description: category.description,
    actionLabel: "Browse resources",
    href: `/resources/results?category=${category.slug}`,
  })),
  ...resourcePathways.map((pathway, index) => ({
    key: `resources.pathway.${String(index + 1).padStart(2, "0")}`,
    group: "Resources",
    page: "Resources",
    section: "Guided pathway cards",
    title: pathway.title,
    description: pathway.detail,
    actionLabel: "Open",
    href: pathway.href,
  })),
  ...stateOptions.filter((state) => state.value).map((state) => ({
    key: `resources.justice.${state.value}`,
    group: "Resources",
    page: "Jails + Courts",
    section: "State cards",
    eyebrow: state.value,
    title: state.label,
    description: "Official jail, corrections, and court contacts for this state.",
    actionLabel: "Jails + corrections",
    href: `/resources/results?state=${state.value}&category=jails-corrections`,
    secondaryActionLabel: "Courts",
    secondaryHref: `/resources/results?state=${state.value}&category=courts`,
    tone: "paper",
  })),
  ...supportOpportunities.map((opportunity, index) => ({
    key: `support.opportunity.${String(index + 1).padStart(2, "0")}`,
    group: "Support",
    page: "Support",
    section: "How you can help cards",
    title: opportunity.title,
    description: opportunity.description,
    actionLabel: opportunity.action,
    href: opportunity.href,
  })),
  ...workInProgress.map((item, index) => ({
    key: `about.building.${String(index + 1).padStart(2, "0")}`,
    group: "About",
    page: "About",
    section: "What we are building cards",
    title: item,
  })),
  ...organizationValues.map((value, index) => ({
    key: `about.value.${String(index + 1).padStart(2, "0")}`,
    group: "About",
    page: "About",
    section: "Our values cards",
    title: value,
  })),
  ...organizationStatusItems.map((item, index) => ({
    key: `transparency.status.${String(index + 1).padStart(2, "0")}`,
    group: "Transparency",
    page: "Transparency",
    section: "Current status cards",
    title: item.label,
    description: item.description,
    eyebrow: item.statusLabel,
    href: item.publicDocumentUrl ?? undefined,
    actionLabel: item.publicDocumentUrl ? "Open document" : undefined,
  })),
  ...plannedPublicDocuments.map((item, index) => ({
    key: `transparency.document.${String(index + 1).padStart(2, "0")}`,
    group: "Transparency",
    page: "Transparency",
    section: "Planned documents cards",
    title: item.label,
    description: item.description,
    href: item.publicDocumentUrl ?? undefined,
    actionLabel: item.publicDocumentUrl ? "Open document" : undefined,
  })),
  ...contactCards.map((item) => ({
    ...item,
    group: "Contact",
    page: "Contact",
    section: "Contact route cards",
  })),
  {
    key: "home.action.families",
    group: "Home",
    page: "Home",
    section: "Family and reentry feature cards",
    eyebrow: "For families",
    title: "Support from the outside still matters.",
    description: "Visitation, communication, parenting, emotional support, and navigating the system from the outside.",
    actionLabel: "Explore family support",
    href: "/families",
    tone: "clay",
  },
  {
    key: "home.action.reentry",
    group: "Home",
    page: "Home",
    section: "Family and reentry feature cards",
    eyebrow: "For reentry",
    title: "Build the next chapter with support.",
    description: "Housing, employment, documents, treatment, transportation, and the practical steps toward steadier ground.",
    actionLabel: "Explore reentry support",
    href: "/reentry",
    tone: "sage",
  },
  ...Object.entries(homeResourceCategoryMap).map(([title, slug]) => ({
    key: `home.resource.${slug}`,
    group: "Home",
    page: "Home",
    section: "Resource finder cards",
    title,
    description: resourceCategoryOptions.find((category) => category.slug === slug)?.description ?? "Browse resources.",
    actionLabel: "Browse resources",
    href: `/resources/results?category=${slug}`,
  })),
];

export const siteCardGroups = [...new Set(siteCardRegistry.map((card) => card.group))];

export function getSiteCardDefinition(key: string): SiteCardDefinition | null {
  return siteCardRegistry.find((card) => card.key === key) ?? null;
}
