import { cache } from "react";
import { getSiteMediaSlot, type MediaOverlayTone, type ResolvedSiteMedia, type SiteMediaAssignment, type SiteMediaKey } from "../data/media";
import type { SiteSectionAppearance } from "./site-appearance";
import { createSupabaseServerClient } from "./supabase/server";
import { getSupabaseAdminClient } from "./supabase/admin";

export const SITE_MEDIA_BUCKET = "site-media";
export const MAX_SITE_MEDIA_IMAGE_BYTES = 6 * 1024 * 1024;
export const ACCEPTED_SITE_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type SavedSiteMedia = {
  id: string;
  media_key: SiteMediaKey;
  storage_path: string;
  mobile_storage_path: string | null;
  alt_text: string | null;
  caption: string | null;
  credit_name: string | null;
  credit_url: string | null;
  source_name: string | null;
  source_url: string | null;
  license_label: string | null;
  focal_x: number;
  focal_y: number;
  mobile_focal_x: number;
  mobile_focal_y: number;
  overlay_tone: MediaOverlayTone;
  overlay_color: string | null;
  overlay_opacity: number;
  show_on_mobile: boolean;
  updated_at: string;
  signedUrl: string;
  mobileSignedUrl: string | null;
};

export type SitePresentation = { media: ResolvedSiteMedia; appearance: SiteSectionAppearance | null };

async function signedUrlForPath(client: Awaited<ReturnType<typeof createSupabaseServerClient>> | ReturnType<typeof getSupabaseAdminClient>, storagePath: string | null) {
  if (!client || !storagePath) return null;
  const { data, error } = await client.storage.from(SITE_MEDIA_BUCKET).createSignedUrl(storagePath, 60 * 60);
  return error || !data?.signedUrl ? null : data.signedUrl;
}

function fallbackFor(key: SiteMediaKey): ResolvedSiteMedia {
  const slot = getSiteMediaSlot(key)!;
  return {
    ...slot,
    imagePath: slot.fallbackPath,
    mobileImagePath: null,
    source: slot.fallbackPath ? "fallback" : "none",
  };
}

function emptyAssignedSlot(key: SiteMediaKey): ResolvedSiteMedia {
  const slot = getSiteMediaSlot(key)!;
  return {
    ...slot,
    imagePath: undefined,
    mobileImagePath: null,
    source: "none",
  };
}

function assignmentFromRecord(record: SavedSiteMedia): SiteMediaAssignment {
  return {
    storagePath: record.signedUrl,
    mobileStoragePath: record.mobileSignedUrl,
    alt: record.alt_text,
    caption: record.caption,
    creditName: record.credit_name,
    creditUrl: record.credit_url,
    sourceName: record.source_name,
    sourceUrl: record.source_url,
    licenseLabel: record.license_label,
    objectPositionDesktop: { x: Number(record.focal_x), y: Number(record.focal_y) },
    objectPositionMobile: { x: Number(record.mobile_focal_x), y: Number(record.mobile_focal_y) },
    overlayTone: record.overlay_tone,
    overlayColor: record.overlay_color,
    overlayOpacity: Number(record.overlay_opacity),
    showOnMobile: record.show_on_mobile,
  };
}

async function resolveSavedMedia(client: Awaited<ReturnType<typeof createSupabaseServerClient>> | ReturnType<typeof getSupabaseAdminClient>, row: Omit<SavedSiteMedia, "signedUrl" | "mobileSignedUrl">) {
  const signedUrl = await signedUrlForPath(client, row.storage_path);
  if (!signedUrl) return null;
  const mobileSignedUrl = await signedUrlForPath(client, row.mobile_storage_path);
  return { ...row, signedUrl, mobileSignedUrl } as SavedSiteMedia;
}

export const getPublicSiteMedia = cache(async (key: SiteMediaKey): Promise<ResolvedSiteMedia> => {
  const slot = getSiteMediaSlot(key);
  if (!slot) throw new Error("An unknown media key was requested.");
  const client = await createSupabaseServerClient();
  if (!client) return fallbackFor(key);

  const { data } = await client
    .from("site_media")
    .select("id, media_key, storage_path, mobile_storage_path, alt_text, caption, credit_name, credit_url, source_name, source_url, license_label, focal_x, focal_y, mobile_focal_x, mobile_focal_y, overlay_tone, overlay_color, overlay_opacity, show_on_mobile, updated_at")
    .eq("media_key", key)
    .maybeSingle();
  if (!data) return fallbackFor(key);

  const record = await resolveSavedMedia(client, data as Omit<SavedSiteMedia, "signedUrl" | "mobileSignedUrl">);
  if (!record) return emptyAssignedSlot(key);
  const assignment = assignmentFromRecord(record);
  return {
    ...slot,
    imagePath: assignment.storagePath,
    mobileImagePath: assignment.mobileStoragePath,
    source: "assignment",
    assignment,
  };
});

export const getPublicAppearance = cache(async (key: SiteMediaKey): Promise<SiteSectionAppearance | null> => {
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data } = await client
    .from("site_section_appearance")
    .select("section_key, background_color, surface_color, border_color, default_text_color, eyebrow_color, heading_color, body_color, button_text_color, metadata_color, font_family, hero_edge_style, hero_edge_size, background_image_fit, background_image_zoom, background_overlay_enabled, background_overlay_tone, background_overlay_color, background_overlay_opacity, background_overlay_direction, background_overlay_distribution, background_blur, card_surface_preset, card_surface_opacity, card_border_tone, card_border_opacity, card_shadow, card_backdrop_blur, card_text_tone, card_image_enabled, updated_at")
    .eq("section_key", key)
    .maybeSingle();
  return (data as SiteSectionAppearance | null) ?? null;
});

export const getSitePresentation = cache(async (key: SiteMediaKey): Promise<SitePresentation> => {
  const [media, appearance] = await Promise.all([getPublicSiteMedia(key), getPublicAppearance(key)]);
  return { media, appearance };
});

/** The calling admin route/page must authenticate before using these trusted reads. */
export async function getSiteMediaForAdmin(): Promise<SavedSiteMedia[]> {
  try {
    const client = getSupabaseAdminClient();
    const { data } = await client
      .from("site_media")
      .select("id, media_key, storage_path, mobile_storage_path, alt_text, caption, credit_name, credit_url, source_name, source_url, license_label, focal_x, focal_y, mobile_focal_x, mobile_focal_y, overlay_tone, overlay_color, overlay_opacity, show_on_mobile, updated_at")
      .order("media_key");
    if (!data) return [];
    const records = await Promise.all(data.map((row) => resolveSavedMedia(client, row as Omit<SavedSiteMedia, "signedUrl" | "mobileSignedUrl">)));
    return records.filter((record): record is SavedSiteMedia => Boolean(record));
  } catch {
    return [];
  }
}

export async function getAppearancesForAdmin(): Promise<SiteSectionAppearance[]> {
  try {
    const client = getSupabaseAdminClient();
    const { data } = await client
      .from("site_section_appearance")
      .select("section_key, background_color, surface_color, border_color, default_text_color, eyebrow_color, heading_color, body_color, button_text_color, metadata_color, font_family, hero_edge_style, hero_edge_size, background_image_fit, background_image_zoom, background_overlay_enabled, background_overlay_tone, background_overlay_color, background_overlay_opacity, background_overlay_direction, background_overlay_distribution, background_blur, card_surface_preset, card_surface_opacity, card_border_tone, card_border_opacity, card_shadow, card_backdrop_blur, card_text_tone, card_image_enabled, updated_at")
      .order("section_key");
    return (data as SiteSectionAppearance[] | null) ?? [];
  } catch {
    return [];
  }
}
