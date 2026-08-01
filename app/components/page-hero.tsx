import { PrimaryButton, SecondaryButton } from "./buttons";
import type { SiteMediaKey } from "../data/media";
import { appearanceStyle } from "../lib/site-appearance";
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
};

export async function PageHero({ variant = "home", eyebrow, title, description, children, mediaKey }: PageHeroProps) {
  if (variant === "page") {
    return <EditablePageHero mediaKey={mediaKey} className="directory-page-hero" contentClassName="container directory-page-hero-inner" labelledBy="directory-hero-heading"><div><p className="eyebrow">{eyebrow}</p><h1 id="directory-hero-heading">{title}</h1><p>{description}</p></div>{children}</EditablePageHero>;
  }

  const homeMediaKey = mediaKey ?? "home.hero";
  const presentation = await getSitePresentation(homeMediaKey);
  const hasHomeMedia = Boolean(presentation.media.imagePath);
  return <section className="hero" aria-labelledby="hero-heading" data-media-key={homeMediaKey} style={appearanceStyle(presentation.appearance)}>
    <div className={`container hero-grid ${hasHomeMedia ? "" : "hero-grid--no-media"}`}>
      <div className="hero-copy"><p className="eyebrow">Resources · community · a steadier way forward</p><h1 className="hero-title" id="hero-heading">Support does not stop at the prison gate.</h1><p className="hero-description">Outside Inmates helps incarcerated people, returning citizens, and their families find resources, answers, and community without judgment or endless searching.</p><div className="hero-actions"><PrimaryButton href="#resources">Find resources <span aria-hidden="true">→</span></PrimaryButton><SecondaryButton href="#community">Join the community</SecondaryButton></div><a className="quiet-link" href="#ask-an-advocate">or ask for help <span aria-hidden="true">→</span></a></div>
      {hasHomeMedia ? <SiteMedia mediaKey={homeMediaKey} media={presentation.media} sizes="(max-width: 720px) 100vw, (max-width: 1080px) 42vw, 520px" priority showCredit /> : null}
    </div>
  </section>;
}
