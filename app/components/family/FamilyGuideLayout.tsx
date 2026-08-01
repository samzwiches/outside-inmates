import Link from "next/link";
import type { FamilyGuideSlug } from "../../data/family";
import { familyGuides } from "../../data/family";
import { SiteFooter, SiteHeader } from "../layout";
import { GuideNavigation } from "./GuideNavigation";
import { SupportCallout } from "./SupportCallout";

export function FamilyGuideLayout({ slug, children }: { slug: FamilyGuideSlug; children: React.ReactNode }) {
  const guide = familyGuides.find((item) => item.slug === slug);
  if (!guide) return null;
  const related = familyGuides.filter((item) => item.slug !== slug).slice(0, 3);
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="family-guide-page"><section className="guide-page-hero"><div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/families">Families</Link><span aria-hidden="true">/</span><span>{guide.kicker}</span></nav><p className="eyebrow">{guide.kicker}</p><h1>{guide.title}</h1><p>{guide.intro}</p></div></section><div className="container"><GuideNavigation current={slug} /></div><div className="container family-guide-content">{children}</div><div className="container"><SupportCallout href={guide.resourceHref} action={guide.resourceLabel} /></div><section className="related-guides-section"><div className="container"><p className="eyebrow">Keep going</p><h2>Related family guides</h2><div className="family-guide-grid">{related.map((item) => <article className="related-guide-link" key={item.slug}><p>{item.kicker}</p><h3>{item.title}</h3><Link href={`/families/${item.slug}`}>Read next <span aria-hidden="true">→</span></Link></article>)}</div></div></section></main><SiteFooter /></>;
}
