import { ResourceCategoryCard } from "../components/resources/ResourceCategoryCard";
import { ResourceResultCard } from "../components/resources/ResourceResultCard";
import { ResourceSearchPanel } from "../components/resources/ResourceSearchPanel";
import { PageHero } from "../components/page-hero";
import { SectionHeading } from "../components/section-heading";
import { SiteFooter, SiteHeader } from "../components/layout";
import { resourceCategoryOptions, resourcePathways, sampleResources } from "../data/resources";
import Link from "next/link";

export default function ResourcesPage() {
  const featured = sampleResources.filter((resource) => resource.featured).slice(0, 3);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
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

        <section className="section directory-browse-section" aria-labelledby="browse-category-heading">
          <div className="container">
            <SectionHeading eyebrow="Browse by category" id="browse-category-heading" title="Start with the kind of help you need." description="Choose the closest fit. You can broaden or change the search at any time." />
            <div className="directory-category-grid">{resourceCategoryOptions.map((category) => <ResourceCategoryCard key={category.slug} {...category} />)}</div>
          </div>
        </section>

        <section className="section directory-pathway-section" aria-labelledby="directory-pathway-heading">
          <div className="container">
            <SectionHeading eyebrow="Guided pathways" id="directory-pathway-heading" title="Start with your situation." description="When you are not sure what category fits, begin with the question that is taking up the most room right now." />
            <div className="directory-pathway-grid">
              {resourcePathways.map((pathway, index) => <Link href={pathway.href} className="directory-pathway-card" key={pathway.title}><span>0{index + 1}</span><strong>{pathway.title}</strong><small>{pathway.detail}</small><b aria-hidden="true">→</b></Link>)}
            </div>
          </div>
        </section>

        <section className="section directory-featured-section" aria-labelledby="featured-resource-heading">
          <div className="container">
            <div className="section-split-heading"><SectionHeading eyebrow="Featured demonstration listings" id="featured-resource-heading" title="A few places to begin." description="These sample entries show the level of clarity we want every future listing to offer." /><Link className="button button-secondary" href="/resources/results?location=41011">Browse all resources <span aria-hidden="true">→</span></Link></div>
            <div className="featured-resource-grid">{featured.map((resource) => <ResourceResultCard resource={resource} key={resource.id} />)}</div>
          </div>
        </section>

        <section className="directory-review-section">
          <div className="container review-grid">
            <div><p className="eyebrow">How this directory will work</p><h2>Clear enough to use. Careful enough to trust.</h2></div>
            <div><p>Future entries will be reviewed for contact information, service scope, and community feedback. We will name what is known, what is uncertain, and when a listing was last checked.</p><p className="demo-inline-note">For now, every resource shown here is clearly marked demonstration data—not a verified provider directory.</p></div>
          </div>
        </section>

        <section className="directory-submit-callout" id="submit-resource">
          <div className="container"><p className="eyebrow">Help make this more useful</p><h2>Know a resource that belongs here?</h2><p>When submissions open, families, returning citizens, and providers will be able to suggest a resource or flag an update. Good information should not stay hidden.</p><a className="button button-primary" href="#resource-submission-note">Submit or correct a resource <span aria-hidden="true">→</span></a><p className="submission-note" id="resource-submission-note">Resource submissions are not connected in this first frontend-only version.</p></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
