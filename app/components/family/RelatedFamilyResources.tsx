import Link from "next/link";
import { sampleResources } from "../../data/resources";
import { ResourceResultCard } from "../resources/ResourceResultCard";

export function RelatedFamilyResources() {
  const resources = sampleResources.filter((resource) => resource.categories.includes("family-support") || resource.categories.includes("communication-visitation")).slice(0, 3);
  return <section className="related-family-resources" aria-labelledby="related-family-resources-title"><div className="section-split-heading"><div><p className="eyebrow">Resource directory</p><h2 id="related-family-resources-title">Family-related resources</h2><p>These shared sample entries come from the Resource Finder and remain clearly marked as demonstration data.</p></div><Link className="button button-secondary" href="/resources/results?category=family-support">Browse all family support resources <span aria-hidden="true">→</span></Link></div><div className="featured-resource-grid">{resources.map((resource) => <ResourceResultCard resource={resource} key={resource.id} />)}</div></section>;
}
