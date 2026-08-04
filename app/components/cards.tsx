import type { ForumPost, Pathway, Resource } from "../data/site";
import Link from "next/link";
import type { SiteMediaKey } from "../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../lib/site-appearance";
import { getSitePresentation } from "../lib/site-media-server";
import { SiteMedia } from "./media/SiteMedia";

export function PathwayCard({ title, detail, accent, number }: Pathway & { number: number }) {
  return (
    <a className={`pathway-card pathway-${accent}`} href="#resources">
      <span className="pathway-number" aria-hidden="true">{String(number).padStart(2, "0")}</span>
      <span className="pathway-title">{title}</span>
      <span className="pathway-detail">{detail}</span>
      <span className="pathway-arrow" aria-hidden="true">→</span>
    </a>
  );
}

export function ResourceCard({ title, description }: Resource) {
  return (
    <li><Link className="resource-card" href="/resources"><span>{title}</span><small>{description}</small><b aria-hidden="true">↗</b></Link></li>
  );
}

export function ForumPreviewCard({ title, category, replies, time, href = "/community" }: ForumPost) {
  return (
    <article className="forum-card">
      <p className="forum-category">{category}</p>
      <h3><Link href={href}>{title}</Link></h3>
      <footer><span>{replies} replies</span><span>{time}</span></footer>
    </article>
  );
}

type ActionCardProps = { id: string; eyebrow: string; title: string; description: string; action: string; href: string; theme: "clay" | "sage"; visual: "family" | "reentry"; mediaKey?: SiteMediaKey };

export async function ActionCard({ id, eyebrow, title, description, action, href, theme, visual, mediaKey }: ActionCardProps) {
  const presentation = mediaKey ? await getSitePresentation(mediaKey) : null;
  const hasMedia = Boolean(presentation?.media.imagePath);
  const hasVisualOverrides = hasMediaVisualOverrides(presentation?.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation?.appearance);

  return (
    <article className={`action-card action-${theme} ${hasMedia ? "has-site-media" : ""}`} id={id} data-media-key={mediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation?.appearance)}>
      {mediaKey && presentation && hasMedia ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, 50vw" showOverlay={!hasVisualOverrides} /> : null}
      <div className="action-content">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href={href}>{action} <span aria-hidden="true">→</span></Link>
      </div>
      {!hasMedia ? <div className={`action-visual visual-${visual}`} aria-hidden="true"><span /><i /><b /></div> : null}
    </article>
  );
}
