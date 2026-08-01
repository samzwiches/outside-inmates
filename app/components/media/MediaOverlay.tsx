import type { CSSProperties } from "react";
import type { ResolvedSiteMedia } from "../../data/media";

const overlayColors = {
  none: "transparent",
  light: "#fcfaf6",
  dark: "#18242b",
  cream: "#f3eee6",
  brand: "#647d8a",
};

export function MediaOverlay({ media }: { media: ResolvedSiteMedia }) {
  const assignment = media.assignment;
  const tone = assignment?.overlayTone ?? media.overlayTone;
  const opacity = assignment?.overlayOpacity ?? media.overlayOpacity;
  const customColor = assignment?.overlayColor;
  if (!opacity || (tone === "none" && !customColor)) return null;
  const style = { backgroundColor: customColor ?? overlayColors[tone], opacity } as CSSProperties;
  return <span className="media-overlay" style={style} aria-hidden="true" />;
}
