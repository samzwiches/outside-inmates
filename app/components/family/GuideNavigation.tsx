import Link from "next/link";
import { familyGuides, type FamilyGuideSlug } from "../../data/family";

export function GuideNavigation({ current }: { current?: FamilyGuideSlug }) {
  return <nav className="family-guide-navigation" aria-label="Family Support guides"><p>Family guides</p><div>{familyGuides.map((guide) => <Link key={guide.slug} href={`/families/${guide.slug}`} aria-current={guide.slug === current ? "page" : undefined}>{guide.kicker}</Link>)}</div></nav>;
}
