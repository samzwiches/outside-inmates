import { createSupabaseServerClient } from "./supabase/server";
import {
  resourceCategoryOptions,
  type ResourceCategorySlug,
  type ResourceData,
  type ServiceAreaType,
} from "../data/resources";

type ResourceRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  full_description: string | null;
  categories: string | null;
  services: string | null;
  eligibility: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  counties_served: string | null;
  service_area: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  hours: string | null;
  cost: string | null;
  application_process: string | null;
  documents_needed: string | null;
  languages: string | null;
  accessibility_notes: string | null;
  verified_date: string | null;
  featured: boolean | null;
  emergency: boolean | null;
  remote_services: boolean | null;
  free_or_low_cost: boolean | null;
  service_area_type: string | null;
  published: boolean | null;
  status: string | null;
};

function splitList(value: string | null | undefined) {
  return (value ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function categorySlugFromName(value: string): ResourceCategorySlug | null {
  const normalized = value.trim().toLowerCase();

  const match = resourceCategoryOptions.find(
    (category) =>
      category.name.toLowerCase() === normalized ||
      category.slug.toLowerCase() === normalized
  );

  return match?.slug ?? null;
}

function normalizeServiceAreaType(value: string | null): ServiceAreaType {
  if (value === "Local") return "Local";
  if (value === "Statewide") return "Statewide";
  return "Remote / national";
}

function mapResourceRow(row: ResourceRow): ResourceData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? "",
    fullDescription: row.full_description ?? "",
    categories: splitList(row.categories)
      .map(categorySlugFromName)
      .filter((category): category is ResourceCategorySlug => Boolean(category)),
    services: splitList(row.services),
    eligibility: row.eligibility ?? "",
    location: row.location ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    zipCode: row.zip_code ?? "",
    countiesServed: splitList(row.counties_served),
    serviceArea: row.service_area ?? "",
    serviceAreaType: normalizeServiceAreaType(row.service_area_type),
    phone: row.phone || null,
    website: row.website || null,
    email: row.email || null,
    hours: row.hours ?? "",
    cost: row.cost ?? "",
    freeOrLowCost: Boolean(row.free_or_low_cost),
    applicationProcess: row.application_process ?? "",
    documentsNeeded: splitList(row.documents_needed),
    languages: splitList(row.languages),
    accessibilityNotes: row.accessibility_notes ?? "",
    verifiedDate: row.verified_date ?? "",
    featured: Boolean(row.featured),
    emergency: Boolean(row.emergency),
    remoteServices: Boolean(row.remote_services),
  };
}

export async function getPublishedResources(): Promise<ResourceData[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase is not configured.");
    return [];
  }

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("published", true)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("verified_date", { ascending: false });

  if (error) {
    console.error("Unable to load published resources:", error.message);
    return [];
  }

  return (data as ResourceRow[]).map(mapResourceRow);
}

export async function getPublishedResourceBySlug(
  slug: string
): Promise<ResourceData | null> {
  const resources = await getPublishedResources();
  return resources.find((resource) => resource.slug === slug) ?? null;
}
