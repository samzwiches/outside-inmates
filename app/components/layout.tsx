import { footerLinks, navigation } from "../data/site";
import Link from "next/link";
import { PrimaryButton } from "./buttons";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link>
        <nav className="main-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link className={item.emphasis ? "nav-start" : undefined} key={item.label} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="sign-in" href="/sign-in">Sign In</Link>
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
          <Link className="wordmark footer-wordmark" href="/">Outside <em>Inmates</em></Link>
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
      <div className="container footer-bottom"><span>© 2026 Outside Inmates</span><span>Made with care, built for real life.</span></div>
    </footer>
  );
}
