"use client";

import type { ResolvedSiteMedia } from "../../data/media";
import { mediaObjectPosition } from "../../data/media";

type MediaImageProps = {
  media: ResolvedSiteMedia;
  sizes: string;
  priority?: boolean;
};

/** Uses plain responsive images so short-lived Supabase signed URLs remain supported. */
export function MediaImage({ media, sizes, priority = false }: MediaImageProps) {
  if (!media.imagePath) return null;
  const assignment = media.assignment;
  const desktopPosition = assignment?.objectPositionDesktop ?? media.objectPositionDesktop;
  const mobilePosition = assignment?.objectPositionMobile ?? media.objectPositionMobile;
  const alt = assignment?.alt ?? media.alt;
  const showOnMobile = assignment?.showOnMobile ?? media.showOnMobile;

  function markLoadFailure(event: React.SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.closest(".site-media")?.classList.add("media-load-failed");
  }

  function markLoaded(event: React.SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.closest(".site-media")?.classList.remove("media-load-failed");
  }

  return (
    <picture className={showOnMobile ? "media-picture" : "media-picture media-picture-hidden-mobile"}>
      {media.mobileImagePath ? <source media="(max-width: 720px)" srcSet={media.mobileImagePath} /> : null}
      <img
        src={media.imagePath}
        alt={alt}
        sizes={sizes}
        fetchPriority={priority ? "high" : "auto"}
        className="media-image"
        style={{ "--media-object-position": mediaObjectPosition(desktopPosition), "--media-object-position-mobile": mediaObjectPosition(mobilePosition) } as React.CSSProperties}
        onError={markLoadFailure}
        onLoad={markLoaded}
      />
    </picture>
  );
}
