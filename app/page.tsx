import { ActionCard, ForumPreviewCard, ResourceCard } from "./components/cards";
import { PrimaryButton, SecondaryButton } from "./components/buttons";
import { JourneyCard } from "./components/journeys/JourneyCard";
import { SiteFooter, SiteHeader } from "./components/layout";
import { PageHero } from "./components/page-hero";
import { SectionHeading } from "./components/section-heading";
import { TrustStrip } from "./components/trust-strip";
import { forumPosts, resourceCategories } from "./data/site";
import { journeys } from "./data/journeys";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <PageHero mediaKey="home.hero" />

        <section className="section section-pathways home-journey-section" aria-labelledby="start-here-heading">
          <div className="container">
            <SectionHeading
              eyebrow="Start here"
              id="start-here-heading"
              title="Where are you today?"
              description="Choose the situation that feels closest to yours. You do not need to understand the system before you begin."
            />
            <div className="journey-card-grid home-journey-grid">
              {journeys.map((journey, index) => <JourneyCard key={journey.slug} journey={journey} number={index + 1} compact />)}
            </div>
            <a className="quiet-link home-journey-link" href="/start">See all guided paths <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="section resource-section" id="resources" aria-labelledby="resource-heading">
          <div className="container resource-layout">
            <div>
              <SectionHeading
                eyebrow="Resource finder"
                id="resource-heading"
                title="Find help near you."
                description="Start with a ZIP code or state. We will help narrow the next useful place to look."
                inverted
              />
              <form className="resource-search" action="/resources/results" method="get">
                <label className="sr-only" htmlFor="location">ZIP code or state</label>
                <input id="location" name="location" type="text" placeholder="Enter ZIP code or state" inputMode="numeric" />
                <button className="button button-light" type="submit">Search resources <span aria-hidden="true">→</span></button>
              </form>
              <p className="search-note">The directory currently uses clearly labeled demonstration data while live resources are prepared.</p>
            </div>
            <ul className="resource-grid" aria-label="Resource categories">
              {resourceCategories.map((resource) => <ResourceCard key={resource.title} {...resource} />)}
            </ul>
          </div>
        </section>

        <section className="section community-section" id="community" aria-labelledby="community-heading">
          <div className="container">
            <div className="section-split-heading">
              <SectionHeading
                eyebrow="Community preview"
                id="community-heading"
                title="You are not the only one asking."
                description="Practical questions, shared honestly. Read from people who have been there, without needing to explain every detail first."
              />
              <SecondaryButton href="#ask-an-advocate">Ask a question <span aria-hidden="true">↗</span></SecondaryButton>
            </div>
            <div className="forum-grid">
              {forumPosts.map((post) => <ForumPreviewCard key={post.title} {...post} />)}
            </div>
          </div>
        </section>

        <section className="section feature-section" aria-label="Family and reentry support">
          <div className="container feature-grid">
            <ActionCard
              id="families"
              eyebrow="For families"
              title="Support from the outside still matters."
              description="Visitation, communication, parenting, emotional support, and navigating the system from the outside."
              action="Explore family support"
              href="/families"
              theme="clay"
              visual="family"
            />
            <ActionCard
              id="reentry"
              eyebrow="For reentry"
              title="Build the next chapter with support."
              description="Housing, employment, documents, treatment, transportation, and the practical steps toward steadier ground."
              action="Explore reentry support"
              href="/reentry"
              theme="sage"
              visual="reentry"
            />
          </div>
        </section>

        <section className="section advocate-section" id="ask-an-advocate" aria-labelledby="advocate-heading">
          <div className="container advocate-layout">
            <div className="advocate-seal" aria-hidden="true"><span>OI</span></div>
            <div>
              <SectionHeading
                eyebrow="Ask an advocate"
                id="advocate-heading"
                title="Ask someone who understands."
                description="Submit a question to an advocate, peer supporter, or experienced community member. We cannot provide legal representation, but we can help you find the right direction."
              />
              <PrimaryButton href="#site-footer">Submit a question <span aria-hidden="true">→</span></PrimaryButton>
            </div>
          </div>
        </section>

        <section className="section mission-section" id="about" aria-labelledby="mission-heading">
          <div className="container mission-layout">
            <p className="mission-mark" aria-hidden="true">“</p>
            <SectionHeading
              eyebrow="Why we are here"
              id="mission-heading"
              title="Incarceration affects entire families."
              description="Outside Inmates exists to make information easier to find, reduce isolation, and help people navigate incarceration and reentry with dignity, practical support, and community."
            />
          </div>
        </section>

        <TrustStrip />
      </main>
      <SiteFooter />
    </>
  );
}
