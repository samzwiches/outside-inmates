import type { Metadata } from "next";
import Link from "next/link";
import { ResourceSubmissionForm } from "../../components/resources/ResourceSubmissionForm";
import { SiteFooter, SiteHeader } from "../../components/layout";
import { PageHero } from "../../components/page-hero";

export const metadata: Metadata = {
  title: "Submit a Resource | Outside Inmates",
  description: "Suggest a new resource or correction for the Outside Inmates directory review queue.",
};

export default function SubmitResourcePage() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader />
    <main id="main-content" className="resource-submit-page">
      <PageHero
        variant="page"
        mediaKey="resources.submit.hero"
        eyebrow="Submit a resource"
        title="Help someone find the next useful place to call."
        description="Suggest a new program, sober living home, halfway house, legal service, treatment option, family support organization, or correction to an existing listing. Every submission is reviewed before publication."
      >
        <Link className="button button-secondary" href="/resources">Return to the directory <span aria-hidden="true">→</span></Link>
      </PageHero>

      <section className="section resource-submit-intro" aria-labelledby="resource-submit-process-heading">
        <div className="container">
          <div className="resource-submit-process-heading">
            <p className="eyebrow">Before you begin</p>
            <h2 id="resource-submit-process-heading">Useful details beat perfect wording.</h2>
            <p>Share what you know and leave uncertain fields blank. A website, public phone number, official directory page, or provider contact helps us verify the listing.</p>
          </div>
          <div className="resource-submit-process-grid">
            <article><span>01</span><h3>Tell us what it provides.</h3><p>Describe the service, who it serves, and any important restrictions or costs.</p></article>
            <article><span>02</span><h3>Give us a way to verify it.</h3><p>Official websites, public contact details, and service area information make review faster.</p></article>
            <article><span>03</span><h3>We review before publishing.</h3><p>Submissions enter a private queue. They never appear automatically in the public directory.</p></article>
          </div>
        </div>
      </section>

      <section className="resource-submit-form-section" aria-labelledby="resource-submit-form-heading">
        <div className="container resource-submit-form-layout">
          <div className="resource-submit-form-copy">
            <p className="eyebrow">Resource details</p>
            <h2 id="resource-submit-form-heading">What should we review?</h2>
            <p>Please do not include Social Security numbers, case numbers, medical records, passwords, private client information, or documents that identify someone without their permission.</p>
            <div className="resource-submit-note"><strong>Submitting a correction?</strong><p>Choose “A correction or update” and include the current Outside Inmates listing link when possible.</p></div>
          </div>
          <ResourceSubmissionForm />
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
