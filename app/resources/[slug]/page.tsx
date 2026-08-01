import { notFound } from "next/navigation";
import { ResourceContactPanel } from "../../components/resources/ResourceContactPanel";
import { ResourceDetailSection } from "../../components/resources/ResourceDetailSection";
import { ResourceDisclaimer } from "../../components/resources/ResourceDisclaimer";
import { ResourceResultCard } from "../../components/resources/ResourceResultCard";
import { VerificationBadge } from "../../components/resources/VerificationBadge";
import { SiteFooter, SiteHeader } from "../../components/layout";
import { getCategoryName, getResourceBySlug, sampleResources } from "../../data/resources";
import { formatReviewDate } from "../../lib/resource-search";
import Link from "next/link";

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();
  const related = sampleResources.filter((item) => item.slug !== resource.slug && item.categories.some((category) => resource.categories.includes(category))).slice(0, 3);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="resource-detail-page">
        <section className="resource-detail-hero">
          <div className="container">
            <Link className="back-link" href="/resources/results">← Back to search results</Link>
            <div className="detail-hero-grid">
              <div><VerificationBadge emergency={resource.emergency} /><p className="eyebrow">{resource.city}, {resource.state} · {resource.serviceArea}</p><h1>{resource.name}</h1><p>{resource.shortDescription}</p><div className="category-tags">{resource.categories.map((category) => <span key={category}>{getCategoryName(category)}</span>)}</div></div>
              <ResourceContactPanel resource={resource} />
            </div>
          </div>
        </section>
        <section className="resource-detail-body">
          <div className="container detail-body-grid">
            <div className="detail-sections">
              <ResourceDetailSection title="About this resource"><p>{resource.fullDescription}</p></ResourceDetailSection>
              <ResourceDetailSection title="Services offered"><ul>{resource.services.map((service) => <li key={service}>{service}</li>)}</ul></ResourceDetailSection>
              <ResourceDetailSection title="Who qualifies"><p>{resource.eligibility}</p></ResourceDetailSection>
              <ResourceDetailSection title="Location and service area"><p><strong>{resource.location}</strong><br />{resource.city}, {resource.state} {resource.zipCode}</p><p>{resource.serviceArea}. Counties served: {resource.countiesServed.join(", ")}.</p></ResourceDetailSection>
              <ResourceDetailSection title="Hours and cost"><p><strong>Hours</strong><br />{resource.hours}</p><p><strong>Cost</strong><br />{resource.cost}</p></ResourceDetailSection>
              <ResourceDetailSection title="How to apply"><p>{resource.applicationProcess}</p></ResourceDetailSection>
              <ResourceDetailSection title="Documents to prepare"><ul>{resource.documentsNeeded.map((document) => <li key={document}>{document}</li>)}</ul></ResourceDetailSection>
              <ResourceDetailSection title="Accessibility and language information"><p><strong>Languages:</strong> {resource.languages.join(", ")}</p><p>{resource.accessibilityNotes}</p></ResourceDetailSection>
            </div>
            <aside className="detail-side-notes"><p><strong>Sample review date</strong>{formatReviewDate(resource.verifiedDate)}</p><p>This is a demonstration listing. It is not independently verified.</p><Link href="/resources#submit-resource">Submit a correction or update <span aria-hidden="true">→</span></Link></aside>
          </div>
        </section>
        <div className="container"><ResourceDisclaimer /></div>
        <section className="section related-resource-section" aria-labelledby="related-resource-heading"><div className="container"><p className="eyebrow">Keep looking</p><h2 id="related-resource-heading">Related resources</h2><div className="featured-resource-grid">{related.map((item) => <ResourceResultCard resource={item} key={item.id} />)}</div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
