import { footerLinks, navigation } from "../data/site";
import Link from "next/link";
import { PrimaryButton } from "./buttons";

function BrandLink({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`wordmark brand-link${footer ? " footer-wordmark" : ""}`} href="/" aria-label="Outside Inmates home">
      <img className="brand-mark" src="/outside-inmates-mark.svg" alt="" aria-hidden="true" />
      <span>Outside <em>Inmates</em></span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandLink />
        <nav className="main-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link className={item.emphasis ? "nav-start" : undefined} key={item.label} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="quiet-link" href="/admin" aria-label="Open Outside Inmates administration">Admin</Link>
          <PrimaryButton href="/start/not-sure">Get Help</PrimaryButton>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="container footer-top">
        <div className="footer-intro">
          <BrandLink footer />
          <p>A clearer path through incarceration and reentry—for individuals, families, and the people who stand beside them.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
        </nav>
        <a className="crisis-card" href="https://988lifeline.org/get-help/" target="_blank" rel="noreferrer">
          <span className="eyebrow">Need immediate support?</span>
          <strong>Call or text 988</strong>
          <span>Connect with the 988 Lifeline</span>
        </a>
      </div>
      <div className="container footer-status-note"><p>Outside Inmates is currently being developed as a future charitable organization. Federal tax-exempt status has not yet been granted. <Link href="/transparency">View organizational status.</Link></p></div>
      <div className="container footer-bottom"><span>© 2026 Outside Inmates</span><span>Made with care, built for real life.</span></div>
    </footer>
  );
}
