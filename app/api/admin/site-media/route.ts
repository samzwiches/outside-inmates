import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../lib/auth";
import { getSiteMediaSlot, type MediaOverlayTone, type SiteMediaKey } from "../../../data/media";
import { appearanceColorFields, isAppearanceFieldAllowed, journeyBackgroundBlurValues, journeyBackgroundImageFits, journeyBackgroundOverlayDirections, journeyBackgroundOverlayDistributions, journeyBackgroundOverlayTones, journeyCardBackdropBlurs, journeyCardBorderTones, journeyCardShadows, journeyCardSurfacePresets, journeyCardTextTones, normalizeAppearanceColor } from "../../../lib/site-appearance";
import { SITE_MEDIA_BUCKET } from "../../../lib/site-media-server";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { hasSupabaseServiceRole } from "../../../lib/supabase/config";

export const runtime = "nodejs";

const overlayTones = new Set<MediaOverlayTone>(["none", "light", "dark", "cream", "brand"]);
const fontFamilies = new Set(["inherit", "serif", "sans"]);
const heroEdges = new Set(["inherit", "soft-fade", "rounded", "rounded-fade", "none"]);
const maxOverlayOpacity = 0.72;

class RequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function apiError(error: unknown) {
  if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error("Site media mutation failed", error);
  return NextResponse.json({ error: "The change could not be saved. Please try again." }, { status: 500 });
}

async function requireMediaAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new RequestError("Sign in is required to manage site media.", 401);
  if (!hasSupabaseServiceRole()) throw new RequestError("Media management is not configured for this environment.", 503);
  return admin;
}

function requiredSlot(value: unknown) {
  if (typeof value !== "string" || !value) throw new RequestError("Choose an approved media slot.");
  const slot = getSiteMediaSlot(value);
  if (!slot) throw new RequestError("That media slot is not available.");
  return slot;
}

function compactText(value: FormDataEntryValue | undefined, label: string, maxLength: number, required = false) {
  const text = typeof value === "string" ? value.trim() : "";
  if (required && !text) throw new RequestError(`${label} is required for an uploaded image.`);
  if (text.length > maxLength) throw new RequestError(`${label} must be ${maxLength} characters or fewer.`);
  return text || null;
}

function urlText(value: FormDataEntryValue | undefined, label: string) {
  const text = compactText(value, label, 1000);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Unsupported protocol");
    return url.toString();
  } catch {
    throw new RequestError(`${label} must be a full http or https URL.`);
  }
}

function boundedNumber(value: FormDataEntryValue | undefined, label: string, min: number, max: number, fallback: number) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RequestError(`${label} must be between ${min} and ${max}.`);
  return Math.round(number * 100) / 100;
}

function overlayTone(value: FormDataEntryValue | undefined) {
  const tone = typeof value === "string" ? value : "none";
  if (!overlayTones.has(tone as MediaOverlayTone)) throw new RequestError("Choose an approved overlay tone.");
  return tone as MediaOverlayTone;
}

function overlayColor(value: FormDataEntryValue | undefined) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return null;
  const color = normalizeAppearanceColor(raw);
  if (!color) throw new RequestError("Custom overlay color must be a three- or six-digit hexadecimal color.");
  return color;
}

function controlledEnum(value: unknown, label: string, allowed: readonly string[]) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !allowed.includes(value)) throw new RequestError(`Choose an approved ${label}.`);
  return value;
}

function controlledNumber(value: unknown, label: string, min: number, max: number, allowed?: readonly number[]) {
  if (value === null || value === undefined || value === "") return null;
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(number) || number < min || number > max || (allowed && !allowed.includes(number))) throw new RequestError(`${label} must use an approved value.`);
  return Math.round(number * 100) / 100;
}

function controlledBoolean(value: unknown, label: string) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "boolean") throw new RequestError(`${label} must be on or off.`);
  return value;
}

function directUploadPath(value: FormDataEntryValue | null, key: SiteMediaKey, role: "primary" | "mobile") {
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new RequestError("The uploaded image could not be saved.");
  const prefix = `${key.replace(/\./g, "/")}/${role}-`;
  const extensionIndex = value.lastIndexOf(".");
  const token = value.slice(prefix.length, extensionIndex);
  const extension = value.slice(extensionIndex + 1);
  if (!value.startsWith(prefix) || !/^[a-f0-9-]{36}$/.test(token) || !["jpg", "png", "webp"].includes(extension)) {
    throw new RequestError("The uploaded image could not be saved.");
  }
  return value;
}

async function isPathReferenced(path: string) {
  const client = getSupabaseAdminClient();
  const [primary, mobile] = await Promise.all([
    client.from("site_media").select("id").eq("storage_path", path).limit(1),
    client.from("site_media").select("id").eq("mobile_storage_path", path).limit(1),
  ]);
  return Boolean(primary.data?.length || mobile.data?.length);
}

async function deleteUnreferenced(paths: Array<string | null | undefined>) {
  const unique = [...new Set(paths.filter((path): path is string => Boolean(path)))];
  const client = getSupabaseAdminClient();
  await Promise.all(unique.map(async (path) => {
    if (!(await isPathReferenced(path))) await client.storage.from(SITE_MEDIA_BUCKET).remove([path]);
  }));
}

function revalidateSlot(key: SiteMediaKey) {
  const slot = getSiteMediaSlot(key)!;
  revalidatePath(slot.revalidationRoute);
  revalidatePath("/admin");
  revalidatePath("/admin/site-media");
  revalidatePath("/", "layout");
}

export async function POST(request: Request) {
  const uploadedPaths: string[] = [];
  try {
    const admin = await requireMediaAdmin();
    const formData = await request.formData();
    const slot = requiredSlot(formData.get("mediaKey"));
    const client = getSupabaseAdminClient();
    const { data: previous } = await client
      .from("site_media")
      .select("storage_path, mobile_storage_path")
      .eq("media_key", slot.key)
      .maybeSingle();

    const primaryUploadPath = directUploadPath(formData.get("primaryPath"), slot.key, "primary");
    const mobileUploadPath = directUploadPath(formData.get("mobilePath"), slot.key, "mobile");
    const removeMobile = formData.get("removeMobile") === "true";
    if (!primaryUploadPath && !previous?.storage_path) throw new RequestError("Choose a primary image before saving this slot.");

    const primaryPath = primaryUploadPath ?? previous!.storage_path;
    if (primaryUploadPath) uploadedPaths.push(primaryPath);
    const mobilePath = mobileUploadPath
      ? mobileUploadPath
      : removeMobile ? null : previous?.mobile_storage_path ?? null;
    if (mobileUploadPath) uploadedPaths.push(mobileUploadPath);

    const altText = compactText(formData.get("altText") ?? undefined, "Alt text", 500, true)!;
    const payload = {
      media_key: slot.key,
      storage_path: primaryPath,
      mobile_storage_path: mobilePath,
      alt_text: altText,
      caption: compactText(formData.get("caption") ?? undefined, "Caption", 500),
      credit_name: compactText(formData.get("creditName") ?? undefined, "Photographer credit", 200),
      credit_url: urlText(formData.get("creditUrl") ?? undefined, "Credit URL"),
      source_name: compactText(formData.get("sourceName") ?? undefined, "Source name", 200),
      source_url: urlText(formData.get("sourceUrl") ?? undefined, "Source URL"),
      license_label: compactText(formData.get("licenseLabel") ?? undefined, "License label", 200),
      focal_x: boundedNumber(formData.get("focalX") ?? undefined, "Desktop focal X", 0, 100, 50),
      focal_y: boundedNumber(formData.get("focalY") ?? undefined, "Desktop focal Y", 0, 100, 50),
      mobile_focal_x: boundedNumber(formData.get("mobileFocalX") ?? undefined, "Mobile focal X", 0, 100, 50),
      mobile_focal_y: boundedNumber(formData.get("mobileFocalY") ?? undefined, "Mobile focal Y", 0, 100, 50),
      overlay_tone: overlayTone(formData.get("overlayTone") ?? undefined),
      overlay_color: overlayColor(formData.get("overlayColor") ?? undefined),
      overlay_opacity: boundedNumber(formData.get("overlayOpacity") ?? undefined, "Overlay opacity", 0, maxOverlayOpacity, 0),
      show_on_mobile: formData.get("showOnMobile") !== "false",
      updated_by: admin.id,
    };

    const { data, error } = await client.from("site_media").upsert(payload, { onConflict: "media_key" }).select().single();
    if (error || !data) throw new RequestError("The media assignment could not be saved.", 502);
    await deleteUnreferenced([previous?.storage_path, previous?.mobile_storage_path]);
    revalidateSlot(slot.key);
    return NextResponse.json({ media: data });
  } catch (error) {
    await deleteUnreferenced(uploadedPaths).catch(() => undefined);
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireMediaAdmin();
    const body = await request.json() as Record<string, unknown>;
    const slot = requiredSlot(typeof body.sectionKey === "string" ? body.sectionKey : null);
    const values: Record<string, string | number | boolean | null> = { section_key: slot.key, updated_by: admin.id };

    for (const field of appearanceColorFields) {
      if (!isAppearanceFieldAllowed(slot.key, field)) continue;
      const raw = body[field];
      if (raw === null || raw === undefined || raw === "") {
        values[field] = null;
      } else {
        const color = normalizeAppearanceColor(raw);
        if (!color) throw new RequestError(`Use a valid hexadecimal value for ${field.replaceAll("_", " ")}.`);
        values[field] = color;
      }
    }

    if (isAppearanceFieldAllowed(slot.key, "font_family")) {
      const value = typeof body.font_family === "string" && body.font_family ? body.font_family : null;
      if (value && !fontFamilies.has(value)) throw new RequestError("Choose an approved font family.");
      values.font_family = value;
    }
    if (isAppearanceFieldAllowed(slot.key, "hero_edge_style")) {
      const value = typeof body.hero_edge_style === "string" && body.hero_edge_style ? body.hero_edge_style : null;
      if (value && !heroEdges.has(value)) throw new RequestError("Choose an approved hero edge style.");
      values.hero_edge_style = value;
    }
    if (isAppearanceFieldAllowed(slot.key, "hero_edge_size")) {
      const raw = body.hero_edge_size;
      if (raw === null || raw === undefined || raw === "") values.hero_edge_size = null;
      else {
        const value = Number(raw);
        if (!Number.isInteger(value) || value < 0 || value > 96) throw new RequestError("Hero edge size must be a whole number from 0 to 96.");
        values.hero_edge_size = value;
      }
    }

    if (isAppearanceFieldAllowed(slot.key, "background_image_fit")) {
      values.background_image_fit = controlledEnum(body.background_image_fit, "background image scale", journeyBackgroundImageFits);
      values.background_image_zoom = controlledNumber(body.background_image_zoom, "Background image zoom", 100, 140);
      values.background_overlay_enabled = controlledBoolean(body.background_overlay_enabled, "Background overlay");
      const overlayTone = controlledEnum(body.background_overlay_tone, "background overlay tone", journeyBackgroundOverlayTones);
      const overlayColor = body.background_overlay_color === null || body.background_overlay_color === undefined || body.background_overlay_color === ""
        ? null
        : normalizeAppearanceColor(body.background_overlay_color);
      if (body.background_overlay_color && !overlayColor) throw new RequestError("Background overlay color must be a three- or six-digit hexadecimal color.");
      if (overlayTone === "custom" && !overlayColor) throw new RequestError("Choose a custom background overlay color.");
      values.background_overlay_tone = overlayTone;
      values.background_overlay_color = overlayColor;
      values.background_overlay_opacity = controlledNumber(body.background_overlay_opacity, "Background overlay opacity", 0, 0.9);
      values.background_overlay_direction = controlledEnum(body.background_overlay_direction, "background overlay direction", journeyBackgroundOverlayDirections);
      values.background_overlay_distribution = controlledEnum(body.background_overlay_distribution, "background overlay distribution", journeyBackgroundOverlayDistributions);
      values.background_blur = controlledNumber(body.background_blur, "Background blur", 0, 6, journeyBackgroundBlurValues);
      values.card_surface_preset = controlledEnum(body.card_surface_preset, "pathway card surface", journeyCardSurfacePresets);
      values.card_surface_opacity = controlledNumber(body.card_surface_opacity, "Pathway card surface opacity", 0.4, 1);
      values.card_border_tone = controlledEnum(body.card_border_tone, "pathway card border", journeyCardBorderTones);
      values.card_border_opacity = controlledNumber(body.card_border_opacity, "Pathway card border opacity", 0, 1);
      values.card_shadow = controlledEnum(body.card_shadow, "pathway card shadow", journeyCardShadows);
      values.card_backdrop_blur = controlledEnum(body.card_backdrop_blur, "pathway card backdrop blur", journeyCardBackdropBlurs);
      values.card_text_tone = controlledEnum(body.card_text_tone, "pathway card text tone", journeyCardTextTones);
      values.card_image_enabled = controlledBoolean(body.card_image_enabled, "Pathway card images");
    }

    const client = getSupabaseAdminClient();
    const { data, error } = await client.from("site_section_appearance").upsert(values, { onConflict: "section_key" }).select().single();
    if (error || !data) throw new RequestError("The appearance settings could not be saved.", 502);
    revalidateSlot(slot.key);
    return NextResponse.json({ appearance: data });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireMediaAdmin();
    const url = new URL(request.url);
    const mediaKey = url.searchParams.get("mediaKey");
    const appearanceKey = url.searchParams.get("appearanceKey");
    if (Boolean(mediaKey) === Boolean(appearanceKey)) throw new RequestError("Choose either a media reset or an appearance reset.");
    const slot = requiredSlot(mediaKey ?? appearanceKey);
    const client = getSupabaseAdminClient();

    if (mediaKey) {
      const { data: previous } = await client
        .from("site_media")
        .select("storage_path, mobile_storage_path")
        .eq("media_key", slot.key)
        .maybeSingle();
      const { error } = await client.from("site_media").delete().eq("media_key", slot.key);
      if (error) throw new RequestError("The media assignment could not be reset.", 502);
      await deleteUnreferenced([previous?.storage_path, previous?.mobile_storage_path]);
    } else {
      const { error } = await client.from("site_section_appearance").delete().eq("section_key", slot.key);
      if (error) throw new RequestError("The appearance settings could not be reset.", 502);
    }

    revalidateSlot(slot.key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
