import { getCategoryName, sampleResources, type ResourceCategorySlug, type ResourceData, resourceCategoryOptions } from "../data/resources";

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

function values(value: SearchParamValue) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function first(value: SearchParamValue) {
  return values(value)[0] ?? "";
}

function isCategory(value: string): value is ResourceCategorySlug {
  return resourceCategoryOptions.some((category) => category.slug === value);
}

export function parseResourceFilters(searchParams: ResourceSearchParams): ResourceSearchFilters {
  return {
    location: first(searchParams.location).trim(),
    state: first(searchParams.state).trim(),
    categories: values(searchParams.category).filter(isCategory),
    query: first(searchParams.query).trim(),
    serviceArea: first(searchParams.serviceArea).trim(),
    freeOrLowCost: first(searchParams.free) === "true",
    remoteServices: first(searchParams.remote) === "true",
    emergency: first(searchParams.emergency) === "true",
    sort: ["featured", "name", "reviewed"].includes(first(searchParams.sort)) ? first(searchParams.sort) as ResourceSearchFilters["sort"] : "featured",
  };
}

export function filterResources(filters: ResourceSearchFilters, source: ResourceData[] = sampleResources) {
  const location = filters.location.toLowerCase();
  const query = filters.query.toLowerCase();

  const matches = source.filter((resource) => {
    const locationText = [resource.location, resource.city, resource.state, resource.zipCode, resource.serviceArea, ...resource.countiesServed].join(" ").toLowerCase();
    const searchText = [resource.name, resource.shortDescription, resource.fullDescription, resource.eligibility, ...resource.services, ...resource.categories.map(getCategoryName)].join(" ").toLowerCase();

    return (!location || locationText.includes(location))
      && (!filters.state || resource.state === filters.state)
      && (!filters.categories.length || filters.categories.some((category) => resource.categories.includes(category)))
      && (!query || searchText.includes(query))
      && (!filters.serviceArea || resource.serviceAreaType === filters.serviceArea)
      && (!filters.freeOrLowCost || resource.freeOrLowCost)
      && (!filters.remoteServices || resource.remoteServices)
      && (!filters.emergency || resource.emergency);
  });

  return matches.sort((a, b) => {
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "reviewed") return new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime();
    return Number(b.featured) - Number(a.featured) || new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime();
  });
}

export function hasSearchCriteria(filters: ResourceSearchFilters) {
  return Boolean(filters.location || filters.state || filters.categories.length || filters.query || filters.serviceArea || filters.freeOrLowCost || filters.remoteServices || filters.emergency);
}

export function hasNarrowingFilters(filters: ResourceSearchFilters) {
  return Boolean(filters.serviceArea || filters.freeOrLowCost || filters.remoteServices || filters.emergency || filters.categories.length > 1);
}

export function resultsUrl(filters: Partial<ResourceSearchFilters>) {
  const search = new URLSearchParams();
  if (filters.location) search.set("location", filters.location);
  if (filters.state) search.set("state", filters.state);
  filters.categories?.forEach((category) => search.append("category", category));
  if (filters.query) search.set("query", filters.query);
  if (filters.serviceArea) search.set("serviceArea", filters.serviceArea);
  if (filters.freeOrLowCost) search.set("free", "true");
  if (filters.remoteServices) search.set("remote", "true");
  if (filters.emergency) search.set("emergency", "true");
  if (filters.sort && filters.sort !== "featured") search.set("sort", filters.sort);
  const query = search.toString();
  return query ? `/resources/results?${query}` : "/resources/results";
}

export function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
