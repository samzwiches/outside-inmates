import { PrimaryButton, SecondaryButton } from "./buttons";

type PageHeroProps = {
  variant?: "home" | "page";
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ variant = "home", eyebrow, title, description, children }: PageHeroProps) {
  if (variant === "page") {
    return (
      <section className="directory-page-hero" aria-labelledby="directory-hero-heading">
        <div className="container directory-page-hero-inner">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 id="directory-hero-heading">{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Resources · community · a steadier way forward</p>
          <h1 className="hero-title" id="hero-heading">Support does not stop at the prison gate.</h1>
          <p className="hero-description">Outside Inmates helps incarcerated people, returning citizens, and their families find resources, answers, and community without judgment or endless searching.</p>
          <div className="hero-actions">
            <PrimaryButton href="#resources">Find resources <span aria-hidden="true">→</span></PrimaryButton>
            <SecondaryButton href="#community">Join the community</SecondaryButton>
          </div>
          <a className="quiet-link" href="#ask-an-advocate">or ask for help <span aria-hidden="true">→</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-grid" />
          <div className="hero-field hero-field-one" />
          <div className="hero-field hero-field-two" />
          <div className="hero-field hero-field-three" />
          <div className="hero-note hero-note-primary"><span>Start here</span><strong>One useful step at a time.</strong><i /></div>
          <div className="hero-note hero-note-secondary"><span>Outside Inmates</span><strong>Resources, answers, and community.</strong></div>
          <p>There is a next step.<br />You do not have to find it alone.</p>
        </div>
      </div>
    </section>
  );
}
