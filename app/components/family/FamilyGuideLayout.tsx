import Link from "next/link";
import type { FamilyGuideSlug } from "../../data/family";
import { familyGuides } from "../../data/family";
import type { SiteMediaKey } from "../../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../../lib/site-appearance";
import { getSiteCard } from "../../lib/site-card-server";
import { getSitePresentation } from "../../lib/site-media-server";
import { SiteFooter, SiteHeader } from "../layout";
import { GuideNavigation } from "./GuideNavigation";
import { SiteMedia } from "../media/SiteMedia";
import { FamilyGuideCard } from "./FamilyGuideCard";
import { SupportCallout } from "./SupportCallout";

const guideMediaKeys: Partial<Record<FamilyGuideSlug, SiteMediaKey>> = {
  "just-incarcerated": "families.just-incarcerated",
  "staying-connected": "families.staying-connected",
  children: "families.children",
  visitation: "families.visitation",
  "emotional-support": "families.emotional-support",
};

export async function FamilyGuideLayout({ slug, children }: { slug: FamilyGuideSlug; children: React.ReactNode }) {
  const guide = familyGuides.find((item) => item.slug === slug);
  if (!guide) return null;

  const card = await getSiteCard(`families.guide.${slug}`);
  const related = familyGuides.filter((item) => item.slug !== slug).slice(0, 3);
  const mediaKey = guideMediaKeys[slug];
  const presentation = mediaKey ? await getSitePresentation(mediaKey) : null;
  const hasCardImage = Boolean(card?.imageUrl);
  const hasMedia = hasCardImage || Boolean(presentation?.media.imagePath);
  const hasVisualOverrides = hasMediaVisualOverrides(presentation?.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation?.appearance);
  const kicker = card?.eyebrow ?? guide.kicker;
  const title = card?.title ?? guide.title;
  const intro = card?.description ?? guide.intro;

  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="family-guide-page"><section className={`guide-page-hero ${hasMedia ? "has-site-media" : ""}`} data-media-key={mediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation?.appearance)}>{hasCardImage ? <><img className="guide-page-card-image" src={card!.imageUrl!} alt={card?.imageAlt ?? ""} style={{ objectPosition: `${card?.focalX ?? 50}% ${card?.focalY ?? 50}%` }} /><div className="guide-page-card-overlay" aria-hidden="true" /></> : mediaKey && presentation ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, 42vw" priority showOverlay={!hasVisualOverrides} /> : null}<div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/families">Families</Link><span aria-hidden="true">/</span><span>{kicker}</span></nav><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{intro}</p></div></section><div className="container"><GuideNavigation current={slug} /></div><div className="container family-guide-content">{children}</div><div className="container"><SupportCallout href={guide.resourceHref} action={guide.resourceLabel} /></div><section className="related-guides-section"><div className="container"><p className="eyebrow">Keep going</p><h2>Related family guides</h2><div className="family-guide-grid">{related.map((item) => <FamilyGuideCard key={item.slug} {...item} actionLabel="Read next" />)}</div></div></section></main><SiteFooter /></>;
}
