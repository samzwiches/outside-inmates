import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../lib/auth";
import { getSiteCardDefinition } from "../../../data/card-registry";
import { SITE_MEDIA_BUCKET } from "../../../lib/site-media-server";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { hasSupabaseServiceRole } from "../../../lib/supabase/config";

export const runtime = "nodejs";

class RequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function optionalString(value: unknown, max: number) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new RequestError("Card text values must be strings.");
  const trimmed = value.trim();
  if (trimmed.length > max) throw new RequestError(`A card field is longer than the allowed ${max} characters.`);
  return trimmed;
}

function optionalHref(value: unknown) {
  const href = optionalString(value, 1000);
  if (!href) return href;
  if (/^(\/|#|https:\/\/|http:\/\/|mailto:|tel:)/i.test(href)) return href;
  throw new RequestError("Card links must be a site path, anchor, http(s), mailto, or tel link.");
}

function focalValue(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 100) throw new RequestError("Image focal positions must be between 0 and 100.");
  return number;
}

async function requireCardAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new RequestError("Sign in is required to manage cards.", 401);
  if (!hasSupabaseServiceRole()) throw new RequestError("Card management is not configured for this environment.", 503);
  return admin;
}

export async function POST(request: Request) {
  try {
    await requireCardAdmin();
    const body = await request.json() as Record<string, unknown>;
    const cardKey = typeof body.cardKey === "string" ? body.cardKey.trim() : "";
    if (!cardKey || !getSiteCardDefinition(cardKey)) throw new RequestError("Choose an approved card.");
    const client = getSupabaseAdminClient();
    const { data: existing } = await client.from("site_card_content").select("image_storage_path").eq("card_key", cardKey).maybeSingle();
    const removeImage = body.removeImage === true;
    const suppliedPath = optionalString(body.imageStoragePath, 1200);
    if (suppliedPath && !suppliedPath.startsWith("cards/")) throw new RequestError("That image path is not valid for a card.");
    const nextImagePath = removeImage ? null : suppliedPath || existing?.image_storage_path || null;
    const row = {
      card_key: cardKey,
      title: optionalString(body.title, 240),
      description: optionalString(body.description, 1600),
      eyebrow: optionalString(body.eyebrow, 160),
      action_label: optionalString(body.actionLabel, 160),
      href: optionalHref(body.href),
      secondary_action_label: optionalString(body.secondaryActionLabel, 160),
      secondary_href: optionalHref(body.secondaryHref),
      tone: optionalString(body.tone, 40),
      image_storage_path: nextImagePath,
      image_alt: optionalString(body.imageAlt, 500),
      focal_x: focalValue(body.focalX ?? 50),
      focal_y: focalValue(body.focalY ?? 50),
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from("site_card_content").upsert(row, { onConflict: "card_key" });
    if (error) throw new RequestError("The card could not be saved. Please try again.", 502);
    const oldPath = existing?.image_storage_path ?? null;
    if (oldPath && oldPath !== nextImagePath && oldPath.startsWith("cards/")) await client.storage.from(SITE_MEDIA_BUCKET).remove([oldPath]);
    revalidatePath("/", "layout");
    return NextResponse.json({ card: row });
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Card save failed", error);
    return NextResponse.json({ error: "The card could not be saved. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireCardAdmin();
    const url = new URL(request.url);
    const cardKey = url.searchParams.get("cardKey")?.trim() ?? "";
    if (!cardKey || !getSiteCardDefinition(cardKey)) throw new RequestError("Choose an approved card.");
    const client = getSupabaseAdminClient();
    const { data: existing } = await client.from("site_card_content").select("image_storage_path").eq("card_key", cardKey).maybeSingle();
    const { error } = await client.from("site_card_content").delete().eq("card_key", cardKey);
    if (error) throw new RequestError("The card could not be reset. Please try again.", 502);
    const oldPath = existing?.image_storage_path ?? null;
    if (oldPath?.startsWith("cards/")) await client.storage.from(SITE_MEDIA_BUCKET).remove([oldPath]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Card reset failed", error);
    return NextResponse.json({ error: "The card could not be reset. Please try again." }, { status: 500 });
  }
}
