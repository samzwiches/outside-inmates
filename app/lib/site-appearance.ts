import type { CSSProperties } from "react";
import { getSiteMediaSlot, type AppearanceEditorField, type HeroEdgeStyle, type SiteMediaKey } from "../data/media";

export type SiteFontFamily = "inherit" | "serif" | "sans";
export type BackgroundImageFit = "cover" | "contain";
export type BackgroundOverlayTone = "deep-ink" | "warm-cream" | "clay" | "sage" | "storm" | "custom";
export type BackgroundOverlayDirection = "full" | "top-to-bottom" | "bottom-to-top" | "left-to-right" | "right-to-left" | "center-vignette" | "heading-focus";
export type BackgroundOverlayDistribution = "soft" | "balanced" | "strong";
export type CardSurfacePreset = "paper" | "warm-paper" | "cream" | "translucent-light" | "translucent-dark";
export type CardBorderTone = "soft-ink" | "paper" | "clay" | "sage" | "storm";
export type CardShadow = "none" | "soft" | "medium";
export type CardBackdropBlur = "none" | "subtle" | "medium";
export type CardTextTone = "auto" | "ink" | "paper";

export const journeyBackgroundImageFits = ["cover", "contain"] as const;
export const journeyBackgroundOverlayTones = ["deep-ink", "warm-cream", "clay", "sage", "storm", "custom"] as const;
export const journeyBackgroundOverlayDirections = ["full", "top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left", "center-vignette", "heading-focus"] as const;
export const journeyBackgroundOverlayDistributions = ["soft", "balanced", "strong"] as const;
export const journeyBackgroundBlurValues = [0, 1, 2, 3, 4, 6] as const;
export const journeyCardSurfacePresets = ["paper", "warm-paper", "cream", "translucent-light", "translucent-dark"] as const;
export const journeyCardBorderTones = ["soft-ink", "paper", "clay", "sage", "storm"] as const;
export const journeyCardShadows = ["none", "soft", "medium"] as const;
export const journeyCardBackdropBlurs = ["none", "subtle", "medium"] as const;
export const journeyCardTextTones = ["auto", "ink", "paper"] as const;

export type SiteSectionAppearance = {
  section_key: SiteMediaKey;
  background_color: string | null;
  surface_color: string | null;
  border_color: string | null;
  default_text_color: string | null;
  eyebrow_color: string | null;
  heading_color: string | null;
  body_color: string | null;
  button_text_color: string | null;
  metadata_color: string | null;
  font_family: SiteFontFamily | null;
  hero_edge_style: HeroEdgeStyle | null;
  hero_edge_size: number | null;
  background_image_fit: BackgroundImageFit | null;
  background_image_zoom: number | null;
  background_overlay_enabled: boolean | null;
  background_overlay_tone: BackgroundOverlayTone | null;
  background_overlay_color: string | null;
  background_overlay_opacity: number | null;
  background_overlay_direction: BackgroundOverlayDirection | null;
  background_overlay_distribution: BackgroundOverlayDistribution | null;
  background_blur: number | null;
  card_surface_preset: CardSurfacePreset | null;
  card_surface_opacity: number | null;
  card_border_tone: CardBorderTone | null;
  card_border_opacity: number | null;
  card_shadow: CardShadow | null;
  card_backdrop_blur: CardBackdropBlur | null;
  card_text_tone: CardTextTone | null;
  card_image_enabled: boolean | null;
  updated_at: string;
};

export const appearanceColorFields = [
  "background_color",
  "surface_color",
  "border_color",
  "default_text_color",
  "eyebrow_color",
  "heading_color",
  "body_color",
  "button_text_color",
  "metadata_color",
] as const;

export type AppearanceColorField = (typeof appearanceColorFields)[number];

const journeyOverlayColors: Record<BackgroundOverlayTone, string> = {
  "deep-ink": "#18242b",
  "warm-cream": "#f3eee6",
  clay: "#a65f4d",
  sage: "#87998a",
  storm: "#647d8a",
  custom: "#18242b",
};

const journeySurfaceColors: Record<CardSurfacePreset, string> = {
  paper: "#fcfaf6",
  "warm-paper": "#fbf8f4",
  cream: "#f3eee6",
  "translucent-light": "#fcfaf6",
  "translucent-dark": "#18242b",
};

const journeyBorderColors: Record<CardBorderTone, string> = {
  "soft-ink": "#18242b",
  paper: "#fcfaf6",
  clay: "#a65f4d",
  sage: "#87998a",
  storm: "#647d8a",
};

function colorWithOpacity(color: string, opacity: number) {
  const normalized = normalizeAppearanceColor(color)!;
  const channels = normalized.slice(1).match(/.{2}/g)!.map((channel) => Number.parseInt(channel, 16));
  return `rgb(${channels.join(" ")} / ${opacity})`;
}

export type JourneyAppearanceSettings = {
  backgroundImageFit: BackgroundImageFit;
  backgroundImageZoom: number;
  backgroundOverlayEnabled: boolean;
  backgroundOverlayTone: BackgroundOverlayTone;
  backgroundOverlayColor: string;
  backgroundOverlayOpacity: number;
  backgroundOverlayDirection: BackgroundOverlayDirection;
  backgroundOverlayDistribution: BackgroundOverlayDistribution;
  backgroundBlur: number;
  cardSurfacePreset: CardSurfacePreset;
  cardSurfaceOpacity: number;
  cardBorderTone: CardBorderTone;
  cardBorderOpacity: number;
  cardShadow: CardShadow;
  cardBackdropBlur: CardBackdropBlur;
  cardTextTone: CardTextTone;
  cardImageEnabled: boolean;
};

export function normalizeAppearanceColor(value: unknown) {
  if (typeof value !== "string") return null;
  const compact = value.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(compact)) return `#${compact.split("").map((part) => `${part}${part}`).join("")}`;
  return /^[0-9a-f]{6}$/.test(compact) ? `#${compact}` : null;
}

export function isAppearanceFieldAllowed(mediaKey: string, field: AppearanceEditorField) {
  return Boolean(getSiteMediaSlot(mediaKey)?.allowedAppearanceFields.includes(field));
}

export function getJourneyAppearanceSettings(appearance: SiteSectionAppearance | null | undefined): JourneyAppearanceSettings {
  const tone = appearance?.background_overlay_tone ?? "deep-ink";
  const customColor = normalizeAppearanceColor(appearance?.background_overlay_color);
  return {
    backgroundImageFit: appearance?.background_image_fit ?? "cover",
    backgroundImageZoom: appearance?.background_image_zoom ?? 100,
    backgroundOverlayEnabled: appearance?.background_overlay_enabled ?? true,
    backgroundOverlayTone: tone,
    backgroundOverlayColor: tone === "custom" && customColor ? customColor : journeyOverlayColors[tone],
    backgroundOverlayOpacity: appearance?.background_overlay_opacity ?? 0.55,
    backgroundOverlayDirection: appearance?.background_overlay_direction ?? "heading-focus",
    backgroundOverlayDistribution: appearance?.background_overlay_distribution ?? "balanced",
    backgroundBlur: appearance?.background_blur ?? 1,
    cardSurfacePreset: appearance?.card_surface_preset ?? "warm-paper",
    cardSurfaceOpacity: appearance?.card_surface_opacity ?? 1,
    cardBorderTone: appearance?.card_border_tone ?? "soft-ink",
    cardBorderOpacity: appearance?.card_border_opacity ?? 0.14,
    cardShadow: appearance?.card_shadow ?? "soft",
    cardBackdropBlur: appearance?.card_backdrop_blur ?? "none",
    cardTextTone: appearance?.card_text_tone ?? "auto",
    cardImageEnabled: appearance?.card_image_enabled ?? true,
  };
}

export function hasMediaVisualOverrides(appearance: SiteSectionAppearance | null | undefined) {
  if (!appearance) return false;
  return [
    appearance.background_image_fit,
    appearance.background_image_zoom,
    appearance.background_overlay_enabled,
    appearance.background_overlay_tone,
    appearance.background_overlay_color,
    appearance.background_overlay_opacity,
    appearance.background_overlay_direction,
    appearance.background_overlay_distribution,
    appearance.background_blur,
  ].some((value) => value !== null && value !== undefined);
}

export function appearanceStyle(appearance: SiteSectionAppearance | null | undefined): CSSProperties {
  if (!appearance) return {};
  const properties: Record<string, string> = {};
  const entries: Array<[keyof SiteSectionAppearance, string]> = [
    ["background_color", "--section-background-color"],
    ["surface_color", "--section-surface-color"],
    ["border_color", "--section-border-color"],
    ["default_text_color", "--section-default-color"],
    ["eyebrow_color", "--section-eyebrow-color"],
    ["heading_color", "--section-heading-color"],
    ["body_color", "--section-body-color"],
    ["button_text_color", "--section-button-color"],
    ["metadata_color", "--section-metadata-color"],
  ];

  for (const [field, variable] of entries) {
    const value = appearance[field];
    if (typeof value === "string" && normalizeAppearanceColor(value)) properties[variable] = value;
  }

  if (appearance.font_family === "serif") properties["--section-font-family"] = "var(--serif)";
  if (appearance.font_family === "sans") properties["--section-font-family"] = "var(--sans)";
  if (appearance.hero_edge_style) properties["--hero-edge-style"] = appearance.hero_edge_style;
  if (typeof appearance.hero_edge_size === "number") properties["--hero-edge-size"] = `${appearance.hero_edge_size}px`;

  const journey = getJourneyAppearanceSettings(appearance);
  properties["--journey-background-fit"] = journey.backgroundImageFit;
  properties["--journey-background-zoom"] = String(journey.backgroundImageZoom / 100);
  properties["--journey-overlay-color"] = journey.backgroundOverlayColor;
  properties["--journey-overlay-opacity"] = String(journey.backgroundOverlayEnabled ? journey.backgroundOverlayOpacity : 0);
  properties["--journey-background-blur"] = `${journey.backgroundBlur}px`;
  properties["--journey-card-surface-color"] = journeySurfaceColors[journey.cardSurfacePreset];
  properties["--journey-card-surface-opacity"] = String(journey.cardSurfaceOpacity);
  properties["--journey-card-surface"] = colorWithOpacity(journeySurfaceColors[journey.cardSurfacePreset], journey.cardSurfaceOpacity);
  properties["--journey-card-border-color"] = journeyBorderColors[journey.cardBorderTone];
  properties["--journey-card-border-opacity"] = String(journey.cardBorderOpacity);
  properties["--journey-card-border"] = colorWithOpacity(journeyBorderColors[journey.cardBorderTone], journey.cardBorderOpacity);
  properties["--journey-card-shadow"] = journey.cardShadow === "none" ? "none" : journey.cardShadow === "soft" ? "6px 8px 0 rgba(24,36,43,0.1)" : "10px 12px 0 rgba(24,36,43,0.15)";
  properties["--journey-card-backdrop-blur"] = journey.cardBackdropBlur === "none" ? "none" : journey.cardBackdropBlur === "subtle" ? "blur(4px)" : "blur(9px)";
  return properties as CSSProperties;
}
