import type { ReactNode } from "react";
import type { SiteMediaKey } from "../../data/media";
import { resolveSiteMedia } from "../../data/media";
import { SiteMedia } from "./SiteMedia";

type EditablePageHeroProps = {
  mediaKey?: SiteMediaKey;
  className?: string;
  contentClassName?: string;
  labelledBy: string;
  children: ReactNode;
};

/** Existing page heroes can opt into a media key without changing their copy or layout. */
export function EditablePageHero({ mediaKey, className = "", contentClassName = "", labelledBy, children }: EditablePageHeroProps) {
  const hasImage = mediaKey ? Boolean(resolveSiteMedia(mediaKey).imagePath) : false;

  return <section className={`${className} ${hasImage ? "has-site-media" : ""}`} aria-labelledby={labelledBy} data-media-key={mediaKey}>
    {mediaKey ? <SiteMedia mediaKey={mediaKey} sizes="(max-width: 720px) 100vw, 45vw" priority /> : null}
    <div className={contentClassName}>{children}</div>
  </section>;
}
