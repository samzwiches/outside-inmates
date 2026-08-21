import type { Metadata } from "next";
import Link from "next/link";
import { SiteCardImage } from "../components/cards/SiteCardImage";
import { ReentryChecklist } from "../components/reentry/ReentryChecklist";
import { ReentryGuideCard } from "../components/reentry/ReentryGuideCard";
import { ReentryPathwayCard } from "../components/reentry/ReentryPathwayCard";
import { ReentryPriorityFramework } from "../components/reentry/ReentryPriorityFramework";
import { ResourceResultCard } from "../components/resources/ResourceResultCard";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import {
  comprehensiveReentryChecklist,
  reentryGuides,
  reentryPathways,
  reentryPriorityGroups,
  reentryResourceCategories,
} from "../data/reentry";
import { getPublishedResources } from "../lib/resources-server";
import { getSiteCards } from "../lib/site-card-server";

export const metadata: Metadata = {
  title: "Reentry Support | Outside Inmates",
  description:
    "Practical, respectful guidance for release preparation and the days, weeks, and months after incarceration.",
};

export default async function ReentryPage() {
  const [resources, directoryCards] = await Promise.all([
    getPublishedResources({
      limit: 3,
      categories: [
        "reentry-planning",
        "housing",
        "identification-documents",
      ],
    }),
    getSiteCards(reentryResourceCategories.map((_, index) => `reentry.directory.${String(index + 1).padStart(2, "0")}`)),
  ]);
  const directoryCardsByKey = new Map(directoryCards.map((card) => [card.key, card]));

  const featuredResources = resources
    .filter(
      (resource) =>
        resource.categories.includes("reentry-planning") ||
        resource.categories.includes("housing") ||
        resource.categories.includes("identification-documents")
    )
    .slice(0, 3);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="reentry-landing">
        <PageHero
          variant="page"
          mediaKey="reentry.hero"
          eyebrow="Reentry"
          title="Coming home takes more than a release date."
          description="Housing, documents, transportation, health care, supervision, work, and family expectations can all arrive at once. Start with what is most urgent and build from there."
        >
          <div className="reentry-hero-actions">
            <Link className="button button-primary" href="/reentry/first-week">Build a First Week Plan <span aria-hidden="true">→</span></Link>
            <Link className="button button-secondary" href="#reentry-directory">Find Reentry Resources</Link>
          </div>
        </PageHero>

        <section className="section reentry-pathways-section" aria-labelledby="reentry-pathways-heading"><div className="container"><SectionHeading eyebrow="Start with the essentials" id="reentry-pathways-heading" title="Choose the support that could make today more stable." description="These are practical starting points, not a required order. Some needs will matter before others." /><div className="reentry-pathway-grid">{reentryPathways.map((pathway, index) => <ReentryPathwayCard key={pathway.title} {...pathway} number={index + 1} />)}</div></div></section>

        <section className="section reentry-priorities-section"><div className="container"><ReentryPriorityFramework groups={reentryPriorityGroups} /></div></section>

        <section className="section reentry-featured-section" aria-labelledby="reentry-guides-heading"><div className="container"><SectionHeading eyebrow="Featured guides" id="reentry-guides-heading" title="Guides for the questions that keep coming up." description="Use one guide at a time, or return when the next practical question appears." /><div className="reentry-guide-grid">{reentryGuides.map((guide) => <ReentryGuideCard key={guide.slug} guide={guide} />)}</div></div></section>

        <section className="section reentry-directory-section" id="reentry-directory" aria-labelledby="reentry-directory-heading"><div className="container"><div className="section-split-heading"><SectionHeading eyebrow="Resource directory" id="reentry-directory-heading" title="Search by the support you need." description="Browse reviewed resources for housing, employment, identification, transportation, legal services, and more. Always confirm current availability directly with the provider." /><Link className="button button-secondary" href="/resources">Open Resource Finder <span aria-hidden="true">→</span></Link></div>
          <div className="reentry-directory-grid">{reentryResourceCategories.map((category, index) => {
            const cardKey = `reentry.directory.${String(index + 1).padStart(2, "0")}`;
            const card = directoryCardsByKey.get(cardKey);
            return <Link className={`${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={category.label} href={card?.href ?? category.href}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<strong>{card?.title ?? category.label}</strong><span>{card?.description ?? category.description}</span><b aria-hidden="true">→</b></Link>;
          })}</div>
          {featuredResources.length > 0 && <div className="featured-resource-grid">{featuredResources.map((resource) => <ResourceResultCard resource={resource} key={resource.id} />)}</div>}
        </div></section>

        <div className="container reentry-comprehensive-wrap"><ReentryChecklist title="A practical reentry checklist" intro="A printable reference for before release, release day, and the weeks that follow. It is not a deadline or an eligibility decision." groups={comprehensiveReentryChecklist} /></div>

        <section className="reentry-landing-note"><div className="container"><p className="eyebrow">A reminder</p><h2>Requirements and plans can change.</h2><p>Confirm release procedures, supervision conditions, benefits, housing rules, health care, and provider eligibility with the relevant official facility, court, supervising agency, government office, health provider, attorney, or program provider.</p></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
