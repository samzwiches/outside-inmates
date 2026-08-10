import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "../../../lib/auth";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { hasSupabaseServiceRole } from "../../../lib/supabase/config";

export const runtime = "nodejs";

class RequestError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

function text(value: unknown, max = 5000) {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") throw new RequestError("Resource text fields must be strings.");
  const result = value.trim();
  if (result.length > max) throw new RequestError("A resource field is too long.");
  return result;
}

function bool(value: unknown) { return value === true; }
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100); }

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) throw new RequestError("Sign in is required to manage resources.", 401);
    if (!hasSupabaseServiceRole()) throw new RequestError("Resource management is not configured for this environment.", 503);
    const body = await request.json() as Record<string, unknown>;
    const id = text(body.id, 100);
    const name = text(body.name, 300);
    if (!name) throw new RequestError("Resource name is required.");
    const state = text(body.state, 2).toUpperCase();
    const city = text(body.city, 200);
    let slug = text(body.slug, 140) || slugify(`${name}-${state || city || "resource"}`);
    if (!slug) throw new RequestError("A valid slug could not be created.");
    const client = getSupabaseAdminClient();
    if (!id) {
      const { data: collision } = await client.from("resources").select("id").eq("slug", slug).maybeSingle();
      if (collision) slug = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
    }
    const row = {
      name,
      slug,
      short_description: text(body.short_description, 1500),
      full_description: text(body.full_description, 8000),
      categories: text(body.categories, 1500),
      services: text(body.services, 2500),
      eligibility: text(body.eligibility, 4000),
      location: text(body.location, 300),
      city,
      state,
      zip_code: text(body.zip_code, 30),
      service_area: text(body.service_area, 500),
      phone: text(body.phone, 500),
      website: text(body.website, 1200),
      email: text(body.email, 500),
      hours: text(body.hours, 1000),
      cost: text(body.cost, 1000),
      service_area_type: text(body.service_area_type, 80),
      verification_status: text(body.verification_status, 100) || "Needs review",
      source_url: text(body.source_url, 1200),
      source_type: text(body.source_type, 300),
      review_notes: text(body.review_notes, 4000),
      verified_date: text(body.verified_date, 20) || null,
      status: text(body.status, 40) || "draft",
      published: bool(body.published),
      featured: bool(body.featured),
      free_or_low_cost: bool(body.free_or_low_cost),
      updated_at: new Date().toISOString(),
    };
    const query = id ? client.from("resources").update(row).eq("id", id).select("*").single() : client.from("resources").insert(row).select("*").single();
    const { data, error } = await query;
    if (error || !data) throw new RequestError(error?.message || "The resource could not be saved.", 502);
    revalidatePath("/resources", "layout");
    return NextResponse.json({ resource: data });
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Resource save failed", error);
    return NextResponse.json({ error: "The resource could not be saved." }, { status: 500 });
  }
}
