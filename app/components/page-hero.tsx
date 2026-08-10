import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "./buttons";
import type { SiteMediaKey } from "../data/media";
import { appearanceStyle, getJourneyAppearanceSettings, hasMediaVisualOverrides } from "../lib/site-appearance";
import { getSitePresentation } from "../lib/site-media-server";
import { EditablePageHero } from "./media/EditablePageHero";
import { SiteMedia } from "./media/SiteMedia";

type PageHeroProps = {
  variant?: "home" | "page";
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  mediaKey?: SiteMediaKey;
  breadcrumbLabel?: string;
  showBreadcrumbs?: boolean;
};

export async function PageHero({
  variant = "home",
  eyebrow,
  title,
  description,
  children,
  mediaKey,
  breadcrumbLabel,
  showBreadcrumbs = true,
}: PageHeroProps) {
  if (variant === "page") {
    const currentBreadcrumb = breadcrumbLabel ?? eyebrow ?? title;

    return (
      <EditablePageHero
        mediaKey={mediaKey}
        className="directory-page-hero"
        contentClassName="container directory-page-hero-inner"
        labelledBy="directory-hero-heading"
      >
        <div className="page-hero-copy">
          {showBreadcrumbs && currentBreadcrumb ? (
            <nav className="breadcrumbs page-hero-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>{currentBreadcrumb}</span>
            </nav>
          ) : null}
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="directory-hero-heading">{title}</h1>
          <p>{description}</p>
        </div>
        {children ? <div className="page-hero-action-area">{children}</div> : null}
      </EditablePageHero>
    );
  }

  const homeMediaKey = mediaKey ?? "home.hero";
  const presentation = await getSitePresentation(homeMediaKey);
  const hasHomeMedia = Boolean(presentation.media.imagePath);
  const hasVisualOverrides = hasMediaVisualOverrides(presentation.appearance);
  const visualSettings = getJourneyAppearanceSettings(presentation.appearance);
  return <section className="hero" aria-labelledby="hero-heading" data-media-key={homeMediaKey} data-media-visual-controls={hasVisualOverrides ? "true" : undefined} data-media-overlay-direction={hasVisualOverrides ? visualSettings.backgroundOverlayDirection : undefined} data-media-overlay-distribution={hasVisualOverrides ? visualSettings.backgroundOverlayDistribution : undefined} style={appearanceStyle(presentation.appearance)}>
    <div className={`container hero-grid ${hasHomeMedia ? "" : "hero-grid--no-media"}`}>
      <div className="hero-copy"><p className="eyebrow">Resources · community · a steadier way forward</p><h1 className="hero-title" id="hero-heading">Support does not stop at the prison gate.</h1><p className="hero-description">Outside Inmates helps incarcerated people, returning citizens, and their families find resources, answers, and community without judgment or endless searching.</p><div className="hero-actions"><PrimaryButton href="#resources">Find resources <span aria-hidden="true">→</span></PrimaryButton><SecondaryButton href="/community">Join the community</SecondaryButton></div><a className="quiet-link" href="/start/not-sure">or ask for help <span aria-hidden="true">→</span></a></div>
      {hasHomeMedia ? <SiteMedia mediaKey={homeMediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, (max-width: 1080px) 42vw, 520px" priority showCredit showOverlay={!hasVisualOverrides} /> : null}
    </div>
  </section>;
}
