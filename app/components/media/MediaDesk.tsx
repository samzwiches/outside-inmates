"use client";

import { useMemo, useState } from "react";
import { siteMediaKeys, resolveSiteMedia } from "../../data/media";
import { MediaPositionPreview } from "./MediaPositionPreview";

function statusLabel(status: string) {
  return status.replaceAll("-", " ");
}

/**
 * Deliberately read-only until an authenticated, persistent provider is added.
 * It proves the registry and control model without presenting a fake admin path.
 */
export function MediaDesk() {
  const [query, setQuery] = useState("");
  const records = useMemo(() => siteMediaKeys.map((key) => resolveSiteMedia(key)).filter((media) => {
    const term = query.trim().toLowerCase();
    return !term || `${media.key} ${media.page} ${media.section}`.toLowerCase().includes(term);
  }), [query]);

  return <main className="media-desk">
    <div className="container media-desk-inner">
      <p className="eyebrow">Local development only</p>
      <h1>Media desk</h1>
      <p className="media-desk-intro">This is a read-only preview of Outside Inmates&apos; typed media registry. Assigning files, changing credits, or saving crop settings is intentionally disabled until administrator authentication and persistent media storage are connected.</p>
      <div className="media-desk-notice" role="status"><strong>Production safeguard:</strong> this route returns a not-found response in production. It is not a public editing surface.</div>

      <label className="media-desk-search" htmlFor="media-key-search">Find a media location
        <input id="media-key-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a key, page, or section" />
      </label>

      <p className="media-desk-count">{records.length} of {siteMediaKeys.length} media locations shown</p>
      <div className="media-desk-grid">
        {records.map((media) => <article className="media-desk-card" key={media.key}>
          <header><div><p className="eyebrow">{media.page}</p><h2>{media.key}</h2><p>{media.section}</p></div><span className={`media-status media-status-${media.status}`}>{statusLabel(media.status)}</span></header>
          <MediaPositionPreview media={media} label="Desktop crop target" />
          <dl className="media-desk-facts">
            <div><dt>Fallback</dt><dd>{media.expectedLocalFilename ?? "No source-controlled fallback selected"}</dd></div>
            <div><dt>Mobile crop</dt><dd>{media.objectPositionMobile.x}% across, {media.objectPositionMobile.y}% down {media.showOnMobile ? "· shown" : "· hidden"}</dd></div>
            <div><dt>Overlay</dt><dd>{media.overlay.enabled ? `${media.overlay.tone}, ${media.overlay.direction}, ${Math.round(media.overlay.strength * 100)}%` : "Off"}</dd></div>
            <div><dt>Attribution</dt><dd>{media.attribution?.creditName ? `${media.attribution.creditName} / ${media.attribution.sourceName}` : "Not set"}</dd></div>
          </dl>
          <fieldset disabled className="media-desk-controls">
            <legend>Saved media controls</legend>
            <label>Image assignment<input type="text" value={media.imagePath ?? media.fallbackPath ?? "No image assigned"} readOnly /></label>
            <label>Alt text<textarea value={media.alt} readOnly rows={2} /></label>
            <label>Credit<input type="text" value={media.attribution?.creditName ?? ""} readOnly /></label>
            <label>Source and license<input type="text" value={media.attribution ? `${media.attribution.sourceName} · ${media.attribution.licenseLabel}` : ""} readOnly /></label>
            <div className="media-desk-control-actions"><button type="button">Assign or replace image</button><button type="button">Restore fallback</button></div>
          </fieldset>
        </article>)}
      </div>
    </div>
  </main>;
}
