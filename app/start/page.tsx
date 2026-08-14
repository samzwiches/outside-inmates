import type { Metadata } from "next";
import { JourneyCard } from "../components/journeys/JourneyCard";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import { journeys, type JourneySlug } from "../data/journeys";
import type { SiteMediaKey } from "../data/media";

const startJourneyMediaKeys: Record<JourneySlug, SiteMediaKey> = {
  "just-arrested": "home.journey.just-arrested",
  "currently-incarcerated": "home.journey.currently-incarcerated",
  "coming-home": "home.journey.coming-home",
  rebuilding: "home.journey.rebuilding",
  "supporting-someone": "home.journey.supporting-someone",
  "not-sure": "home.journey.not-sure",
};

export const metadata: Metadata = { title: "Start Here | Outside Inmates", description: "Choose a calm, practical path through incarceration, reentry, and family support." };

export default function StartPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="start-page"><PageHero variant="page" mediaKey="start.hero" eyebrow="Start here" breadcrumbLabel="Start Here" title="Where are you today?" description="Pick the situation closest to what happened. You do not need to know the system or have a plan yet." /><section className="section journey-start-section" aria-labelledby="journey-start-heading"><div className="container"><SectionHeading eyebrow="Choose a path" id="journey-start-heading" title="Start with the part that feels most immediate." description="Each path is a guide, not a test. You can change direction whenever another need becomes clearer." /><p className="start-mobile-cue">Pick one. You can change your mind later.</p><div className="journey-card-grid">{journeys.map((journey, index) => <JourneyCard journey={journey} number={index + 1} mediaKey={startJourneyMediaKeys[journey.slug]} urgentLabel={journey.slug === "just-arrested" ? "If this just happened, start here" : undefined} key={journey.slug} />)}</div></div></section><section className="journey-start-note"><div className="container"><p className="eyebrow">A note about this guide</p><h2>These paths do not decide what you need.</h2><p>Laws, facility rules, release conditions, supervision requirements, and program eligibility can vary. Use these pages to prepare questions and find a direction, then confirm details with the relevant official facility, court, supervising agency, attorney, or provider.</p></div></section></main><SiteFooter /></>;
}
