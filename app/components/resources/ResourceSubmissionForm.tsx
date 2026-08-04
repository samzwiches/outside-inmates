"use client";

import { useMemo, useState } from "react";
import { resourceCategoryOptions } from "../../data/resources";

type Status = { kind: "idle" | "saving" | "success" | "error"; message: string };

export function ResourceSubmissionForm() {
  const startedAt = useMemo(() => Date.now(), []);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  async function submit(formData: FormData) {
    setStatus({ kind: "saving", message: "Sending your resource for review…" });

    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/resource-submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, startedAt }),
    }).catch(() => null);

    if (!response) {
      setStatus({ kind: "error", message: "We could not reach the submission service. Please try again." });
      return;
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus({ kind: "error", message: typeof result.error === "string" ? result.error : "We could not save the resource." });
      return;
    }

    setStatus({ kind: "success", message: "Thank you. The resource is now in the review queue." });
  }

  if (status.kind === "success") {
    return <div className="resource-submission-success" role="status">
      <p className="eyebrow">Submission received</p>
      <h2>It is safely in the review queue.</h2>
      <p>Nothing is published automatically. Outside Inmates will verify the contact information, services, eligibility details, and important limitations before the listing appears in the directory.</p>
      <button className="button button-secondary" type="button" onClick={() => setStatus({ kind: "idle", message: "" })}>Submit another resource</button>
    </div>;
  }

  return <form className="resource-submission-form" action={submit}>
    <div className="resource-submission-honeypot" aria-hidden="true">
      <label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
    </div>

    <fieldset>
      <legend>What are you submitting?</legend>
      <div className="resource-form-grid two-columns">
        <label>Submission type<select name="submissionType" defaultValue="new" required><option value="new">A new resource</option><option value="correction">A correction or update</option></select></label>
        <label>Resource or program name<input name="resourceName" maxLength={180} required /></label>
      </div>
      <label>Existing Outside Inmates listing link <span>Only for corrections</span><input name="existingResourceUrl" type="url" placeholder="https://outside-inmates.com/resources/..." /></label>
      <label>Primary category<select name="categorySlug" defaultValue="" required><option value="" disabled>Choose the closest category</option>{resourceCategoryOptions.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select></label>
      <label>What help does this resource provide?<textarea name="description" rows={5} minLength={20} maxLength={4000} required placeholder="Describe the program in plain language, including who it helps and what someone can expect." /></label>
      <div className="resource-form-grid two-columns">
        <label>Services offered<textarea name="services" rows={4} maxLength={4000} /></label>
        <label>Eligibility or restrictions<textarea name="eligibility" rows={4} maxLength={3000} /></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Where and how it serves people</legend>
      <div className="resource-form-grid three-columns">
        <label>Service area<select name="serviceAreaType" defaultValue=""><option value="">Choose one</option><option value="local">Local</option><option value="statewide">Statewide</option><option value="remote-national">Remote or national</option></select></label>
        <label>City<input name="city" maxLength={120} /></label>
        <label>State<input name="state" maxLength={80} /></label>
      </div>
      <div className="resource-form-grid two-columns">
        <label>Street address<input name="address" maxLength={300} /></label>
        <label>ZIP code<input name="zipCode" maxLength={20} /></label>
      </div>
      <label>Counties or areas served<input name="countiesServed" maxLength={1000} /></label>
    </fieldset>

    <fieldset>
      <legend>Public contact information</legend>
      <div className="resource-form-grid two-columns">
        <label>Website<input name="website" type="url" placeholder="https://" /></label>
        <label>Source or verification link<input name="sourceUrl" type="url" placeholder="Official directory, agency page, or provider page" /></label>
        <label>Phone<input name="phone" type="tel" maxLength={80} /></label>
        <label>Public email<input name="email" type="email" maxLength={320} /></label>
      </div>
      <div className="resource-form-grid two-columns">
        <label>Hours<input name="hours" maxLength={1000} /></label>
        <label>Cost or payment information<input name="cost" maxLength={1000} /></label>
      </div>
      <label>How to apply or get started<textarea name="applicationProcess" rows={4} maxLength={3000} /></label>
      <div className="resource-form-grid two-columns">
        <label>Languages available<input name="languages" maxLength={1000} /></label>
        <label>Accessibility information<textarea name="accessibilityNotes" rows={3} maxLength={3000} /></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>How we can follow up</legend>
      <div className="resource-form-grid two-columns">
        <label>Your name<input name="submitterName" maxLength={120} required /></label>
        <label>Your email<input name="submitterEmail" type="email" maxLength={320} required /></label>
      </div>
      <label>Your connection to this resource<input name="submitterRelationship" maxLength={300} placeholder="Provider, participant, family member, community partner, or other" /></label>
      <label>Anything else we should know?<textarea name="additionalNotes" rows={4} maxLength={4000} /></label>
      <label className="resource-submission-consent"><input name="confirmation" type="checkbox" required /> <span>I understand this submission will be reviewed and may be edited, declined, or held for more information before publication.</span></label>
    </fieldset>

    {status.kind !== "idle" ? <p className={`resource-submission-status ${status.kind === "error" ? "is-error" : ""}`} role="status">{status.message}</p> : null}
    <button className="button button-primary" type="submit" disabled={status.kind === "saving"}>{status.kind === "saving" ? "Submitting…" : "Send resource for review"}</button>
  </form>;
}
