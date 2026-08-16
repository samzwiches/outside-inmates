import { createSupabaseServerClient } from "./supabase/server";
import {
  getCategoryName,
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

type PublishedResourceFilters = {
  state?: string;
  categories?: ResourceCategorySlug[];
  limit?: number;
};

export type JusticeStateCounts = Record<
  string,
  { jailsCorrections: number; courts: number }
>;

const PAGE_SIZE = 500;
const DEFAULT_SEARCH_LIMIT = 1000;

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

export async function getPublishedResources(
  filters: PublishedResourceFilters = {}
): Promise<ResourceData[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase is not configured.");
    return [];
  }

  const maxRows = Math.max(1, filters.limit ?? DEFAULT_SEARCH_LIMIT);
  const rows: ResourceRow[] = [];
  let offset = 0;

  while (rows.length < maxRows) {
    const remaining = maxRows - rows.length;
    const pageSize = Math.min(PAGE_SIZE, remaining);

    let query = supabase
      .from("resources")
      .select("*")
      .eq("published", true)
      .eq("status", "published")
      .eq("is_demonstration", false);

    if (filters.state) {
      query = query.eq("state", filters.state.toUpperCase());
    }

    if (filters.categories?.length) {
      const categoryFilters = filters.categories
        .map((category) => `categories.ilike.%${getCategoryName(category)}%`)
        .join(",");

      query = query.or(categoryFilters);
    }

    const { data, error } = await query
      .order("featured", { ascending: false })
      .order("verified_date", { ascending: false })
      .order("name", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Unable to load published resources:", error.message);
      return [];
    }

    const page = (data ?? []) as ResourceRow[];
    rows.push(...page);

    if (page.length < pageSize) break;
    offset += pageSize;
  }

  return rows.map(mapResourceRow);
}

export async function getJusticeStateCounts(): Promise<JusticeStateCounts> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase is not configured.");
    return {};
  }

  const counts: JusticeStateCounts = {};
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("resources")
      .select("state,categories")
      .eq("published", true)
      .eq("status", "published")
      .eq("is_demonstration", false)
      .or("categories.ilike.%Jails and Corrections%,categories.ilike.%Courts%")
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Unable to load justice resource counts:", error.message);
      return {};
    }

    const page = (data ?? []) as Array<{ state: string | null; categories: string | null }>;

    for (const row of page) {
      const state = (row.state ?? "").toUpperCase();
      if (!state) continue;

      const categories = splitList(row.categories).map((value) => value.toLowerCase());
      const entry = counts[state] ?? { jailsCorrections: 0, courts: 0 };

      if (categories.includes("jails and corrections")) entry.jailsCorrections += 1;
      if (categories.includes("courts")) entry.courts += 1;
      counts[state] = entry;
    }

    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return counts;
}

export async function getPublishedResourceBySlug(
  slug: string
): Promise<ResourceData | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase is not configured.");
    return null;
  }

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .eq("status", "published")
    .eq("is_demonstration", false)
    .maybeSingle();

  if (error) {
    console.error("Unable to load published resource:", error.message);
    return null;
  }

  return data ? mapResourceRow(data as ResourceRow) : null;
}
