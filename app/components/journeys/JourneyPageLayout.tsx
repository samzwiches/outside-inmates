import Link from "next/link";
import type { JourneySlug } from "../../data/journeys";
import { getJourney, getRelatedJourneys } from "../../data/journeys";
import type { SiteMediaKey } from "../../data/media";
import { SiteFooter, SiteHeader } from "../layout";
import { SiteMedia } from "../media/SiteMedia";
import { JourneyBoundaryNotice } from "./JourneyBoundaryNotice";
import { JourneyCard } from "./JourneyCard";
import { JourneyChecklist } from "./JourneyChecklist";
import { JourneyQuickLinks } from "./JourneyQuickLinks";
import { JourneyReminder } from "./JourneyReminder";
import { JourneyRoadmap } from "./JourneyRoadmap";

const checklistTitles: Partial<
  Record<JourneySlug, { title: string; intro: string }>
> = {
  "just-arrested": {
    title: "First Days Checklist",
    intro:
      "Use this as a calm reminder, not a test. Check off only what is useful today.",
  },
  "coming-home": {
    title: "Coming Home Preparation Checklist",
    intro:
      "Release details can change. Use this alongside the instructions you confirm through official channels.",
  },
  rebuilding: {
    title: "First Week Priorities Checklist",
    intro:
      "Choose what makes this week more stable. The rest can wait until you are ready.",
  },
};

const journeyHeroMediaKeys: Record<JourneySlug, SiteMediaKey> = {
  "just-arrested": "home.journey.just-arrested",
  "currently-incarcerated": "home.journey.currently-incarcerated",
  "coming-home": "home.journey.coming-home",
  rebuilding: "home.journey.rebuilding",
  "supporting-someone": "home.journey.supporting-someone",
  "not-sure": "journey.not-sure.hero",
};

export async function JourneyPageLayout({
  slug,
  children,
}: {
  slug: JourneySlug;
  children?: React.ReactNode;
}) {
  const journey = getJourney(slug);
  if (!journey) return null;
  const related = getRelatedJourneys(journey.relatedJourneySlugs);
  const checklist = checklistTitles[slug];
  const heroMediaKey = journeyHeroMediaKeys[slug];
  const isNotSureJourney = slug === "not-sure";

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="journey-page">
        <section className="journey-page-hero">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/start">Start Here</Link>
              <span aria-hidden="true">/</span>
              <span>{journey.cardTitle}</span>
            </nav>

            <div className="journey-page-hero-grid has-image-slot">
              <div className="journey-page-hero-copy">
                <p className="eyebrow">Journey pathway</p>
                <h1>{journey.title}</h1>
                <p>{journey.intro}</p>
              </div>

              <div className="journey-page-hero-image">
                <SiteMedia
                  mediaKey={heroMediaKey}
                  sizes="(max-width: 720px) 100vw, 420px"
                  priority
                  reserveSpaceWhenEmpty
                />
              </div>
            </div>
          </div>
        </section>

        <section className="journey-first-action">
          <div className="container">
            <p className="eyebrow">First recommended action</p>
            <p>{journey.firstAction}</p>
          </div>
        </section>

        {isNotSureJourney ? (
          <>
            <section className="journey-details-section">
              <div className="container journey-details-grid">
                <div>{children}</div>
                <JourneyReminder reminders={journey.reminders} />
              </div>
            </section>

            <section className="section journey-links-section">
              <div className="container">
                <JourneyQuickLinks journey={journey} />
              </div>
            </section>

            {journey.urgentSupport && (
              <section className="journey-urgent-section">
                <div className="container">
                  <div>
                    <p className="eyebrow">Urgent emotional support</p>
                    <h2>When the pressure feels too heavy to carry alone.</h2>
                    <p>
                      If you or someone else is in emotional distress or crisis,
                      call or text 988 or use the 988 Lifeline chat. If there is
                      immediate physical danger, call emergency services.
                    </p>
                    <a
                      className="button button-primary"
                      href="https://988lifeline.org/get-help/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Contact 988 Lifeline <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <section className="section journey-roadmap-section">
              <div className="container">
                <JourneyRoadmap steps={journey.steps} />
              </div>
            </section>
            <section className="journey-details-section">
              <div className="container journey-details-grid">
                <div>
                  <p className="eyebrow">Immediate next steps</p>
                  <h2>Make the next call, list, or plan smaller.</h2>
                  <div className="journey-reading">
                    {journey.detailSections.map((section) => (
                      <section key={section.title}>
                        <h3>{section.title}</h3>
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </section>
                    ))}
                  </div>
                  {journey.boundaryNotice && (
                    <JourneyBoundaryNotice notice={journey.boundaryNotice} />
                  )}
                  {children}
                </div>
                <JourneyReminder reminders={journey.reminders} />
              </div>
            </section>
            {checklist && (
              <div className="container journey-checklist-wrap">
                <JourneyChecklist
                  title={checklist.title}
                  intro={checklist.intro}
                  items={journey.checklistItems}
                />
              </div>
            )}
            <section className="section journey-links-section">
              <div className="container">
                <JourneyQuickLinks journey={journey} />
              </div>
            </section>
            {journey.urgentSupport && (
              <section className="journey-urgent-section">
                <div className="container">
                  <div>
                    <p className="eyebrow">Urgent emotional support</p>
                    <h2>When the pressure feels too heavy to carry alone.</h2>
                    <p>
                      If you or someone else is in emotional distress or crisis,
                      call or text 988 or use the 988 Lifeline chat. If there is
                      immediate physical danger, call emergency services.
                    </p>
                    <a
                      className="button button-primary"
                      href="https://988lifeline.org/get-help/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Contact 988 Lifeline <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </section>
            )}
            <section className="journey-do-today">
              <div className="container">
                <div>
                  <p className="eyebrow">One small next step</p>
                  <h2>You do not have to do everything today.</h2>
                  <p>
                    Choose the next useful place to look, then return when another
                    question appears.
                  </p>
                  <Link
                    className="button button-primary"
                    href={journey.recommendedGuides[0]?.href ?? "/resources"}
                  >
                    {journey.recommendedGuides[0]?.title ?? "Find resources"}{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </section>
            <section className="journey-related-section">
              <div className="container">
                <p className="eyebrow">Other paths</p>
                <h2>Another path may fit better tomorrow.</h2>
                <div className="journey-card-grid is-related">
                  {related.map((item, index) => (
                    <JourneyCard
                      key={item.slug}
                      journey={item}
                      number={index + 1}
                      compact
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
