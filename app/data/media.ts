export const siteMediaKeys = [
  "home.hero",
  "home.journeys",
  "home.resources",
  "home.families",
  "home.reentry",
  "resources.hero",
  "families.hero",
  "families.children",
  "families.visitation",
  "families.emotional-support",
  "reentry.hero",
  "reentry.documents",
  "reentry.housing",
  "reentry.employment",
  "reentry.health",
  "reentry.family-transition",
  "start.hero",
  "about.hero",
  "community.hero",
  "ask-for-help.hero",
] as const;

export type SiteMediaKey = (typeof siteMediaKeys)[number];
export type MediaStatus = "unassigned" | "fallback-ready" | "manual-download-required" | "assigned";
export type MediaOverlayDirection = "top" | "right" | "bottom" | "left" | "radial";
export type MediaOverlayTone = "ink" | "paper" | "bone" | "clay" | "sage" | "storm";

export type MediaPosition = { x: number; y: number };

export type MediaOverlay = {
  enabled: boolean;
  direction: MediaOverlayDirection;
  strength: number;
  tone: MediaOverlayTone;
};

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
  imageUrl?: string;
  storagePath?: string;
  fallbackPath?: string;
  expectedLocalFilename?: string;
  alt: string;
  attribution?: MediaAttribution;
  objectPositionDesktop: MediaPosition;
  objectPositionMobile: MediaPosition;
  overlay: MediaOverlay;
  showOnMobile: boolean;
  status: MediaStatus;
  updatedAt: string;
};

export type SiteMediaAssignment = Partial<Pick<SiteMediaRecord, "imageUrl" | "storagePath" | "alt" | "attribution" | "objectPositionDesktop" | "objectPositionMobile" | "overlay" | "showOnMobile" | "status" | "updatedAt">>;

export type ResolvedSiteMedia = SiteMediaRecord & {
  imagePath?: string;
  source: "assignment" | "fallback" | "none";
};

const centered: MediaPosition = { x: 50, y: 50 };
const noOverlay: MediaOverlay = { enabled: false, direction: "bottom", strength: 0, tone: "ink" };

const unassigned = (key: SiteMediaKey, page: string, section: string): SiteMediaRecord => ({
  key,
  page,
  section,
  alt: "",
  objectPositionDesktop: centered,
  objectPositionMobile: centered,
  overlay: noOverlay,
  showOnMobile: true,
  status: "unassigned",
  updatedAt: "2026-08-01",
});

/**
 * The source-controlled registry is the current provider. A future database
 * provider can return the same shape without requiring page components to know
 * where a media assignment was stored.
 */
export const siteMediaRegistry: Record<SiteMediaKey, SiteMediaRecord> = {
  "home.hero": {
    key: "home.hero",
    page: "Home",
    section: "Homepage hero",
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
    overlay: { enabled: true, direction: "bottom", strength: 0.16, tone: "ink" },
    showOnMobile: true,
    status: "manual-download-required",
    updatedAt: "2026-08-01",
  },
  "home.journeys": unassigned("home.journeys", "Home", "Guided pathways"),
  "home.resources": unassigned("home.resources", "Home", "Resource Finder"),
  "home.families": unassigned("home.families", "Home", "Family support feature"),
  "home.reentry": unassigned("home.reentry", "Home", "Reentry support feature"),
  "resources.hero": {
    key: "resources.hero",
    page: "Resources",
    section: "Resource Finder hero",
    fallbackPath: "/media/resources-hero-documents.jpg",
    expectedLocalFilename: "public/media/resources-hero-documents.jpg",
    alt: "Two people reviewing papers together at a table.",
    attribution: {
      creditName: "Olena Kholina",
      creditUrl: "https://unsplash.com/@olenakholina",
      sourceName: "Unsplash",
      sourceUrl: "https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw",
      licenseLabel: "Unsplash License",
      note: "Use a crop that centers hands, papers, and shared problem solving rather than corporate details.",
    },
    objectPositionDesktop: { x: 64, y: 52 },
    objectPositionMobile: { x: 61, y: 50 },
    overlay: { enabled: true, direction: "left", strength: 0.3, tone: "paper" },
    showOnMobile: true,
    status: "manual-download-required",
    updatedAt: "2026-08-01",
  },
  "families.hero": {
    key: "families.hero",
    page: "Families",
    section: "Family Support hero",
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
    overlay: { enabled: true, direction: "left", strength: 0.28, tone: "paper" },
    showOnMobile: true,
    status: "manual-download-required",
    updatedAt: "2026-08-01",
  },
  "families.children": unassigned("families.children", "Families", "Children guide hero"),
  "families.visitation": unassigned("families.visitation", "Families", "Visitation guide hero"),
  "families.emotional-support": unassigned("families.emotional-support", "Families", "Emotional support guide hero"),
  "reentry.hero": unassigned("reentry.hero", "Reentry", "Reentry landing hero"),
  "reentry.documents": unassigned("reentry.documents", "Reentry", "Documents guide hero"),
  "reentry.housing": unassigned("reentry.housing", "Reentry", "Housing guide hero"),
  "reentry.employment": unassigned("reentry.employment", "Reentry", "Employment guide hero"),
  "reentry.health": unassigned("reentry.health", "Reentry", "Health guide hero"),
  "reentry.family-transition": unassigned("reentry.family-transition", "Reentry", "Family transition guide hero"),
  "start.hero": unassigned("start.hero", "Start Here", "Start Here hero"),
  "about.hero": unassigned("about.hero", "About", "About hero"),
  "community.hero": unassigned("community.hero", "Community", "Community hero"),
  "ask-for-help.hero": {
    key: "ask-for-help.hero",
    page: "Ask for Help",
    section: "Advocacy hero",
    fallbackPath: "/media/ask-for-help-hero-writing.jpg",
    expectedLocalFilename: "public/media/ask-for-help-hero-writing.jpg",
    alt: "A person writing at a table with materials nearby.",
    attribution: {
      creditName: "Monica Melton",
      creditUrl: "https://unsplash.com/@monicamelton",
      sourceName: "Unsplash",
      sourceUrl: "https://unsplash.com/photos/woman-writing-on-table-oc_XTqWezp4",
      licenseLabel: "Unsplash License",
      note: "Use a crop that emphasizes practical assistance and collaboration. Do not make claims about the people pictured.",
    },
    objectPositionDesktop: { x: 56, y: 50 },
    objectPositionMobile: { x: 58, y: 50 },
    overlay: { enabled: true, direction: "left", strength: 0.26, tone: "paper" },
    showOnMobile: true,
    status: "manual-download-required",
    updatedAt: "2026-08-01",
  },
};

export interface SiteMediaProvider {
  getRecord(key: SiteMediaKey): SiteMediaRecord;
  getAssignment(key: SiteMediaKey): SiteMediaAssignment | null;
}

export const localSiteMediaProvider: SiteMediaProvider = {
  getRecord: (key) => siteMediaRegistry[key],
  getAssignment: () => null,
};

export function resolveSiteMedia(key: SiteMediaKey, provider: SiteMediaProvider = localSiteMediaProvider): ResolvedSiteMedia {
  const record = provider.getRecord(key);
  const assignment = provider.getAssignment(key);
  const resolved = { ...record, ...assignment };
  const assignedPath = assignment?.storagePath ?? assignment?.imageUrl;
  const fallbackIsReady = resolved.status === "fallback-ready" && Boolean(record.fallbackPath);

  return {
    ...resolved,
    imagePath: assignedPath ?? (fallbackIsReady ? record.fallbackPath : undefined),
    source: assignedPath ? "assignment" : fallbackIsReady ? "fallback" : "none",
  };
}

export function mediaObjectPosition(position: MediaPosition) {
  return `${position.x}% ${position.y}%`;
}
