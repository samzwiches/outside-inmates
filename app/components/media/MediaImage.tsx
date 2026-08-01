import Image from "next/image";
import type { CSSProperties } from "react";
import type { ResolvedSiteMedia } from "../../data/media";
import { mediaObjectPosition } from "../../data/media";

type MediaImageProps = {
  media: ResolvedSiteMedia;
  sizes: string;
  priority?: boolean;
};

export function MediaImage({ media, sizes, priority = false }: MediaImageProps) {
  if (!media.imagePath) return null;
  const src = media.imagePath;
  const style = {
    "--media-object-position": mediaObjectPosition(media.objectPositionDesktop),
    "--media-object-position-mobile": mediaObjectPosition(media.objectPositionMobile),
  } as CSSProperties;

  return <Image fill src={src} alt={media.alt} sizes={sizes} priority={priority} unoptimized={src.startsWith("http")} className="media-image" style={style} />;
}
