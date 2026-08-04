import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../lib/supabase/admin";

const categorySlugs = new Set([
  "housing",
  "employment",
  "identification-documents",
  "legal-help",
  "family-support",
  "mental-health",
  "substance-use-recovery",
  "transportation",
  "education",
  "food-basic-needs",
  "reentry-planning",
  "communication-visitation",
]);

const submissionTypes = new Set(["new", "correction"]);
const serviceAreaTypes = new Set(["local", "statewide", "remote-national"]);

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\r\n/g, "\n");
  return normalized ? normalized.slice(0, maxLength) : null;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validOptionalUrl(value: string | null) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 60_000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The submission could not be read." }, { status: 400 });
  }

  // Quietly accept bot-filled forms without storing them.
  if (clean(body.companyWebsite, 200)) return NextResponse.json({ ok: true });

  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < 2500 || elapsed > 86_400_000) {
    return NextResponse.json({ error: "Please reload the page and try again." }, { status: 400 });
  }

  const submissionType = clean(body.submissionType, 20) ?? "new";
  const resourceName = clean(body.resourceName, 180);
  const categorySlug = clean(body.categorySlug, 80);
  const description = clean(body.description, 4000);
  const submitterName = clean(body.submitterName, 120);
  const submitterEmail = clean(body.submitterEmail, 320);
  const serviceAreaType = clean(body.serviceAreaType, 40);
  const website = clean(body.website, 1000);
  const sourceUrl = clean(body.sourceUrl, 1000);
  const existingResourceUrl = clean(body.existingResourceUrl, 1000);

  if (!submissionTypes.has(submissionType)) return NextResponse.json({ error: "Choose a valid submission type." }, { status: 400 });
  if (!resourceName || resourceName.length < 2) return NextResponse.json({ error: "Enter the resource or program name." }, { status: 400 });
  if (!categorySlug || !categorySlugs.has(categorySlug)) return NextResponse.json({ error: "Choose a resource category." }, { status: 400 });
  if (!description || description.length < 20) return NextResponse.json({ error: "Add a little more detail about the help this resource provides." }, { status: 400 });
  if (!submitterName || submitterName.length < 2) return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  if (!submitterEmail || !validEmail(submitterEmail)) return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 });
  if (serviceAreaType && !serviceAreaTypes.has(serviceAreaType)) return NextResponse.json({ error: "Choose a valid service area." }, { status: 400 });
  if (![website, sourceUrl, existingResourceUrl].every(validOptionalUrl)) return NextResponse.json({ error: "Check the website links and try again." }, { status: 400 });

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("resource_submissions").insert({
      submission_type: submissionType,
      resource_name: resourceName,
      existing_resource_url: existingResourceUrl,
      category_slug: categorySlug,
      description,
      services: clean(body.services, 4000),
      eligibility: clean(body.eligibility, 3000),
      service_area_type: serviceAreaType,
      address: clean(body.address, 300),
      city: clean(body.city, 120),
      state: clean(body.state, 80),
      zip_code: clean(body.zipCode, 20),
      counties_served: clean(body.countiesServed, 1000),
      phone: clean(body.phone, 80),
      email: clean(body.email, 320),
      website,
      hours: clean(body.hours, 1000),
      cost: clean(body.cost, 1000),
      application_process: clean(body.applicationProcess, 3000),
      languages: clean(body.languages, 1000),
      accessibility_notes: clean(body.accessibilityNotes, 3000),
      source_url: sourceUrl,
      submitter_name: submitterName,
      submitter_email: submitterEmail,
      submitter_relationship: clean(body.submitterRelationship, 300),
      additional_notes: clean(body.additionalNotes, 4000),
      status: "pending",
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not save the resource right now. Please try again." }, { status: 503 });
  }
}
