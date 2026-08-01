import Link from "next/link";
import type { JourneyData } from "../../data/journeys";
import { getCategoryName } from "../../data/resources";

export function JourneyQuickLinks({ journey }: { journey: JourneyData }) {
  return <section className="journey-quick-links" aria-labelledby="journey-guides-title"><div><p className="eyebrow">Useful next places</p><h2 id="journey-guides-title">Recommended guides and resources</h2><p>Choose one. You can return for another when you are ready.</p></div><div className="journey-guide-grid">{journey.recommendedGuides.map((guide) => <article key={guide.href}><h3>{guide.title}</h3><p>{guide.description}</p><Link href={guide.href}>Open guide <span aria-hidden="true">→</span></Link></article>)}</div><div className="journey-resource-links"><p>Relevant Resource Finder categories</p><div>{journey.resourceCategories.map((category) => <Link key={category} href={`/resources/results?category=${category}`}>{getCategoryName(category)} <span aria-hidden="true">→</span></Link>)}</div></div></section>;
}
