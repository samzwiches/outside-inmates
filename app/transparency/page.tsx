import type { Metadata } from "next";
import Link from "next/link";
import { SiteCardImage } from "../components/cards/SiteCardImage";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { plannedPublicDocuments, organizationStatusItems, readableStatusDate } from "../data/organization";
import { getSiteCards } from "../lib/site-card-server";

export const metadata: Metadata = {
  title: "Transparency | Outside Inmates",
  description: "Clear, current information about Outside Inmates' formation, governance, funding, and public documents.",
};

export default async function TransparencyPage() {
  const statusKeys = organizationStatusItems.map((_, index) => `transparency.status.${String(index + 1).padStart(2, "0")}`);
  const documentKeys = plannedPublicDocuments.map((_, index) => `transparency.document.${String(index + 1).padStart(2, "0")}`);
  const cards = await getSiteCards([...statusKeys, ...documentKeys]);
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="organization-page transparency-page">
    <PageHero variant="page" mediaKey="transparency.hero" eyebrow="Transparency" title="Built in public, governed with care." description="Outside Inmates is committed to clear information about how the organization is built, governed, funded, and maintained." />
    <section className="section transparency-status-section" aria-labelledby="current-status-heading"><div className="container"><div className="organization-section-lede"><p className="eyebrow">Current status</p><h2 id="current-status-heading">What is true today.</h2><p>These entries are written to be updated as the organization develops. Each status is expressed in words, not color alone.</p></div><div className="organization-status-grid">{organizationStatusItems.map((item, index) => {
      const cardKey = `transparency.status.${String(index + 1).padStart(2, "0")}`;
      const card = cardsByKey.get(cardKey);
      return <article className={`organization-status-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={item.label}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<div className="organization-status-card-heading"><p className="eyebrow">{card?.title ?? item.label}</p><span className={`organization-status-label status-${item.status}`}>{card?.eyebrow ?? item.statusLabel}</span></div><p>{card?.description ?? item.description}</p>{item.plannedDocuments ? <ul>{item.plannedDocuments.map((document) => <li key={document}>{document}</li>)}</ul> : null}{card?.href && card.actionLabel ? <Link className="transparency-card-link" href={card.href}>{card.actionLabel} <span aria-hidden="true">→</span></Link> : null}<footer>Last updated <time dateTime={item.lastUpdated}>{readableStatusDate(item.lastUpdated)}</time></footer></article>;
    })}</div></div></section>
    <section className="organization-documents-section" aria-labelledby="planned-documents-heading"><div className="container organization-documents-layout"><div><p className="eyebrow">Documents we plan to publish</p><h2 id="planned-documents-heading">A public record as it becomes available.</h2><p>These are not links yet. Nothing is represented as filed, approved, or published before it actually is.</p></div><ul className="organization-document-list">{plannedPublicDocuments.map((document, index) => {
      const cardKey = `transparency.document.${String(index + 1).padStart(2, "0")}`;
      const card = cardsByKey.get(cardKey);
      return <li className={`${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={document.label}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<div><h3>{card?.title ?? document.label}</h3><p>{card?.description ?? document.description}</p></div>{card?.href && card.actionLabel ? <Link href={card.href}>{card.actionLabel} <span aria-hidden="true">→</span></Link> : <span aria-label={`${card?.title ?? document.label}: not yet available`}>Not yet available</span>}</li>;
    })}</ul></div></section>
  </main><SiteFooter /></>;
}
