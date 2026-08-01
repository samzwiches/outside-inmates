import Link from "next/link";
import type { JourneyData } from "../../data/journeys";
import type { SiteMediaKey } from "../../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../../lib/site-appearance";
import { getSitePresentation } from "../../lib/site-media-server";
import { SiteMedia } from "../media/SiteMedia";

export async function JourneyCard({ journey, number, compact = false, mediaKey, imageEnabled = true }: { journey: JourneyData; number: number; compact?: boolean; mediaKey?: SiteMediaKey; imageEnabled?: boolean }) {
  const presentation = mediaKey ? await getSitePresentation(mediaKey) : null;
  const hasMedia = imageEnabled && Boolean(presentation?.media.imagePath);
  const hasVisualOverrides = hasMediaVisualOverrides(presentation?.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation?.appearance);

  return <article className={`journey-card ${compact ? "is-compact" : ""} ${hasMedia ? "has-site-media" : ""}`} data-media-key={mediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation?.appearance)}>{mediaKey && presentation && hasMedia ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={!hasVisualOverrides} /> : null}<span className="journey-card-marker" aria-hidden="true">{String(number).padStart(2, "0")}</span><h3>{journey.cardTitle}</h3><p>{journey.shortDescription}</p><div className="journey-card-action"><span>Begin with</span><strong>{journey.firstAction}</strong></div><Link href={`/start/${journey.slug}`}>Open this path <span aria-hidden="true">→</span></Link></article>;
}
