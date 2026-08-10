import type { Metadata } from "next";
import { SiteCardImage } from "../components/cards/SiteCardImage";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import { organizationValues, peopleWeServe, workInProgress } from "../data/organization";
import { getSiteCards } from "../lib/site-card-server";

export const metadata: Metadata = {
  title: "About Outside Inmates",
  description: "Learn why Outside Inmates is being built and the practical support it is designed to make easier to find.",
};

export default async function AboutPage() {
  const buildingKeys = workInProgress.map((_, index) => `about.building.${String(index + 1).padStart(2, "0")}`);
  const valueKeys = organizationValues.map((_, index) => `about.value.${String(index + 1).padStart(2, "0")}`);
  const cards = await getSiteCards([...buildingKeys, ...valueKeys]);
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="organization-page about-page"><PageHero variant="page" mediaKey="about.hero" eyebrow="About Outside Inmates" title="No one should have to navigate incarceration and reentry alone." description="Outside Inmates helps people affected by incarceration find practical information, trusted resources, and a clearer path through family separation, reentry, and rebuilding." />
    <section className="section organization-intro-section"><div className="container organization-two-column"><SectionHeading eyebrow="Why we exist" id="why-we-exist" title="A clearer place to begin." /><div><p>Incarceration affects entire families. People are often expected to understand complicated systems during one of the most difficult periods of their lives. Outside Inmates is being built to make information easier to find, reduce isolation, and help people identify useful next steps.</p></div></div></section>
    <section className="section organization-building-section" aria-labelledby="building-heading"><div className="container"><SectionHeading eyebrow="What we are building" id="building-heading" title="Useful support, gathered with care." description="The goal is not to make people learn a new system. It is to make the next useful question easier to find." /><ul className="organization-feature-list">{workInProgress.map((item, index) => {
      const cardKey = `about.building.${String(index + 1).padStart(2, "0")}`;
      const card = cardsByKey.get(cardKey);
      return <li className={`${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={item}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{card?.title ?? item}</strong>{card?.description ? <p>{card.description}</p> : null}</li>;
    })}</ul></div></section>
    <section className="section organization-audience-section" aria-labelledby="who-it-is-for"><div className="container organization-two-column"><SectionHeading eyebrow="Who it is for" id="who-it-is-for" title="Built around the people affected." /><ul className="organization-check-list">{peopleWeServe.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    <section className="section organization-values-section" aria-labelledby="values-heading"><div className="container"><SectionHeading eyebrow="Our values" id="values-heading" title="How we want the work to feel." /><div className="organization-values-grid">{organizationValues.map((value, index) => {
      const cardKey = `about.value.${String(index + 1).padStart(2, "0")}`;
      const card = cardsByKey.get(cardKey);
      return <article className={`${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={value}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<span aria-hidden="true">•</span><h3>{card?.title ?? value}</h3>{card?.description ? <p>{card.description}</p> : null}</article>;
    })}</div></div></section>
    <section className="organization-status-section" aria-labelledby="organizational-status-heading"><div className="container organization-status-layout"><div><p className="eyebrow">A clear starting point</p><h2 id="organizational-status-heading">Our organizational status</h2></div><div><p>Outside Inmates is currently an independent community project being developed with the intention of forming a Kentucky nonprofit corporation and applying for federal 501(c)(3) tax-exempt status.</p><p>Until that process is complete, Outside Inmates does not represent itself as a tax-exempt charitable organization, and contributions should not be treated as tax-deductible donations.</p></div></div></section>
  </main><SiteFooter /></>;
}
