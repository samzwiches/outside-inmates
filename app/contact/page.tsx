import type { Metadata } from "next";
import Link from "next/link";
import { SiteCardImage } from "../components/cards/SiteCardImage";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import { getSiteCards } from "../lib/site-card-server";

export const metadata: Metadata = {
  title: "Contact | Outside Inmates",
  description: "Find the best way to reach Outside Inmates for questions, resource corrections, participation, and community support.",
};

const contactPaths = [
  { key: "contact.route.direction", number: "01", eyebrow: "Need direction", title: "I need help figuring out where to start.", body: "Use the guided help path when the question is personal, complicated, or you are not sure which resource category fits.", href: "/start/not-sure", action: "Ask for help", tone: "clay" },
  { key: "contact.route.resource", number: "02", eyebrow: "Resource information", title: "I found a resource or something needs correcting.", body: "Send a new program, updated phone number, changed eligibility rule, closure, or other correction to the private review queue.", href: "/resources/submit", action: "Submit or correct a resource", tone: "sage" },
  { key: "contact.route.community", number: "03", eyebrow: "Community question", title: "I want to ask people who understand.", body: "Use the community board for practical questions that are safe to discuss publicly. Leave names, case details, addresses, and private medical information out.", href: "/community#new-thread", action: "Ask the community", tone: "blue" },
  { key: "contact.route.contribute", number: "04", eyebrow: "Work with us", title: "I want to volunteer, contribute, or help build this.", body: "Outside Inmates is still growing. If you have lived experience, professional knowledge, research skills, or community connections, start here.", href: "/support#participation-note", action: "See ways to contribute", tone: "clay" },
] as const;

export default async function ContactPage() {
  const cards = await getSiteCards(contactPaths.map((path) => path.key));
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="contact-page">
    <PageHero variant="page" mediaKey="contact.hero" eyebrow="Contact" title="Reach the right place without getting bounced around." description="Different questions need different kinds of care. Choose the route that fits what you are trying to do and we will point you toward the best next step." />
    <section className="section contact-paths-section" aria-labelledby="contact-paths-heading"><div className="container"><SectionHeading eyebrow="Choose a route" id="contact-paths-heading" title="What are you trying to reach us about?" description="Pick the closest fit. You do not need to explain everything before you begin." /><div className="contact-path-grid">{contactPaths.map((path) => {
      const card = cardsByKey.get(path.key);
      const tone = card?.tone ?? path.tone;
      return <article className={`contact-path-card contact-path-${tone} ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={path.key} key={path.number}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<div className="contact-path-topline"><span>{path.number}</span><p className="eyebrow">{card?.eyebrow ?? path.eyebrow}</p></div><h2>{card?.title ?? path.title}</h2><p>{card?.description ?? path.body}</p><Link href={card?.href ?? path.href}>{card?.actionLabel ?? path.action} <span aria-hidden="true">→</span></Link></article>;
    })}</div></div></section>
    <section className="contact-privacy-section" aria-labelledby="contact-privacy-heading"><div className="container contact-privacy-layout"><div><p className="eyebrow">Before you send anything</p><h2 id="contact-privacy-heading">Protect the details that should stay private.</h2></div><div><p>Do not post Social Security numbers, account credentials, private medical records, full legal case files, home addresses, verification codes, or identifying information about another person without permission.</p><p>If there is immediate physical danger, contact emergency services. If you or someone else is in emotional distress or crisis, call or text 988.</p><a href="https://988lifeline.org/get-help/" target="_blank" rel="noreferrer">Connect with the 988 Lifeline <span aria-hidden="true">↗</span></a></div></div></section>
    <section className="section contact-footer-note" aria-labelledby="contact-note-heading"><div className="container"><p className="eyebrow">Still not sure?</p><h2 id="contact-note-heading">Start with the help path.</h2><p>That route is designed for the questions that do not fit neatly into a category yet.</p><Link className="button button-primary" href="/start/not-sure">Help me find the right next step <span aria-hidden="true">→</span></Link></div></section>
  </main><SiteFooter /></>;
}
