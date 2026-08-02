import Link from "next/link";
import { getCategoryName } from "../../data/resources";
import type { ResourceCategorySlug } from "../../data/resources";

export function ReentryResourceLinks({ categories, title = "Relevant Resource Finder links" }: { categories: ResourceCategorySlug[]; title?: string }) {
  return <section className="reentry-resource-links" aria-labelledby="reentry-resource-links-title"><div><p className="eyebrow">Resource Finder</p><h2 id="reentry-resource-links-title">{title}</h2><p>Program details can change. Confirm current information directly with each provider.</p></div><div>{categories.map((category) => <Link key={category} href={`/resources/results?category=${category}`}>{getCategoryName(category)} <span aria-hidden="true">→</span></Link>)}</div></section>;
}
