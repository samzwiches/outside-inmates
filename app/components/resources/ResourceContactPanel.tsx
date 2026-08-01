import type { ResourceData } from "../../data/resources";

export function ResourceContactPanel({ resource }: { resource: ResourceData }) {
  return (
    <aside className="resource-contact-panel" aria-label={`Contact ${resource.name}`}>
      <p className="eyebrow">Contact information</p>
      <p className="demo-contact-note">Demonstration contact details</p>
      {resource.phone && <a href={`tel:${resource.phone.replace(/[^+\d]/g, "")}`}>Call {resource.phone}</a>}
      {resource.website && <a href={resource.website} target="_blank" rel="noreferrer">Visit sample website <span aria-hidden="true">↗</span></a>}
      {resource.email && <a href={`mailto:${resource.email}`}>Email sample contact</a>}
      <p className="contact-hours"><strong>Hours</strong>{resource.hours}</p>
    </aside>
  );
}
