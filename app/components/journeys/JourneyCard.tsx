import Link from "next/link";
import type { JourneyData } from "../../data/journeys";
import type { SiteMediaKey } from "../../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../../lib/site-appearance";
import { getSiteCard } from "../../lib/site-card-server";
import { getSitePresentation } from "../../lib/site-media-server";
import { SiteCardImage } from "../cards/SiteCardImage";
import { SiteMedia } from "../media/SiteMedia";

export async function JourneyCard({ journey, number, compact = false, mediaKey, imageEnabled = true }: { journey: JourneyData; number: number; compact?: boolean; mediaKey?: SiteMediaKey; imageEnabled?: boolean }) {
  const [presentation, card] = await Promise.all([
    mediaKey ? getSitePresentation(mediaKey) : Promise.resolve(null),
    getSiteCard(`journey.${journey.slug}`),
  ]);
  const hasCardImage = imageEnabled && Boolean(card?.imageUrl);
  const hasSharedMedia = imageEnabled && !hasCardImage && Boolean(presentation?.media.imagePath);
  const hasMedia = hasCardImage || hasSharedMedia;
  const hasVisualOverrides = hasMediaVisualOverrides(presentation?.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation?.appearance);
  const title = card?.title ?? journey.cardTitle;
  const description = card?.description ?? journey.shortDescription;
  const primaryHref = card?.href ?? `/start/${journey.slug}`;
  const primaryLabel = card?.actionLabel ?? "Open this path";

  return <article className={`journey-card ${compact ? "is-compact" : ""} ${hasMedia ? "has-site-media" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={`journey.${journey.slug}`} data-media-key={mediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation?.appearance)}>
    {hasCardImage && card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : mediaKey && presentation && hasSharedMedia ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={!hasVisualOverrides} /> : null}
    <span className="journey-card-marker" aria-hidden="true">{String(number).padStart(2, "0")}</span>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="journey-card-action"><span>Begin with</span><strong>{journey.firstAction}</strong></div>
    <div className="journey-card-links"><Link href={primaryHref}>{primaryLabel} <span aria-hidden="true">→</span></Link>{card?.secondaryHref && card.secondaryActionLabel ? <Link className="journey-card-resource-link" href={card.secondaryHref}>{card.secondaryActionLabel} <span aria-hidden="true">→</span></Link> : null}</div>
  </article>;
}
