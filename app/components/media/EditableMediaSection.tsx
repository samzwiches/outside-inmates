import type { ReactNode } from "react";
import type { SiteMediaKey } from "../../data/media";
import { appearanceStyle, getJourneyAppearanceSettings } from "../../lib/site-appearance";
import { getSitePresentation } from "../../lib/site-media-server";
import { SiteMedia } from "./SiteMedia";

type EditableMediaSectionProps = {
  mediaKey: SiteMediaKey;
  className: string;
  id?: string;
  labelledBy: string;
  children: ReactNode;
};

/** A calm, readable section surface that becomes an editable photo treatment when media is assigned. */
export async function EditableMediaSection({ mediaKey, className, id, labelledBy, children }: EditableMediaSectionProps) {
  const presentation = await getSitePresentation(mediaKey);
  const hasMedia = Boolean(presentation.media.imagePath);
  const journeyAppearance = mediaKey === "home.journeys" ? getJourneyAppearanceSettings(presentation.appearance) : null;

  return (
    <section
      className={`${className} editable-media-section ${hasMedia ? "has-site-media" : ""}`}
      id={id}
      aria-labelledby={labelledBy}
      data-media-key={mediaKey}
      data-journey-overlay-direction={journeyAppearance?.backgroundOverlayDirection}
      data-journey-overlay-distribution={journeyAppearance?.backgroundOverlayDistribution}
      data-journey-card-surface={journeyAppearance?.cardSurfacePreset}
      data-journey-card-text-tone={journeyAppearance?.cardTextTone}
      style={appearanceStyle(presentation.appearance)}
    >
      {hasMedia ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="100vw" showOverlay={mediaKey !== "home.journeys"} /> : null}
      <div className="editable-media-section-content">{children}</div>
    </section>
  );
}
