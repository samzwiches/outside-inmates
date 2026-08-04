import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { ResourceCategoryCard } from "../components/resources/ResourceCategoryCard";
import { ResourceResultCard } from "../components/resources/ResourceResultCard";
import { ResourceSearchPanel } from "../components/resources/ResourceSearchPanel";
import { SectionHeading } from "../components/section-heading";
import {
  resourceCategoryOptions,
  resourcePathways,
} from "../data/resources";
import { getPublishedResources } from "../lib/resources-server";

export default async function ResourcesPage() {
  const resources = await getPublishedResources();

  const featured = resources
    .filter((resource) => resource.featured)
    .slice(0, 3);

  const fallbackFeatured = resources.slice(0, 3);

  const displayedResources =
    featured.length > 0 ? featured : fallbackFeatured;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content">
        <PageHero
          variant="page"
          mediaKey="resources.hero"
          eyebrow="Resource directory"
          title="Find the help that fits your situation."
          description="Search by location, need, or stage of the journey. You do not need to know the name of a program or the right agency before you begin."
        >
          <ResourceSearchPanel />
        </PageHero>

        <section
          className="section directory-browse-section"
          aria-labelledby="browse-category-heading"
        >
          <div className="container">
            <SectionHeading
              eyebrow="Browse by category"
              id="browse-category-heading"
              title="Start with the kind of help you need."
              description="Choose the closest fit. You can broaden or change the search at any time."
            />

            <div className="directory-category-grid">
              {resourceCategoryOptions.map((category) => (
                <ResourceCategoryCard
                  key={category.slug}
                  {...category}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="section directory-pathway-section"
          aria-labelledby="directory-pathway-heading"
        >
          <div className="container">
            <SectionHeading
              eyebrow="Guided pathways"
              id="directory-pathway-heading"
              title="Start with your situation."
              description="When you are not sure what category fits, begin with the question that is taking up the most room right now."
            />

            <div className="directory-pathway-grid">
              {resourcePathways.map((pathway, index) => (
                <Link
                  href={pathway.href}
                  className="directory-pathway-card"
                  key={pathway.title}
                >
                  <span>0{index + 1}</span>
                  <strong>{pathway.title}</strong>
                  <small>{pathway.detail}</small>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {displayedResources.length > 0 && (
          <section
            className="section directory-featured-section"
            aria-labelledby="featured-resource-heading"
          >
            <div className="container">
              <div className="section-split-heading">
                <SectionHeading
                  eyebrow="Featured resources"
                  id="featured-resource-heading"
                  title="A few places to begin."
                  description="Reviewed resources chosen to help people find a practical next step."
                />

                <Link
                  className="button button-secondary"
                  href="/resources/results"
                >
                  Browse all resources
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="featured-resource-grid">
                {displayedResources.map((resource) => (
                  <ResourceResultCard
                    resource={resource}
                    key={resource.id}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="directory-review-section">
          <div className="container review-grid">
            <div>
              <p className="eyebrow">How this directory works</p>

              <h2>
                Clear enough to use. Careful enough to trust.
              </h2>
            </div>

            <div>
              <p>
                Listings are reviewed for contact information, service scope,
                eligibility, and important limitations. We name what is known,
                what still needs confirmation, and when each resource was last
                checked.
              </p>

              <p className="demo-inline-note">
                Program information can change. Always confirm current hours,
                availability, cost, and eligibility directly with the provider.
              </p>
            </div>
          </div>
        </section>

        <section
          className="directory-submit-callout"
          id="submit-resource"
        >
          <div className="container">
            <p className="eyebrow">Help make this more useful</p>

            <h2>Know a resource that belongs here?</h2>

            <p>
              Suggest a new program or send a correction to an existing listing.
              Every submission enters a private review queue before anything is published.
            </p>

            <Link
              className="button button-primary"
              href="/resources/submit"
            >
              Submit or correct a resource
              <span aria-hidden="true">→</span>
            </Link>

            <p className="submission-note">
              Include an official website, public contact number, or source link when possible.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
