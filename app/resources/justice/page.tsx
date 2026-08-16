import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/layout";
import { PageHero } from "../../components/page-hero";
import { SectionHeading } from "../../components/section-heading";
import { SiteCardImage } from "../../components/cards/SiteCardImage";
import { stateOptions } from "../../data/resources";
import { getJusticeStateCounts } from "../../lib/resources-server";
import { getSiteCards } from "../../lib/site-card-server";

export const metadata: Metadata = {
  title: "Police, Jails, Prisons, and Courts by State | Outside Inmates",
  description: "Find official police, sheriff, jail, corrections, and court contacts by state, with links into the Outside Inmates resource directory.",
};

export default async function JusticeDirectoryPage() {
  const states = stateOptions.filter((state) => state.value);
  const [counts, cards] = await Promise.all([
    getJusticeStateCounts(),
    getSiteCards(states.map((state) => `resources.justice.${state.value}`)),
  ]);
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));

  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="justice-directory-page">
    <PageHero variant="page" mediaKey="resources.justice.hero" eyebrow="Official contacts" breadcrumbLabel="Police + Jails + Courts" title="Find police, jails, corrections, and courts by state." description="Choose a state to open official law-enforcement, custody, facility, and court listings in the Resource Finder. We are building this as a national directory families can use when they need to figure out who arrested someone, where they may be held, and who to call next." />

    <section className="section justice-directory-intro" aria-labelledby="justice-directory-heading"><div className="container"><div className="section-split-heading"><SectionHeading eyebrow="All 50 states + DC" id="justice-directory-heading" title="Start with the state where the arrest, case, facility, or supervision is located." description="State police, county sheriffs, local jails, state corrections systems, and court systems are different agencies. The directory keeps them together while clearly labeling the source so you can verify details directly." /><Link className="button button-secondary" href="/resources">Open full Resource Finder <span aria-hidden="true">→</span></Link></div>
      <div className="justice-state-grid">{states.map((state) => {
        const card = cardsByKey.get(`resources.justice.${state.value}`);
        const stateCounts = counts[state.value] ?? { jailsCorrections: 0, courts: 0 };
        return <article className={`justice-state-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={`resources.justice.${state.value}`} key={state.value}>
          {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}
          <div className="justice-state-card-heading"><span>{card?.eyebrow ?? state.value}</span><h2>{card?.title ?? state.label}</h2></div>
          <p>{card?.description ?? "Official police, sheriff, jail, corrections, and court contacts for this state."}</p>
          <div className="justice-state-links"><Link href={card?.href ?? `/resources/results?state=${state.value}&category=jails-corrections`}>{card?.actionLabel ?? "Police, jails + corrections"}<small>{stateCounts.jailsCorrections} listed</small><span aria-hidden="true">→</span></Link><Link href={card?.secondaryHref ?? `/resources/results?state=${state.value}&category=courts`}>{card?.secondaryActionLabel ?? "Courts"}<small>{stateCounts.courts} listed</small><span aria-hidden="true">→</span></Link></div>
        </article>;
      })}</div>
    </div></section>

    <section className="justice-directory-note"><div className="container"><p className="eyebrow">Building the directory</p><h2>State entry points first, local numbers next.</h2><p>We are adding official state police and patrol contacts, sheriff and jailer offices, facility directories, county and regional jail contacts, clerk information, and other verified justice-system numbers. Each listing belongs in the Resource Finder so it can be searched, reviewed, corrected, and dated like every other resource.</p><Link className="button button-primary" href="/resources/submit">Submit or correct an official contact <span aria-hidden="true">→</span></Link></div></section>
  </main><SiteFooter /></>;
}
