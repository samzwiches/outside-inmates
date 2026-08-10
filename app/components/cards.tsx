import type { ForumPost, Pathway, Resource } from "../data/site";
import Link from "next/link";
import type { SiteMediaKey } from "../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../lib/site-appearance";
import { getSiteCard } from "../lib/site-card-server";
import { getSitePresentation } from "../lib/site-media-server";
import { SiteCardImage } from "./cards/SiteCardImage";
import { SiteMedia } from "./media/SiteMedia";

const homeResourceSlugs: Record<string, string> = {
  Housing: "housing",
  Employment: "employment",
  Identification: "identification-documents",
  "Legal help": "legal-help",
  "Family support": "family-support",
  "Mental health": "mental-health",
  "Substance use recovery": "substance-use-recovery",
  Transportation: "transportation",
};

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

export async function ResourceCard({ title, description }: Resource) {
  const slug = homeResourceSlugs[title];
  const card = slug ? await getSiteCard(`home.resource.${slug}`) : null;
  return (
    <li><Link className={`resource-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} href={card?.href ?? (slug ? `/resources/results?category=${slug}` : "/resources")} data-card-key={slug ? `home.resource.${slug}` : undefined}>{card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}<span>{card?.title ?? title}</span><small>{card?.description ?? description}</small><b aria-hidden="true">↗</b></Link></li>
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
  const [presentation, card] = await Promise.all([
    mediaKey ? getSitePresentation(mediaKey) : Promise.resolve(null),
    getSiteCard(`home.action.${id}`),
  ]);
  const hasCardImage = Boolean(card?.imageUrl);
  const hasSharedMedia = !hasCardImage && Boolean(presentation?.media.imagePath);
  const hasMedia = hasCardImage || hasSharedMedia;
  const hasVisualOverrides = hasMediaVisualOverrides(presentation?.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation?.appearance);
  const resolvedTheme = card?.tone === "clay" || card?.tone === "sage" ? card.tone : theme;

  return (
    <article className={`action-card action-${resolvedTheme} ${hasMedia ? "has-site-media" : ""} ${hasCardImage ? "has-card-image" : ""}`} id={id} data-card-key={`home.action.${id}`} data-media-key={mediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation?.appearance)}>
      {hasCardImage && card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} className="action-card-custom-media" /> : mediaKey && presentation && hasSharedMedia ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, 50vw" showOverlay={!hasVisualOverrides} /> : null}
      <div className="action-content">
        <p className="eyebrow">{card?.eyebrow ?? eyebrow}</p>
        <h2>{card?.title ?? title}</h2>
        <p>{card?.description ?? description}</p>
        <Link href={card?.href ?? href}>{card?.actionLabel ?? action} <span aria-hidden="true">→</span></Link>
      </div>
      {!hasMedia ? <div className={`action-visual visual-${visual}`} aria-hidden="true"><span /><i /><b /></div> : null}
    </article>
  );
}
