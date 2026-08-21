import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/layout";
import { ResourceContactPanel } from "../../components/resources/ResourceContactPanel";
import { ResourceDetailSection } from "../../components/resources/ResourceDetailSection";
import { ResourceDisclaimer } from "../../components/resources/ResourceDisclaimer";
import { ResourceResultCard } from "../../components/resources/ResourceResultCard";
import { VerificationBadge } from "../../components/resources/VerificationBadge";
import { getCategoryName } from "../../data/resources";
import { formatReviewDate } from "../../lib/resource-search";
import {
  getPublishedResourceBySlug,
  getRelatedPublishedResources,
} from "../../lib/resources-server";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const resource = await getPublishedResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const related = await getRelatedPublishedResources(
    resource.slug,
    resource.categories
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="resource-detail-page">
        <section className="resource-detail-hero">
          <div className="container">
            <Link className="back-link" href="/resources/results">
              ← Back to search results
            </Link>

            <div className="detail-hero-grid">
              <div>
                <VerificationBadge emergency={resource.emergency} />

                <p className="eyebrow">
                  {[resource.city, resource.state]
                    .filter(Boolean)
                    .join(", ")}
                  {resource.serviceArea
                    ? ` · ${resource.serviceArea}`
                    : ""}
                </p>

                <h1>{resource.name}</h1>

                <p>{resource.shortDescription}</p>

                <div className="category-tags">
                  {resource.categories.map((category) => (
                    <span key={category}>
                      {getCategoryName(category)}
                    </span>
                  ))}
                </div>
              </div>

              <ResourceContactPanel resource={resource} />
            </div>
          </div>
        </section>

        <section className="resource-detail-body">
          <div className="container detail-body-grid">
            <div className="detail-sections">
              <ResourceDetailSection title="About this resource">
                <p>{resource.fullDescription}</p>
              </ResourceDetailSection>

              {resource.services.length > 0 && (
                <ResourceDetailSection title="Services offered">
                  <ul>
                    {resource.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </ResourceDetailSection>
              )}

              {resource.eligibility && (
                <ResourceDetailSection title="Who qualifies">
                  <p>{resource.eligibility}</p>
                </ResourceDetailSection>
              )}

              <ResourceDetailSection title="Location and service area">
                {resource.location && (
                  <p>
                    <strong>{resource.location}</strong>
                    <br />
                    {[resource.city, resource.state, resource.zipCode]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                )}

                {resource.serviceArea && (
                  <p>
                    {resource.serviceArea}
                    {resource.countiesServed.length > 0
                      ? `. Counties served: ${resource.countiesServed.join(
                          ", "
                        )}.`
                      : "."}
                  </p>
                )}
              </ResourceDetailSection>

              {(resource.hours || resource.cost) && (
                <ResourceDetailSection title="Hours and cost">
                  {resource.hours && (
                    <p>
                      <strong>Hours</strong>
                      <br />
                      {resource.hours}
                    </p>
                  )}

                  {resource.cost && (
                    <p>
                      <strong>Cost</strong>
                      <br />
                      {resource.cost}
                    </p>
                  )}
                </ResourceDetailSection>
              )}

              {resource.applicationProcess && (
                <ResourceDetailSection title="How to apply">
                  <p>{resource.applicationProcess}</p>
                </ResourceDetailSection>
              )}

              {resource.documentsNeeded.length > 0 && (
                <ResourceDetailSection title="Documents to prepare">
                  <ul>
                    {resource.documentsNeeded.map((document) => (
                      <li key={document}>{document}</li>
                    ))}
                  </ul>
                </ResourceDetailSection>
              )}

              {(resource.languages.length > 0 ||
                resource.accessibilityNotes) && (
                <ResourceDetailSection title="Accessibility and language information">
                  {resource.languages.length > 0 && (
                    <p>
                      <strong>Languages:</strong>{" "}
                      {resource.languages.join(", ")}
                    </p>
                  )}

                  {resource.accessibilityNotes && (
                    <p>{resource.accessibilityNotes}</p>
                  )}
                </ResourceDetailSection>
              )}
            </div>

            <aside className="detail-side-notes">
              <p>
                <strong>Last reviewed</strong>
                <br />
                {formatReviewDate(resource.verifiedDate)}
              </p>

              <p>
                Program details can change. Confirm hours, eligibility,
                costs, and availability directly with the provider.
              </p>

              <Link href="/resources#submit-resource">
                Submit a correction or update
                <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </section>

        <div className="container">
          <ResourceDisclaimer />
        </div>

        {related.length > 0 && (
          <section
            className="section related-resource-section"
            aria-labelledby="related-resource-heading"
          >
            <div className="container">
              <p className="eyebrow">Keep looking</p>

              <h2 id="related-resource-heading">
                Related resources
              </h2>

              <div className="featured-resource-grid">
                {related.map((item) => (
                  <ResourceResultCard
                    resource={item}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}