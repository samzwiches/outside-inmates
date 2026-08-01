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
          <h1 id="hero-heading">Support does not stop at the prison gate.</h1>
          <p className="hero-description">Outside Inmates helps incarcerated people, returning citizens, and their families find resources, answers, and community without judgment or endless searching.</p>
          <div className="hero-actions">
            <PrimaryButton href="#resources">Find resources <span aria-hidden="true">→</span></PrimaryButton>
            <SecondaryButton href="#community">Join the community</SecondaryButton>
          </div>
          <a className="quiet-link" href="#ask-an-advocate">or ask for help <span aria-hidden="true">→</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-sun" />
          <div className="hero-door"><span className="door-dot" /></div>
          <div className="hero-horizon hero-horizon-one" />
          <div className="hero-horizon hero-horizon-two" />
          <div className="hero-path" />
          <p>There is a next step.<br />You do not have to find it alone.</p>
        </div>
      </div>
    </section>
  );
}
