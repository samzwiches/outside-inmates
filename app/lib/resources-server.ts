import { createSupabaseServerClient } from "./supabase/server";
import {
  getCategoryName,
  resourceCategoryOptions,
  stateOptions,
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
  is_demonstration: boolean | null;
};

type PublishedResourceFilters = {
  state?: string;
  categories?: ResourceCategorySlug[];
  emergency?: boolean;
  limit?: number;
};

export type JusticeStateCounts = Record<
  string,
  { jailsCorrections: number; courts: number }
>;

const PAGE_SIZE = 250;
const DEFAULT_SEARCH_LIMIT = 120;
const RESOURCE_LIST_SELECT = [
  "id",
  "slug",
  "name",
  "short_description",
  "full_description",
  "categories",
  "services",
  "eligibility",
  "location",
  "city",
  "state",
  "zip_code",
  "counties_served",
  "service_area",
  "service_area_type",
  "phone",
  "website",
  "email",
  "hours",
  "cost",
  "application_process",
  "documents_needed",
  "languages",
  "accessibility_notes",
  "verified_date",
  "featured",
  "emergency",
  "remote_services",
  "free_or_low_cost",
  "published",
  "status",
  "is_demonstration",
].join(",");

function splitList(value: string | null | undefined) {
  return (value ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function storedCategoryName(category: ResourceCategorySlug): string {
  if (category === "jails-corrections") return "Jails and Corrections";
  return getCategoryName(category);
}

function categorySlugFromName(value: string): ResourceCategorySlug | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === "jails and corrections" || normalized === "police, jails and corrections") {
    return "jails-corrections";
  }

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

type ResourceQuery = {
  eq: (field: string, value: string | boolean) => ResourceQuery;
  or: (condition: string) => ResourceQuery;
};

function applyPublishedResourceFilters(
  query: ResourceQuery,
  filters: PublishedResourceFilters = {}
) {
  let nextQuery = query;

  if (filters.state) {
    nextQuery = nextQuery.eq("state", filters.state.toUpperCase());
  }

  if (filters.categories?.length) {
    const categoryFilters = filters.categories
      .map((category) => `categories.ilike.%${storedCategoryName(category)}%`)
      .join(",");

    nextQuery = nextQuery.or(categoryFilters);
  }

  if (filters.emergency) {
    nextQuery = nextQuery.eq("emergency", true);
  }

  return nextQuery;
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
      .select(RESOURCE_LIST_SELECT)
      .eq("published", true)
      .eq("status", "published")
      .eq("is_demonstration", false);

    query = applyPublishedResourceFilters(query as unknown as ResourceQuery, filters) as typeof query;

    const { data, error } = await query
      .order("emergency", { ascending: false })
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

  return rows.slice(0, maxRows).map(mapResourceRow);
}

export async function getRelatedPublishedResources(
  excludedSlug: string,
  categories: ResourceCategorySlug[],
  limit = 3
): Promise<ResourceData[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase || categories.length === 0) {
    return [];
  }

  const categoryFilters = categories
    .map((category) => `categories.ilike.%${storedCategoryName(category)}%`)
    .join(",");

  const { data, error } = await supabase
    .from("resources")
    .select(RESOURCE_LIST_SELECT)
    .eq("published", true)
    .eq("status", "published")
    .eq("is_demonstration", false)
    .neq("slug", excludedSlug)
    .or(categoryFilters)
    .order("featured", { ascending: false })
    .order("verified_date", { ascending: false })
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Unable to load related resources:", error.message);
    return [];
  }

  return ((data ?? []) as ResourceRow[]).map(mapResourceRow);
}

export async function getJusticeStateCounts(): Promise<JusticeStateCounts> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase is not configured.");
    return {};
  }

  const stateCodes = stateOptions
    .map((state) => state.value)
    .filter((value): value is string => Boolean(value));

  const stateResults = await Promise.all(
    stateCodes.map(async (stateCode) => {
      const { data, error } = await supabase
        .from("resources")
        .select("state,categories")
        .eq("published", true)
        .eq("status", "published")
        .eq("is_demonstration", false)
        .eq("state", stateCode)
        .or("categories.ilike.%Jails and Corrections%,categories.ilike.%Courts%")
        .limit(2000);

      if (error) {
        console.error("Unable to load justice resource counts:", error.message);
        return null;
      }

      const rows = (data ?? []) as Array<{ state: string | null; categories: string | null }>;
      let jailsCorrections = 0;
      let courts = 0;

      for (const row of rows) {
        const categories = splitList(row.categories).map((value) => value.toLowerCase());

        if (categories.includes("jails and corrections") || categories.includes("police, jails and corrections")) jailsCorrections += 1;
        if (categories.includes("courts")) courts += 1;
      }

      return { stateCode, jailsCorrections, courts };
    })
  );

  return stateResults.reduce<JusticeStateCounts>((counts, result) => {
    if (!result) return counts;

    counts[result.stateCode] = {
      jailsCorrections: result.jailsCorrections,
      courts: result.courts,
    };

    return counts;
  }, {});
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
