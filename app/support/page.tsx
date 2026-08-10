import type { Metadata } from "next";
import Link from "next/link";
import { SiteCardImage } from "../components/cards/SiteCardImage";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import { supportExpertise, supportOpportunities } from "../data/organization";
import { getSiteCards } from "../lib/site-card-server";

export const metadata: Metadata = {
  title: "Support the Work | Outside Inmates",
  description: "Practical ways to help Outside Inmates develop responsible, useful support before formal fundraising begins.",
};

export default async function SupportPage() {
  const cards = await getSiteCards(supportOpportunities.map((_, index) => `support.opportunity.${String(index + 1).padStart(2, "0")}`));
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="organization-page support-page">
    <PageHero variant="page" mediaKey="support.hero" eyebrow="Support the work" title="Help build something people can actually use." description="Outside Inmates is being built by people who believe no one should have to navigate incarceration or reentry alone. Whether you share a resource, volunteer your expertise, or help us spot what is missing, every contribution makes the path a little clearer for someone else."><div className="hero-actions"><Link className="button button-primary" href="#participation-heading">Become a contributor <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/resources#submit-resource">Share a resource</Link></div></PageHero>

    <section className="section support-opportunities-section" aria-labelledby="participation-heading"><div className="container"><SectionHeading eyebrow="How you can help" id="participation-heading" title="Start with the work that needs care." description="Every contribution should make information clearer, safer, more accurate, or easier to use." /><div className="support-opportunity-grid">{supportOpportunities.map((opportunity, index) => {
      const cardKey = `support.opportunity.${String(index + 1).padStart(2, "0")}`;
      const card = cardsByKey.get(cardKey);
      return <article className={`support-opportunity-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={opportunity.title}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{card?.title ?? opportunity.title}</h3><p>{card?.description ?? opportunity.description}</p><Link href={card?.href ?? opportunity.href}>{card?.actionLabel ?? opportunity.action} <span aria-hidden="true">→</span></Link></article>;
    })}</div></div></section>

    <section className="support-expertise-section" id="participation-note" aria-labelledby="expertise-heading"><div className="container organization-two-column"><div><p className="eyebrow">Areas of expertise</p><h2 id="expertise-heading">Knowledge that could make the work more useful.</h2><p>Early participation may include review, research, systems thinking, governance support, or helping identify where the next practical resource belongs.</p></div><ul className="support-expertise-list">{supportExpertise.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="container support-safety-note"><p className="eyebrow">A safety note</p><h2>Private stories need a safer place than an early contact form.</h2><p>Please do not send sensitive personal histories, legal case details, medical information, or identifying information through an unsecured form. A secure participation process will be shared when it is ready.</p></div></section>

    <section className="support-fundraising-notice"><div className="container"><p>Outside Inmates is not currently accepting tax-deductible charitable donations. Fundraising information will be published after the appropriate legal, banking, and registration steps are completed.</p></div></section>
  </main><SiteFooter /></>;
}
