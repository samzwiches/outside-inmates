import type { Metadata } from "next";
import { JourneyCard } from "../components/journeys/JourneyCard";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import { journeys } from "../data/journeys";

export const metadata: Metadata = { title: "Start Here | Outside Inmates", description: "Choose a calm, practical path through incarceration, reentry, and family support." };

export default function StartPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="start-page"><PageHero variant="page" mediaKey="start.hero" eyebrow="Start here" breadcrumbLabel="Start Here" title="Where are you today?" description="You do not need to understand the system before you begin. Choose the situation that feels closest to yours, and we will help you find the next useful step." /><section className="section journey-start-section" aria-labelledby="journey-start-heading"><div className="container"><SectionHeading eyebrow="Choose a path" id="journey-start-heading" title="Start with the part that feels most immediate." description="Each path is a guide, not a test. You can change direction whenever another need becomes clearer." /><div className="journey-card-grid">{journeys.map((journey, index) => <JourneyCard journey={journey} number={index + 1} key={journey.slug} />)}</div></div></section><section className="journey-start-note"><div className="container"><p className="eyebrow">A note about this guide</p><h2>These paths do not decide what you need.</h2><p>Laws, facility rules, release conditions, supervision requirements, and program eligibility can vary. Use these pages to prepare questions and find a direction, then confirm details with the relevant official facility, court, supervising agency, attorney, or provider.</p></div></section></main><SiteFooter /></>;
}
