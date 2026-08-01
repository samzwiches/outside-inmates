import { NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../../lib/auth";
import { getSiteMediaSlot, type SiteMediaKey } from "../../../../data/media";
import { ACCEPTED_SITE_MEDIA_TYPES, MAX_SITE_MEDIA_IMAGE_BYTES, SITE_MEDIA_BUCKET } from "../../../../lib/site-media-server";
import { getSupabaseAdminClient } from "../../../../lib/supabase/admin";
import { hasSupabaseServiceRole } from "../../../../lib/supabase/config";

export const runtime = "nodejs";

type UploadRole = "primary" | "mobile";

class RequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function apiError(error: unknown) {
  if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error("Site media upload URL creation failed", error);
  return NextResponse.json({ error: "An upload could not be prepared. Please try again." }, { status: 500 });
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

function requiredRole(value: unknown): UploadRole {
  if (value === "primary" || value === "mobile") return value;
  throw new RequestError("Choose a primary or mobile image upload.");
}

function fileExtension(type: string) {
  return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : null;
}

function requiredFileDetails(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const type = typeof body.type === "string" ? body.type : "";
  const size = typeof body.size === "number" ? body.size : Number(body.size);
  if (!name || name.length > 255) throw new RequestError("Choose an image file with a valid filename.");
  if (!Number.isFinite(size) || size <= 0 || size > MAX_SITE_MEDIA_IMAGE_BYTES) throw new RequestError("Images must be 6 MB or smaller.");
  if (!ACCEPTED_SITE_MEDIA_TYPES.includes(type as (typeof ACCEPTED_SITE_MEDIA_TYPES)[number])) throw new RequestError("Images must be a JPG, PNG, or WebP file.");
  const extension = fileExtension(type);
  const filenameExtension = name.toLowerCase().split(".").pop();
  const validFilenameExtensions = type === "image/jpeg" ? ["jpg", "jpeg"] : [extension];
  if (!extension || !filenameExtension || !validFilenameExtensions.includes(filenameExtension)) throw new RequestError("The file extension must match the image type.");
  return { type, extension };
}

export async function POST(request: Request) {
  try {
    await requireMediaAdmin();
    const body = await request.json() as Record<string, unknown>;
    const slot = requiredSlot(body.mediaKey) as { key: SiteMediaKey };
    const role = requiredRole(body.role);
    const file = requiredFileDetails(body);
    const path = `${slot.key.replace(/\./g, "/")}/${role}-${crypto.randomUUID()}.${file.extension}`;
    const { data, error } = await getSupabaseAdminClient().storage
      .from(SITE_MEDIA_BUCKET)
      .createSignedUploadUrl(path, { upsert: false });

    if (error || !data?.path || !data.token) throw new RequestError("An upload could not be prepared. Please try again.", 502);
    return NextResponse.json({ upload: { bucket: SITE_MEDIA_BUCKET, path: data.path, token: data.token } });
  } catch (error) {
    return apiError(error);
  }
}
