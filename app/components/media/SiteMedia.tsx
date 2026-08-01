import type { SiteMediaKey } from "../../data/media";
import { resolveSiteMedia } from "../../data/media";
import { MediaCredit } from "./MediaCredit";
import { MediaFallback } from "./MediaFallback";
import { MediaImage } from "./MediaImage";
import { MediaOverlay } from "./MediaOverlay";

type SiteMediaProps = {
  mediaKey: SiteMediaKey;
  className?: string;
  sizes: string;
  priority?: boolean;
  reserveSpaceWhenEmpty?: boolean;
  showCredit?: boolean;
};

/** Resolves one stable media key through the current source-controlled provider. */
export function SiteMedia({ mediaKey, className = "", sizes, priority = false, reserveSpaceWhenEmpty = false, showCredit = false }: SiteMediaProps) {
  const media = resolveSiteMedia(mediaKey);
  const hasImage = Boolean(media.imagePath);

  if (!hasImage && !reserveSpaceWhenEmpty) return null;

  return <div className={`site-media ${hasImage ? "has-image" : "is-fallback-surface"} ${className}`} data-media-key={mediaKey} data-media-source={media.source} data-show-on-mobile={media.showOnMobile}>
    {hasImage ? <MediaImage media={media} sizes={sizes} priority={priority} /> : <MediaFallback />}
    {hasImage ? <MediaOverlay overlay={media.overlay} /> : null}
    {hasImage && showCredit ? <MediaCredit attribution={media.attribution} /> : null}
  </div>;
}
