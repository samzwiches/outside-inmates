import {
  getCategoryName,
  type ResourceCategorySlug,
  type ResourceData,
  resourceCategoryOptions,
} from "../data/resources";

export type SearchParamValue = string | string[] | undefined;
export type ResourceSearchParams = Record<string, SearchParamValue>;

export type ResourceSearchFilters = {
  location: string;
  state: string;
  categories: ResourceCategorySlug[];
  query: string;
  serviceArea: string;
  freeOrLowCost: boolean;
  remoteServices: boolean;
  emergency: boolean;
  sort: "featured" | "name" | "reviewed";
};

function values(value: SearchParamValue): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return [];
}

function first(value: SearchParamValue): string {
  return values(value)[0] ?? "";
}

function isCategory(value: string): value is ResourceCategorySlug {
  return resourceCategoryOptions.some(
    (category) => category.slug === value
  );
}

export function parseResourceFilters(
  searchParams: ResourceSearchParams
): ResourceSearchFilters {
  const requestedSort = first(searchParams.sort);

  return {
    location: first(searchParams.location).trim(),
    state: first(searchParams.state).trim().toUpperCase(),
    categories: values(searchParams.category).filter(isCategory),
    query: first(searchParams.query).trim(),
    serviceArea: first(searchParams.serviceArea).trim(),
    freeOrLowCost: first(searchParams.free) === "true",
    remoteServices: first(searchParams.remote) === "true",
    emergency: first(searchParams.emergency) === "true",
    sort:
      requestedSort === "name" || requestedSort === "reviewed"
        ? requestedSort
        : "featured",
  };
}

export function filterResources(
  filters: ResourceSearchFilters,
  source: ResourceData[]
): ResourceData[] {
  const location = filters.location.toLowerCase();
  const query = filters.query.toLowerCase();

  const matches = source.filter((resource) => {
    const locationText = [
      resource.location,
      resource.city,
      resource.state,
      resource.zipCode,
      resource.serviceArea,
      ...resource.countiesServed,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const searchText = [
      resource.name,
      resource.shortDescription,
      resource.fullDescription,
      resource.eligibility,
      resource.cost,
      resource.applicationProcess,
      resource.hours,
      resource.accessibilityNotes,
      ...resource.services,
      ...resource.categories.map(getCategoryName),
      ...resource.documentsNeeded,
      ...resource.languages,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesLocation =
      !location || locationText.includes(location);

    const matchesState =
      !filters.state ||
      resource.state.toUpperCase() === filters.state;

    const matchesCategory =
      !filters.categories.length ||
      filters.categories.some((category) =>
        resource.categories.includes(category)
      );

    const matchesQuery =
      !query || searchText.includes(query);

    const matchesServiceArea =
      !filters.serviceArea ||
      resource.serviceAreaType === filters.serviceArea;

    const matchesCost =
      !filters.freeOrLowCost || resource.freeOrLowCost;

    const matchesRemote =
      !filters.remoteServices || resource.remoteServices;

    const matchesEmergency =
      !filters.emergency || resource.emergency;

    return (
      matchesLocation &&
      matchesState &&
      matchesCategory &&
      matchesQuery &&
      matchesServiceArea &&
      matchesCost &&
      matchesRemote &&
      matchesEmergency
    );
  });

  return matches.sort((a, b) => {
    if (filters.sort === "name") {
      return a.name.localeCompare(b.name);
    }

    if (filters.sort === "reviewed") {
      return reviewTime(b.verifiedDate) - reviewTime(a.verifiedDate);
    }

    return (
      Number(b.featured) - Number(a.featured) ||
      reviewTime(b.verifiedDate) - reviewTime(a.verifiedDate) ||
      a.name.localeCompare(b.name)
    );
  });
}

export function hasSearchCriteria(
  filters: ResourceSearchFilters
): boolean {
  return Boolean(
    filters.location ||
      filters.state ||
      filters.categories.length ||
      filters.query ||
      filters.serviceArea ||
      filters.freeOrLowCost ||
      filters.remoteServices ||
      filters.emergency
  );
}

export function hasNarrowingFilters(
  filters: ResourceSearchFilters
): boolean {
  return Boolean(
    filters.serviceArea ||
      filters.freeOrLowCost ||
      filters.remoteServices ||
      filters.emergency ||
      filters.categories.length > 1
  );
}

export function resultsUrl(
  filters: Partial<ResourceSearchFilters>
): string {
  const search = new URLSearchParams();

  if (filters.location) {
    search.set("location", filters.location);
  }

  if (filters.state) {
    search.set("state", filters.state);
  }

  filters.categories?.forEach((category) => {
    search.append("category", category);
  });

  if (filters.query) {
    search.set("query", filters.query);
  }

  if (filters.serviceArea) {
    search.set("serviceArea", filters.serviceArea);
  }

  if (filters.freeOrLowCost) {
    search.set("free", "true");
  }

  if (filters.remoteServices) {
    search.set("remote", "true");
  }

  if (filters.emergency) {
    search.set("emergency", "true");
  }

  if (filters.sort && filters.sort !== "featured") {
    search.set("sort", filters.sort);
  }

  const query = search.toString();

  return query
    ? `/resources/results?${query}`
    : "/resources/results";
}

export function formatReviewDate(date: string): string {
  if (!date) return "Not yet reviewed";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Review date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function reviewTime(date: string): number {
  if (!date) return 0;

  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}
