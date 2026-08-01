import Link from "next/link";
import type { ReentrySlug } from "../../data/reentry";
import { reentryGuides } from "../../data/reentry";

export function ReentryGuideNavigation({ current }: { current?: ReentrySlug }) {
  return <nav className="reentry-guide-navigation" aria-label="Reentry guides"><p>Reentry guides</p><div>{reentryGuides.map((guide) => <Link key={guide.slug} href={`/reentry/${guide.slug}`} aria-current={guide.slug === current ? "page" : undefined}>{guide.kicker}</Link>)}</div></nav>;
}
