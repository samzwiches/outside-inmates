import { footerLinks, navigation } from "../data/site";
import { PrimaryButton } from "./buttons";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href="#main-content" aria-label="Outside Inmates home">Outside <em>Inmates</em></a>
        <nav className="main-nav" aria-label="Primary navigation">
          {navigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="sign-in" type="button" disabled title="Sign in is not available yet">Sign In</button>
          <PrimaryButton href="#ask-an-advocate">Get Help</PrimaryButton>
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
          <a className="wordmark footer-wordmark" href="#main-content">Outside <em>Inmates</em></a>
          <p>A clearer path through incarceration and reentry—for individuals, families, and the people who stand beside them.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => <a href="#site-footer" key={link}>{link}</a>)}
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
