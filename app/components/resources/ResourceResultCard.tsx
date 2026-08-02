import type { ResourceData } from "../../data/resources";
import { formatReviewDate } from "../../lib/resource-search";
import { getCategoryName } from "../../data/resources";
import { VerificationBadge } from "./VerificationBadge";
import Link from "next/link";

export function ResourceResultCard({ resource }: { resource: ResourceData }) {
  return (
    <article className="resource-result-card">
      <div className="result-card-topline"><VerificationBadge emergency={resource.emergency} compact /><span>{resource.city}, {resource.state} · {resource.serviceArea}</span></div>
      <h2><Link href={`/resources/${resource.slug}`}>{resource.name}</Link></h2>
      <p className="result-description">{resource.shortDescription}</p>
      <div className="category-tags" aria-label="Categories">{resource.categories.map((category) => <span key={category}>{getCategoryName(category)}</span>)}</div>
      <dl className="result-facts">
        <div><dt>Who it is for</dt><dd>{resource.eligibility}</dd></div>
        <div><dt>Cost</dt><dd>{resource.cost}</dd></div>
        <div><dt>Last reviewed</dt><dd>{formatReviewDate(resource.verifiedDate)}</dd></div>
      </dl>
      <div className="result-actions">
        {resource.phone && <a className="text-action" href={`tel:${resource.phone.replace(/[^+\d]/g, "")}`}>Call</a>}
        {resource.website && <a className="text-action" href={resource.website} target="_blank" rel="noreferrer">Visit website</a>}
        <Link className="button button-secondary" href={`/resources/${resource.slug}`}>View details <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
