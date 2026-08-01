/* eslint-disable @next/next/no-img-element */

import type { MediaPosition, ResolvedSiteMedia } from "../../data/media";
import { mediaObjectPosition } from "../../data/media";
import { MediaFallback } from "./MediaFallback";

type MediaPositionPreviewProps = {
  media: ResolvedSiteMedia;
  position?: MediaPosition;
  label: string;
};

/** A read-only crop reference used by the disabled media desk until persistence is connected. */
export function MediaPositionPreview({ media, position = media.objectPositionDesktop, label }: MediaPositionPreviewProps) {
  return <figure className="media-position-preview">
    <div className="media-position-preview-image">
      {media.imagePath ? <img src={media.imagePath} alt="" style={{ objectPosition: mediaObjectPosition(position) }} /> : <MediaFallback />}
      <span className="media-position-marker" style={{ left: `${position.x}%`, top: `${position.y}%` }} aria-hidden="true" />
    </div>
    <figcaption>{label}: {position.x}% across, {position.y}% down.</figcaption>
  </figure>;
}
