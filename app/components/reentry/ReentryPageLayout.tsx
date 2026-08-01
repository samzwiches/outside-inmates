import Link from "next/link";
import type { ReentrySlug } from "../../data/reentry";
import { getReentryGuide, getRelatedReentryGuides } from "../../data/reentry";
import type { SiteMediaKey } from "../../data/media";
import { appearanceStyle } from "../../lib/site-appearance";
import { getSitePresentation } from "../../lib/site-media-server";
import { SiteFooter, SiteHeader } from "../layout";
import { SupportCallout } from "../family/SupportCallout";
import { SiteMedia } from "../media/SiteMedia";
import { ReentryChecklist } from "./ReentryChecklist";
import { ReentryGuideCard } from "./ReentryGuideCard";
import { ReentryGuideNavigation } from "./ReentryGuideNavigation";
import { ReentryNotice } from "./ReentryNotice";
import { ReentryResourceLinks } from "./ReentryResourceLinks";
import { ReentryWorksheet } from "./ReentryWorksheet";

const reentryGuideMediaKeys: Partial<Record<ReentrySlug, SiteMediaKey>> = {
  "first-week": "reentry.first-week",
  documents: "reentry.documents",
  housing: "reentry.housing",
  employment: "reentry.employment",
  health: "reentry.health",
  supervision: "reentry.supervision",
  transportation: "reentry.transportation",
  "family-transition": "reentry.family-transition",
};

export async function ReentryPageLayout({ slug }: { slug: ReentrySlug }) {
  const guide = getReentryGuide(slug);
  if (!guide) return null;
  const related = getRelatedReentryGuides(guide.relatedGuideSlugs);
  const mediaKey = reentryGuideMediaKeys[slug];
  const presentation = mediaKey ? await getSitePresentation(mediaKey) : null;
  const hasMedia = Boolean(presentation?.media.imagePath);
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="reentry-page"><section className={`reentry-page-hero ${hasMedia ? "has-site-media" : ""}`} style={appearanceStyle(presentation?.appearance)}>{mediaKey && presentation ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, 42vw" priority /> : null}<div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/reentry">Reentry</Link><span aria-hidden="true">/</span><span>{guide.kicker}</span></nav><p className="eyebrow">{guide.kicker}</p><h1>{guide.title}</h1><p>{guide.intro}</p></div></section><div className="container"><ReentryGuideNavigation current={slug} /></div><section className="reentry-guide-content"><div className="container reentry-guide-layout"><div><p className="eyebrow">A practical guide</p><h2>Start with what needs attention now.</h2><div className="reentry-reading">{guide.sections.map((section) => <section key={section.title}><h3>{section.title}</h3>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>{guide.warnings.map((warning) => <ReentryNotice key={warning.title} notice={warning} />)}{guide.worksheet && <ReentryWorksheet worksheet={guide.worksheet} />}<ReentryChecklist title={`${guide.title.replace(/\.$/, "")} checklist`} intro="Use this as a private planning reference. Keep only the steps that fit your situation." items={guide.checklistItems} /></div><aside className="reentry-guide-reminders"><p className="eyebrow">Important reminders</p><h2>Verify what applies to you.</h2><ul>{guide.reminders.map((reminder) => <li key={reminder}>{reminder}</li>)}</ul><p>This information is general and national. Laws, release procedures, conditions, eligibility, housing policies, and provider requirements can vary.</p></aside></div></section><section className="section reentry-resources-section"><div className="container"><ReentryResourceLinks categories={guide.resourceCategories} /></div></section><div className="container"><SupportCallout title="One useful step is enough for today." body="Choose the resource, guide, or official contact that makes the next question clearer." href={`/resources/results?category=${guide.resourceCategories[0]}`} action="Find relevant resources" /></div><section className="reentry-related-section"><div className="container"><p className="eyebrow">Keep going</p><h2>Related reentry guides</h2><div className="reentry-guide-grid">{related.map((item) => <ReentryGuideCard guide={item} key={item.slug} />)}</div></div></section></main><SiteFooter /></>;
}
