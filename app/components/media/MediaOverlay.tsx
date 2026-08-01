import type { CSSProperties } from "react";
import type { MediaOverlay as MediaOverlayConfig } from "../../data/media";

const toneValues = {
  ink: "24, 36, 43",
  paper: "252, 250, 246",
  bone: "243, 238, 230",
  clay: "166, 95, 77",
  sage: "135, 153, 138",
  storm: "100, 125, 138",
};

function overlayBackground({ direction, strength, tone }: MediaOverlayConfig) {
  const color = toneValues[tone];
  const solid = `rgba(${color}, ${strength})`;
  const clear = `rgba(${color}, 0)`;

  if (direction === "radial") return `radial-gradient(circle at center, ${solid} 0%, ${clear} 74%)`;
  const edge = direction === "left" ? "right" : direction === "right" ? "left" : direction === "top" ? "bottom" : "top";
  return `linear-gradient(to ${edge}, ${solid} 0%, rgba(${color}, ${Math.max(strength * 0.42, 0).toFixed(2)}) 44%, ${clear} 100%)`;
}

export function MediaOverlay({ overlay }: { overlay: MediaOverlayConfig }) {
  if (!overlay.enabled || overlay.strength <= 0) return null;

  const style: CSSProperties = { backgroundImage: overlayBackground(overlay) };
  return <span className="media-overlay" style={style} aria-hidden="true" />;
}
