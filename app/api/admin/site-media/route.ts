import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../lib/auth";
import { getSiteMediaSlot, type MediaOverlayTone, type SiteMediaKey } from "../../../data/media";
import { appearanceColorFields, isAppearanceFieldAllowed, normalizeAppearanceColor } from "../../../lib/site-appearance";
import { ACCEPTED_SITE_MEDIA_TYPES, MAX_SITE_MEDIA_IMAGE_BYTES, SITE_MEDIA_BUCKET } from "../../../lib/site-media-server";
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

function requiredSlot(value: string | null) {
  if (!value) throw new RequestError("Choose an approved media slot.");
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

function imageFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value : null;
}

function fileExtension(type: string) {
  return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : null;
}

function bytesMatchType(bytes: Uint8Array, type: string) {
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  const webp = bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return (type === "image/jpeg" && jpeg) || (type === "image/png" && png) || (type === "image/webp" && webp);
}

async function validateImage(file: File, label: string) {
  if (file.size > MAX_SITE_MEDIA_IMAGE_BYTES) throw new RequestError(`${label} must be 6 MB or smaller.`);
  if (!ACCEPTED_SITE_MEDIA_TYPES.includes(file.type as (typeof ACCEPTED_SITE_MEDIA_TYPES)[number])) throw new RequestError(`${label} must be a JPG, PNG, or WebP image.`);
  const extension = fileExtension(file.type);
  const filenameExtension = file.name.toLowerCase().split(".").pop();
  const permittedExtensions = file.type === "image/jpeg" ? ["jpg", "jpeg"] : [extension];
  if (!extension || !filenameExtension || !permittedExtensions.includes(filenameExtension)) throw new RequestError(`${label} file extension does not match its image type.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!bytesMatchType(bytes, file.type)) throw new RequestError(`${label} did not contain a valid image signature.`);
  return { extension, bytes };
}

async function uploadImage(file: File, key: SiteMediaKey, role: "primary" | "mobile") {
  const validated = await validateImage(file, role === "primary" ? "Primary image" : "Mobile image");
  const path = `${key.replace(/\./g, "/")}/${role}-${crypto.randomUUID()}.${validated.extension}`;
  const client = getSupabaseAdminClient();
  const { error } = await client.storage.from(SITE_MEDIA_BUCKET).upload(path, validated.bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new RequestError("The image could not be uploaded.", 502);
  return path;
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
    const slot = requiredSlot(formData.get("mediaKey") as string | null);
    const client = getSupabaseAdminClient();
    const { data: previous } = await client
      .from("site_media")
      .select("storage_path, mobile_storage_path")
      .eq("media_key", slot.key)
      .maybeSingle();

    const primaryFile = imageFile(formData.get("primaryImage"));
    const mobileFile = imageFile(formData.get("mobileImage"));
    const removeMobile = formData.get("removeMobile") === "true";
    if (!primaryFile && !previous?.storage_path) throw new RequestError("Choose a primary image before saving this slot.");

    const primaryPath = primaryFile ? await uploadImage(primaryFile, slot.key, "primary") : previous.storage_path;
    if (primaryFile) uploadedPaths.push(primaryPath);
    const mobilePath = mobileFile
      ? await uploadImage(mobileFile, slot.key, "mobile")
      : removeMobile ? null : previous?.mobile_storage_path ?? null;
    if (mobileFile && mobilePath) uploadedPaths.push(mobilePath);

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
    const values: Record<string, string | number | null> = { section_key: slot.key, updated_by: admin.id };

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
