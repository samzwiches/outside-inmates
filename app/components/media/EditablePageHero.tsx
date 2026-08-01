import type { ReactNode } from "react";
import type { SiteMediaKey } from "../../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../../lib/site-appearance";
import { getSitePresentation } from "../../lib/site-media-server";
import { SiteMedia } from "./SiteMedia";

type EditablePageHeroProps = {
  mediaKey?: SiteMediaKey;
  className?: string;
  contentClassName?: string;
  labelledBy: string;
  children: ReactNode;
};

/** Existing page heroes opt into persistent media and limited safe appearance controls. */
export async function EditablePageHero({ mediaKey, className = "", contentClassName = "", labelledBy, children }: EditablePageHeroProps) {
  const presentation = mediaKey ? await getSitePresentation(mediaKey) : null;
  const hasImage = Boolean(presentation?.media.imagePath);
  const hasVisualOverrides = hasMediaVisualOverrides(presentation?.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation?.appearance);
  return <section className={`${className} ${hasImage ? "has-site-media" : ""}`} aria-labelledby={labelledBy} data-media-key={mediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation?.appearance)}>
    {mediaKey && presentation ? <SiteMedia mediaKey={mediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, 45vw" priority showOverlay={!hasVisualOverrides} /> : null}
    <div className={contentClassName}>{children}</div>
  </section>;
}
