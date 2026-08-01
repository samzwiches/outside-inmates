import type { ResolvedSiteMedia, SiteMediaKey } from "../../data/media";
import { getPublicSiteMedia } from "../../lib/site-media-server";
import { MediaCredit } from "./MediaCredit";
import { MediaFallback } from "./MediaFallback";
import { MediaImage } from "./MediaImage";
import { MediaOverlay } from "./MediaOverlay";

type SiteMediaProps = {
  mediaKey: SiteMediaKey;
  media?: ResolvedSiteMedia;
  className?: string;
  sizes: string;
  priority?: boolean;
  reserveSpaceWhenEmpty?: boolean;
  showCredit?: boolean;
  showOverlay?: boolean;
};

/** Public media resolves saved assignment, then source fallback, then the existing text-only surface. */
export async function SiteMedia({ mediaKey, media: suppliedMedia, className = "", sizes, priority = false, reserveSpaceWhenEmpty = false, showCredit = false, showOverlay = true }: SiteMediaProps) {
  const media = suppliedMedia ?? await getPublicSiteMedia(mediaKey);
  const hasImage = Boolean(media.imagePath);
  if (!hasImage && !reserveSpaceWhenEmpty) return null;
  const attribution = media.assignment?.creditName || media.assignment?.sourceName
    ? { creditName: media.assignment.creditName ?? undefined, creditUrl: media.assignment.creditUrl ?? undefined, sourceName: media.assignment.sourceName ?? undefined, sourceUrl: media.assignment.sourceUrl ?? undefined, licenseLabel: media.assignment.licenseLabel ?? undefined }
    : media.attribution;

  return <div className={`site-media ${hasImage ? "has-image" : "is-fallback-surface"} ${className}`} data-media-key={mediaKey} data-media-source={media.source} data-show-on-mobile={media.assignment?.showOnMobile ?? media.showOnMobile}>
    {hasImage ? <MediaImage media={media} sizes={sizes} priority={priority} /> : <MediaFallback />}
    {hasImage && showOverlay ? <MediaOverlay media={media} /> : null}
    {hasImage && showCredit ? <MediaCredit attribution={attribution} /> : null}
  </div>;
}
