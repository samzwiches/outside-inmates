import { NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../../../lib/auth";
import { getSiteCardDefinition } from "../../../../../data/card-registry";
import { ACCEPTED_SITE_MEDIA_TYPES, MAX_SITE_MEDIA_IMAGE_BYTES, SITE_MEDIA_BUCKET } from "../../../../../lib/site-media-server";
import { getSupabaseAdminClient } from "../../../../../lib/supabase/admin";
import { hasSupabaseServiceRole } from "../../../../../lib/supabase/config";

export const runtime = "nodejs";

class RequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function fileExtension(type: string) {
  return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : null;
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) throw new RequestError("Sign in is required to manage cards.", 401);
    if (!hasSupabaseServiceRole()) throw new RequestError("Card management is not configured for this environment.", 503);
    const body = await request.json() as Record<string, unknown>;
    const cardKey = typeof body.cardKey === "string" ? body.cardKey.trim() : "";
    if (!cardKey || !getSiteCardDefinition(cardKey)) throw new RequestError("Choose an approved card.");
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const type = typeof body.type === "string" ? body.type : "";
    const size = typeof body.size === "number" ? body.size : Number(body.size);
    if (!name || name.length > 255) throw new RequestError("Choose an image file with a valid filename.");
    if (!Number.isFinite(size) || size <= 0 || size > MAX_SITE_MEDIA_IMAGE_BYTES) throw new RequestError("Images must be 6 MB or smaller.");
    if (!ACCEPTED_SITE_MEDIA_TYPES.includes(type as (typeof ACCEPTED_SITE_MEDIA_TYPES)[number])) throw new RequestError("Images must be a JPG, PNG, or WebP file.");
    const extension = fileExtension(type);
    const suppliedExtension = name.toLowerCase().split(".").pop();
    const validExtensions = type === "image/jpeg" ? ["jpg", "jpeg"] : [extension];
    if (!extension || !suppliedExtension || !validExtensions.includes(suppliedExtension)) throw new RequestError("The file extension must match the image type.");
    const safeKey = cardKey.replace(/[^a-z0-9._-]/gi, "-").replace(/\./g, "/");
    const path = `cards/${safeKey}/image-${crypto.randomUUID()}.${extension}`;
    const { data, error } = await getSupabaseAdminClient().storage.from(SITE_MEDIA_BUCKET).createSignedUploadUrl(path, { upsert: false });
    if (error || !data?.path || !data.token) throw new RequestError("An upload could not be prepared. Please try again.", 502);
    return NextResponse.json({ upload: { bucket: SITE_MEDIA_BUCKET, path: data.path, token: data.token } });
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Card image upload preparation failed", error);
    return NextResponse.json({ error: "An upload could not be prepared. Please try again." }, { status: 500 });
  }
}
