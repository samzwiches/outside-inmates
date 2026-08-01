import { getCategoryName } from "../../data/resources";
import { resultsUrl, type ResourceSearchFilters } from "../../lib/resource-search";
import Link from "next/link";

export function ActiveFilterPills({ filters }: { filters: ResourceSearchFilters }) {
  const pills = [
    filters.location && { label: `Near ${filters.location}`, href: resultsUrl({ ...filters, location: "" }) },
    filters.state && { label: filters.state, href: resultsUrl({ ...filters, state: "" }) },
    ...filters.categories.map((category) => ({ label: getCategoryName(category), href: resultsUrl({ ...filters, categories: filters.categories.filter((item) => item !== category) }) })),
    filters.query && { label: `“${filters.query}”`, href: resultsUrl({ ...filters, query: "" }) },
    filters.serviceArea && { label: filters.serviceArea, href: resultsUrl({ ...filters, serviceArea: "" }) },
    filters.freeOrLowCost && { label: "Free or low-cost", href: resultsUrl({ ...filters, freeOrLowCost: false }) },
    filters.remoteServices && { label: "Remote services", href: resultsUrl({ ...filters, remoteServices: false }) },
    filters.emergency && { label: "Urgent support", href: resultsUrl({ ...filters, emergency: false }) },
  ].filter(Boolean) as { label: string; href: string }[];

  if (!pills.length) return null;
  return <div className="active-filter-pills" aria-label="Active filters">{pills.map((pill) => <Link href={pill.href} key={`${pill.label}-${pill.href}`}>{pill.label}<span aria-hidden="true">×</span></Link>)}<Link className="clear-all" href="/resources/results">Clear all</Link></div>;
}
