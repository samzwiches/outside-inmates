import Link from "next/link";
import { ActiveFilterPills } from "../../components/resources/ActiveFilterPills";
import { ResourceEmptyState } from "../../components/resources/ResourceEmptyState";
import { ResourceFilters } from "../../components/resources/ResourceFilters";
import { ResourceResultCard } from "../../components/resources/ResourceResultCard";
import { ResourceSearchPanel } from "../../components/resources/ResourceSearchPanel";
import { SiteFooter, SiteHeader } from "../../components/layout";
import {
  filterResources,
  hasNarrowingFilters,
  hasSearchCriteria,
  parseResourceFilters,
  type ResourceSearchParams,
} from "../../lib/resource-search";
import { getPublishedResources } from "../../lib/resources-server";

export default async function ResourceResultsPage({
  searchParams,
}: {
  searchParams: Promise<ResourceSearchParams>;
}) {
  const filters = parseResourceFilters(await searchParams);

  const resources = await getPublishedResources();
  const results = filterResources(filters, resources);

  const hasCriteria = hasSearchCriteria(filters);

  const emptyVariant = !resources.length
    ? "unavailable"
    : !hasCriteria
      ? "no-location"
      : hasNarrowingFilters(filters)
        ? "narrow"
        : "no-results";

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="results-page">
        <section className="results-search-header">
          <div className="container">
            <p className="eyebrow">Resource directory</p>

            <h1>Find what could help next.</h1>

            <p>
              Search reviewed resources by location, need, and service area.
              Program details can change, so confirm information directly with
              the provider.
            </p>

            <ResourceSearchPanel
              initial={filters}
              className="results-search-panel"
            />
          </div>
        </section>

        <section className="results-main-section">
          <div className="container">
            <ActiveFilterPills filters={filters} />

            <div className="results-layout">
              <ResourceFilters filters={filters} />

              <div className="results-content" aria-live="polite">
                <div className="results-summary">
                  <p>
                    {hasCriteria
                      ? `${results.length} ${
                          results.length === 1 ? "resource" : "resources"
                        } found`
                      : "Choose a starting point to see resources"}
                  </p>

                  {hasCriteria && (
                    <Link href="/resources/results">Clear filters</Link>
                  )}
                </div>

                {!results.length ? (
                  <ResourceEmptyState variant={emptyVariant} />
                ) : (
                  <div className="results-list">
                    {results.map((resource) => (
                      <ResourceResultCard
                        resource={resource}
                        key={resource.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
