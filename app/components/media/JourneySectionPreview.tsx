/* eslint-disable @next/next/no-img-element */

"use client";

import type { CSSProperties } from "react";
import { journeys, type JourneySlug } from "../../data/journeys";

export type JourneyPreviewImage = {
  source: string | null;
  focalX: string;
  focalY: string;
  mobileFocalX: string;
  mobileFocalY: string;
  overlayColor: string;
  overlayOpacity: string;
};

export type JourneyPreviewSettings = {
  backgroundImageFit: "cover" | "contain";
  backgroundImageZoom: string;
  backgroundOverlayEnabled: boolean;
  backgroundOverlayColor: string;
  backgroundOverlayOpacity: string;
  backgroundOverlayDirection: string;
  cardSurface: string;
  cardSurfaceOpacity: string;
  cardBorderColor: string;
  cardBorderOpacity: string;
  cardShadow: string;
  cardBackdropBlur: string;
  cardTextTone: string;
  cardImageEnabled: boolean;
};

type JourneySectionPreviewProps = {
  background: JourneyPreviewImage;
  cards: Partial<Record<JourneySlug, JourneyPreviewImage>>;
  settings: JourneyPreviewSettings;
};

function rgbaFromHex(color: string, opacity: string) {
  const normalized = color.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return `rgb(24 36 43 / ${opacity})`;
  const value = Number.parseInt(normalized, 16);
  return `rgb(${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255} / ${opacity})`;
}

function previewOverlay(direction: string, color: string, opacity: string) {
  const soft = rgbaFromHex(color, String(Math.max(Number(opacity) * 0.68, 0)));
  const full = rgbaFromHex(color, opacity);
  if (direction === "top-to-bottom") return `linear-gradient(to bottom, ${full}, ${soft} 52%, transparent)`;
  if (direction === "bottom-to-top") return `linear-gradient(to top, ${full}, ${soft} 52%, transparent)`;
  if (direction === "left-to-right") return `linear-gradient(to right, ${full}, ${soft} 56%, transparent)`;
  if (direction === "right-to-left") return `linear-gradient(to left, ${full}, ${soft} 56%, transparent)`;
  if (direction === "center-vignette") return `radial-gradient(ellipse at center, transparent, ${soft} 58%, ${full})`;
  if (direction === "heading-focus") return `radial-gradient(120% 95% at 10% 0%, ${full}, ${soft} 47%, transparent)`;
  return full;
}

function cardSurface(settings: JourneyPreviewSettings) {
  const colors: Record<string, string> = {
    paper: "#fcfaf6",
    "warm-paper": "#fbf8f4",
    cream: "#f3eee6",
    "translucent-light": "#fcfaf6",
    "translucent-dark": "#18242b",
  };
  return rgbaFromHex(colors[settings.cardSurface] ?? colors["warm-paper"], settings.cardSurfaceOpacity);
}

function borderColor(settings: JourneyPreviewSettings) {
  const colors: Record<string, string> = { "soft-ink": "#18242b", paper: "#fcfaf6", clay: "#a65f4d", sage: "#87998a", storm: "#647d8a" };
  return rgbaFromHex(colors[settings.cardBorderColor] ?? colors["soft-ink"], settings.cardBorderOpacity);
}

export function JourneySectionPreview({ background, cards, settings }: JourneySectionPreviewProps) {
  const cardTextIsPaper = settings.cardTextTone === "paper" || (settings.cardTextTone === "auto" && settings.cardSurface === "translucent-dark");
  const style = {
    "--journey-preview-surface": cardSurface(settings),
    "--journey-preview-border": borderColor(settings),
    "--journey-preview-shadow": settings.cardShadow === "none" ? "none" : settings.cardShadow === "medium" ? "5px 6px 0 rgb(24 36 43 / .16)" : "3px 4px 0 rgb(24 36 43 / .1)",
    "--journey-preview-backdrop": settings.cardBackdropBlur === "medium" ? "blur(7px)" : settings.cardBackdropBlur === "subtle" ? "blur(3px)" : "none",
  } as CSSProperties;

  return <section className="journey-section-preview" aria-label="Guided pathways preview" style={style}>
    <div className="journey-section-preview-heading"><p>Live layout preview</p><span>Desktop and mobile</span></div>
    <div className="journey-section-preview-frames">
      {[{ label: "Desktop", mobile: false }, { label: "Mobile", mobile: true }].map(({ label, mobile }) => <figure className={`journey-section-preview-frame ${mobile ? "is-mobile" : ""}`} key={label}>
        <div className="journey-section-preview-surface">
          {background.source ? <img className="journey-section-preview-background" src={background.source} alt="" style={{ objectFit: settings.backgroundImageFit, objectPosition: `${mobile ? background.mobileFocalX : background.focalX}% ${mobile ? background.mobileFocalY : background.focalY}%`, transform: `scale(${Number(settings.backgroundImageZoom) / 100 || 1})` }} /> : <span className="journey-section-preview-empty">Current text-first section</span>}
          {settings.backgroundOverlayEnabled ? <span className="journey-section-preview-overlay" style={{ background: previewOverlay(settings.backgroundOverlayDirection, settings.backgroundOverlayColor, settings.backgroundOverlayOpacity) }} /> : null}
          <div className="journey-section-preview-content">
            <p className="journey-section-preview-eyebrow">Guided pathways</p>
            <h3>Where are you today?</h3>
            <p>You do not need the right words or a complete plan. Begin with the situation that feels closest to yours.</p>
            <div className="journey-section-preview-grid">
              {journeys.map((journey) => {
                const image = cards[journey.slug];
                const hasCardImage = settings.cardImageEnabled && Boolean(image?.source);
                return <article className={`journey-section-preview-card ${hasCardImage ? "has-image" : ""} ${cardTextIsPaper ? "has-paper-text" : ""}`} key={journey.slug}>
                  {hasCardImage ? <><img src={image!.source!} alt="" style={{ objectPosition: `${mobile ? image!.mobileFocalX : image!.focalX}% ${mobile ? image!.mobileFocalY : image!.focalY}%` }} /><span style={{ background: rgbaFromHex(image!.overlayColor, image!.overlayOpacity) }} /></> : null}
                  <b>{journey.cardTitle}</b>
                  <small>{journey.shortDescription}</small>
                </article>;
              })}
            </div>
          </div>
        </div>
        <figcaption>{label} preview</figcaption>
      </figure>)}
    </div>
  </section>;
}
