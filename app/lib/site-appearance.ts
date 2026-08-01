import type { CSSProperties } from "react";
import { getSiteMediaSlot, type AppearanceEditorField, type HeroEdgeStyle, type SiteMediaKey } from "../data/media";

export type SiteFontFamily = "inherit" | "serif" | "sans";

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

export function normalizeAppearanceColor(value: unknown) {
  if (typeof value !== "string") return null;
  const compact = value.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(compact)) return `#${compact.split("").map((part) => `${part}${part}`).join("")}`;
  return /^[0-9a-f]{6}$/.test(compact) ? `#${compact}` : null;
}

export function isAppearanceFieldAllowed(mediaKey: string, field: AppearanceEditorField) {
  return Boolean(getSiteMediaSlot(mediaKey)?.allowedAppearanceFields.includes(field));
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
  return properties as CSSProperties;
}
