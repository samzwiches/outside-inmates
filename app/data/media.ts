export const siteMediaKeys = [
  "home.hero",
  "home.journeys",
  "home.journey.just-arrested",
  "home.journey.currently-incarcerated",
  "home.journey.coming-home",
  "home.journey.rebuilding",
  "home.journey.supporting-someone",
  "home.journey.not-sure",
  "home.resources",
  "home.families",
  "home.reentry",
  "resources.hero",
  "families.hero",
  "families.just-incarcerated",
  "families.staying-connected",
  "families.children",
  "families.visitation",
  "families.emotional-support",
  "reentry.hero",
  "reentry.first-week",
  "reentry.documents",
  "reentry.housing",
  "reentry.employment",
  "reentry.health",
  "reentry.supervision",
  "reentry.transportation",
  "reentry.family-transition",
  "start.hero",
  "about.hero",
] as const;

export type SiteMediaKey = (typeof siteMediaKeys)[number];
export type MediaOverlayTone = "none" | "light" | "dark" | "cream" | "brand";
export type MediaPosition = { x: number; y: number };
export type MediaStatus = "unassigned" | "fallback-ready" | "manual-download-required" | "assigned";
export type SiteMediaSectionType = "hero" | "section";
export type HeroEdgeStyle = "inherit" | "soft-fade" | "rounded" | "rounded-fade" | "none";

export const mediaEditorFields = [
  "primaryImage",
  "mobileImage",
  "altText",
  "caption",
  "credit",
  "source",
  "license",
  "desktopFocal",
  "mobileFocal",
  "mobileVisibility",
  "overlay",
] as const;

const baseAppearanceEditorFields = [
  "background_color",
  "surface_color",
  "border_color",
  "default_text_color",
  "eyebrow_color",
  "heading_color",
  "body_color",
  "button_text_color",
  "metadata_color",
  "font_family",
  "hero_edge_style",
  "hero_edge_size",
] as const;

export const journeyAppearanceEditorFields = [
  "background_image_fit",
  "background_image_zoom",
  "background_overlay_enabled",
  "background_overlay_tone",
  "background_overlay_color",
  "background_overlay_opacity",
  "background_overlay_direction",
  "background_overlay_distribution",
  "background_blur",
  "card_surface_preset",
  "card_surface_opacity",
  "card_border_tone",
  "card_border_opacity",
  "card_shadow",
  "card_backdrop_blur",
  "card_text_tone",
  "card_image_enabled",
] as const;

export const appearanceEditorFields = [...baseAppearanceEditorFields, ...journeyAppearanceEditorFields] as const;

export type MediaEditorField = (typeof mediaEditorFields)[number];
export type AppearanceEditorField = (typeof appearanceEditorFields)[number];

export type MediaAttribution = {
  creditName?: string;
  creditUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  licenseLabel?: string;
  note?: string;
};

export type SiteMediaRecord = {
  key: SiteMediaKey;
  page: string;
  section: string;
  placement: string;
  sectionType: SiteMediaSectionType;
  group: string;
  revalidationRoute: string;
  fallbackPath?: string;
  expectedLocalFilename?: string;
  editorNote?: string;
  alt: string;
  attribution?: MediaAttribution;
  objectPositionDesktop: MediaPosition;
  objectPositionMobile: MediaPosition;
  overlayTone: MediaOverlayTone;
  overlayOpacity: number;
  showOnMobile: boolean;
  status: MediaStatus;
  allowedMediaFields: readonly MediaEditorField[];
  allowedAppearanceFields: readonly AppearanceEditorField[];
};

export type SiteMediaAssignment = {
  storagePath?: string;
  mobileStoragePath?: string | null;
  alt?: string | null;
  caption?: string | null;
  creditName?: string | null;
  creditUrl?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  licenseLabel?: string | null;
  objectPositionDesktop?: MediaPosition;
  objectPositionMobile?: MediaPosition;
  overlayTone?: MediaOverlayTone;
  overlayColor?: string | null;
  overlayOpacity?: number;
  showOnMobile?: boolean;
};

export type ResolvedSiteMedia = SiteMediaRecord & {
  imagePath?: string;
  mobileImagePath?: string | null;
  source: "assignment" | "fallback" | "none";
  assignment?: SiteMediaAssignment;
};

const centered: MediaPosition = { x: 50, y: 50 };
const allMediaFields = mediaEditorFields;
const heroAppearanceFields = [...baseAppearanceEditorFields, ...journeyAppearanceEditorFields] as const;
const sectionAppearanceFields = [...baseAppearanceEditorFields.filter((field) => !["hero_edge_style", "hero_edge_size"].includes(field)), ...journeyAppearanceEditorFields] as const;
const journeySectionAppearanceFields = sectionAppearanceFields;

function unassigned(
  key: SiteMediaKey,
  page: string,
  section: string,
  group: string,
  revalidationRoute: string,
  sectionType: SiteMediaSectionType = "hero",
) {
  return {
    key,
    page,
    section,
    placement: sectionType === "hero" ? "hero" : "section-background",
    sectionType,
    group,
    revalidationRoute,
    alt: "",
    objectPositionDesktop: centered,
    objectPositionMobile: centered,
    overlayTone: "none" as const,
    overlayOpacity: 0,
    showOnMobile: true,
    status: "unassigned" as const,
    allowedMediaFields: allMediaFields,
    allowedAppearanceFields: sectionType === "hero" ? heroAppearanceFields : sectionAppearanceFields,
  } satisfies SiteMediaRecord;
}

/**
 * The registry is the one allowlist for public slots. It drives admin labels,
 * permitted fields, public fallback behavior, and targeted revalidation.
 */
export const siteMediaRegistry: Record<SiteMediaKey, SiteMediaRecord> = {
  "home.hero": {
    ...unassigned("home.hero", "Home", "Homepage hero", "Home", "/"),
    fallbackPath: "/media/home-hero-doorway.jpg",
    expectedLocalFilename: "public/media/home-hero-doorway.jpg",
    alt: "An open doorway leading from a shaded room to a sunlit backyard.",
    attribution: {
      creditName: "Alexander Mass",
      creditUrl: "https://unsplash.com/@alexandermass",
      sourceName: "Unsplash",
      sourceUrl: "https://unsplash.com/photos/open-doorway-leading-to-a-sunny-backyard-view-outside-LFPln5RB9vQ",
      licenseLabel: "Unsplash License",
    },
    objectPositionDesktop: { x: 62, y: 50 },
    objectPositionMobile: { x: 68, y: 50 },
    overlayTone: "dark",
    overlayOpacity: 0.16,
    status: "manual-download-required",
  },
  "home.journeys": {
    ...unassigned("home.journeys", "Home", "Guided pathways", "Home", "/", "section"),
    allowedAppearanceFields: journeySectionAppearanceFields,
  },
  "home.journey.just-arrested": {
    ...unassigned("home.journey.just-arrested", "Home", "Just arrested pathway card", "Home", "/", "section"),
    placement: "journey-card",
    editorNote: "Photo only: keep headlines, labels, and calls to action out of the file. The pathway copy stays live and accessible on the card.",
    objectPositionDesktop: { x: 50, y: 48 },
    objectPositionMobile: { x: 50, y: 45 },
    overlayTone: "dark",
    overlayOpacity: 0.12,
  },
  "home.journey.currently-incarcerated": {
    ...unassigned("home.journey.currently-incarcerated", "Home", "Currently incarcerated pathway card", "Home", "/", "section"),
    placement: "journey-card",
    editorNote: "Photo only: keep headlines, labels, and calls to action out of the file. The pathway copy stays live and accessible on the card.",
    objectPositionDesktop: { x: 50, y: 48 },
    objectPositionMobile: { x: 50, y: 45 },
    overlayTone: "dark",
    overlayOpacity: 0.12,
  },
  "home.journey.coming-home": {
    ...unassigned("home.journey.coming-home", "Home", "Coming home pathway card", "Home", "/", "section"),
    placement: "journey-card",
    editorNote: "Photo only: keep headlines, labels, and calls to action out of the file. The pathway copy stays live and accessible on the card.",
    objectPositionDesktop: { x: 50, y: 48 },
    objectPositionMobile: { x: 50, y: 45 },
    overlayTone: "dark",
    overlayOpacity: 0.12,
  },
  "home.journey.rebuilding": {
    ...unassigned("home.journey.rebuilding", "Home", "Rebuilding pathway card", "Home", "/", "section"),
    placement: "journey-card",
    editorNote: "Photo only: keep headlines, labels, and calls to action out of the file. The pathway copy stays live and accessible on the card.",
    objectPositionDesktop: { x: 50, y: 48 },
    objectPositionMobile: { x: 50, y: 45 },
    overlayTone: "dark",
    overlayOpacity: 0.12,
  },
  "home.journey.supporting-someone": {
    ...unassigned("home.journey.supporting-someone", "Home", "Supporting someone pathway card", "Home", "/", "section"),
    placement: "journey-card",
    editorNote: "Photo only: keep headlines, labels, and calls to action out of the file. The pathway copy stays live and accessible on the card.",
    objectPositionDesktop: { x: 50, y: 48 },
    objectPositionMobile: { x: 50, y: 45 },
    overlayTone: "dark",
    overlayOpacity: 0.12,
  },
  "home.journey.not-sure": {
    ...unassigned("home.journey.not-sure", "Home", "Not sure pathway card", "Home", "/", "section"),
    placement: "journey-card",
    editorNote: "Photo only: keep headlines, labels, and calls to action out of the file. The pathway copy stays live and accessible on the card.",
    objectPositionDesktop: { x: 50, y: 48 },
    objectPositionMobile: { x: 50, y: 45 },
    overlayTone: "dark",
    overlayOpacity: 0.12,
  },
  "home.resources": unassigned("home.resources", "Home", "Resource Finder", "Home", "/", "section"),
  "home.families": unassigned("home.families", "Home", "Family support feature", "Home", "/", "section"),
  "home.reentry": unassigned("home.reentry", "Home", "Reentry support feature", "Home", "/", "section"),
  "resources.hero": {
    ...unassigned("resources.hero", "Resources", "Resource Finder hero", "Resources", "/resources"),
    fallbackPath: "/media/resources-hero-documents.jpg",
    expectedLocalFilename: "public/media/resources-hero-documents.jpg",
    alt: "Two people reviewing papers together at a table.",
    attribution: {
      creditName: "Olena Kholina",
      creditUrl: "https://unsplash.com/@olenakholina",
      sourceName: "Unsplash",
      sourceUrl: "https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw",
      licenseLabel: "Unsplash License",
    },
    objectPositionDesktop: { x: 64, y: 52 },
    objectPositionMobile: { x: 61, y: 50 },
    overlayTone: "cream",
    overlayOpacity: 0.3,
    status: "manual-download-required",
  },
  "families.hero": {
    ...unassigned("families.hero", "Families", "Family Support hero", "Families", "/families"),
    fallbackPath: "/media/families-hero-table.jpg",
    expectedLocalFilename: "public/media/families-hero-table.jpg",
    alt: "A family sitting together at a table.",
    attribution: {
      creditName: "olia danilevich",
      creditUrl: "https://www.pexels.com/@olia-danilevich/",
      sourceName: "Pexels",
      sourceUrl: "https://www.pexels.com/photo/a-family-sitting-at-the-table-8525004/",
      licenseLabel: "Pexels License",
      note: "Stock image posed by models. Do not imply the people pictured have personal experience with incarceration.",
    },
    objectPositionDesktop: { x: 62, y: 48 },
    objectPositionMobile: { x: 60, y: 50 },
    overlayTone: "cream",
    overlayOpacity: 0.28,
    status: "manual-download-required",
  },
  "families.just-incarcerated": unassigned("families.just-incarcerated", "Families", "Just incarcerated guide hero", "Families", "/families/just-incarcerated"),
  "families.staying-connected": unassigned("families.staying-connected", "Families", "Staying connected guide hero", "Families", "/families/staying-connected"),
  "families.children": unassigned("families.children", "Families", "Children guide hero", "Families", "/families/children"),
  "families.visitation": unassigned("families.visitation", "Families", "Visitation guide hero", "Families", "/families/visitation"),
  "families.emotional-support": unassigned("families.emotional-support", "Families", "Emotional support guide hero", "Families", "/families/emotional-support"),
  "reentry.hero": unassigned("reentry.hero", "Reentry", "Reentry landing hero", "Reentry", "/reentry"),
  "reentry.first-week": unassigned("reentry.first-week", "Reentry", "First week guide hero", "Reentry", "/reentry/first-week"),
  "reentry.documents": unassigned("reentry.documents", "Reentry", "Documents guide hero", "Reentry", "/reentry/documents"),
  "reentry.housing": unassigned("reentry.housing", "Reentry", "Housing guide hero", "Reentry", "/reentry/housing"),
  "reentry.employment": unassigned("reentry.employment", "Reentry", "Employment guide hero", "Reentry", "/reentry/employment"),
  "reentry.health": unassigned("reentry.health", "Reentry", "Health guide hero", "Reentry", "/reentry/health"),
  "reentry.supervision": unassigned("reentry.supervision", "Reentry", "Supervision guide hero", "Reentry", "/reentry/supervision"),
  "reentry.transportation": unassigned("reentry.transportation", "Reentry", "Transportation guide hero", "Reentry", "/reentry/transportation"),
  "reentry.family-transition": unassigned("reentry.family-transition", "Reentry", "Family transition guide hero", "Reentry", "/reentry/family-transition"),
  "start.hero": unassigned("start.hero", "Start Here", "Start Here hero", "Start Here", "/start"),
  "about.hero": unassigned("about.hero", "About", "About hero", "About", "/about"),
};

export const siteMediaGroups = [...new Set(siteMediaKeys.map((key) => siteMediaRegistry[key].group))];

export function getSiteMediaSlot(key: string): SiteMediaRecord | null {
  return key in siteMediaRegistry ? siteMediaRegistry[key as SiteMediaKey] : null;
}

export function mediaObjectPosition(position: MediaPosition) {
  return `${position.x}% ${position.y}%`;
}

export const isSiteMediaKey = (value: string): value is SiteMediaKey => Boolean(getSiteMediaSlot(value));
