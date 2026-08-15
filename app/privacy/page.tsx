import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";

export const metadata: Metadata = {
  title: "Privacy | Outside Inmates",
  description: "How Outside Inmates handles information, protects privacy, and limits collection while people search for help.",
};

const privacyPrinciples = [
  {
    number: "01",
    title: "We collect less on purpose.",
    body: "You do not have to tell us why you are here, who in your life is incarcerated, or explain your situation just to use the information on this site.",
  },
  {
    number: "02",
    title: "We do not sell your personal information.",
    body: "Outside Inmates does not sell personal information or provide it to advertisers so they can build targeted advertising profiles about you.",
  },
  {
    number: "03",
    title: "You do not owe us your story.",
    body: "Looking for information about arrest, incarceration, courts, visitation, reentry, family support, or recovery does not require you to disclose your relationship to an incarcerated person.",
  },
] as const;

const policySections = [
  {
    title: "Information you choose to provide",
    paragraphs: [
      "You may choose to provide information when you contact us, send feedback, suggest or correct a resource, report outdated information, submit a form, or communicate with us directly.",
      "Depending on what you submit, this may include your name, email address, message, organization, or other information you voluntarily provide.",
    ],
  },
  {
    title: "Information collected automatically",
    paragraphs: [
      "Like most websites, some technical information may be processed automatically when you visit Outside Inmates. This may include IP address, browser type, device type, operating system, pages visited, approximate location based on IP address, date and time of access, referring page, and basic security or diagnostic information.",
      "Our hosting, security, and infrastructure providers may process limited technical information as necessary to deliver the website, prevent abuse, diagnose problems, and maintain security.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: [
      "Information may be used to operate and maintain Outside Inmates, respond to questions, review resource suggestions and corrections, improve accessibility and usefulness, identify technical problems, protect the site from spam or abuse, and understand in general terms which information visitors find useful.",
      "We try to collect as little personal information as reasonably possible for those purposes.",
    ],
  },
  {
    title: "Cookies and similar technology",
    paragraphs: [
      "Outside Inmates may use cookies or similar technology when necessary for basic website functionality, security, preferences, or site performance.",
      "We do not use cookies for behavioral advertising. If our use of cookies, analytics, or similar technology materially changes, this policy will be updated to explain those changes.",
    ],
  },
  {
    title: "Service providers",
    paragraphs: [
      "We may use trusted service providers to host, secure, maintain, or operate parts of Outside Inmates. Those providers may process limited information on our behalf as part of providing those services.",
      "We do not authorize service providers to use information we provide to them for unrelated advertising purposes.",
    ],
  },
  {
    title: "Links to other websites",
    paragraphs: [
      "Outside Inmates links to courts, correctional agencies, government offices, nonprofits, service providers, community organizations, and other outside resources. When you leave Outside Inmates, the privacy practices of the website you visit apply.",
      "This is especially important when following links to government databases, inmate searches, court records, payment systems, communication providers, or other services that may request personal information.",
    ],
  },
  {
    title: "Public records and outside information",
    paragraphs: [
      "Some information available through Outside Inmates may come from publicly available government, court, correctional, nonprofit, or community sources. Outside Inmates does not create the underlying government or public records displayed or linked through those sources.",
      "If you believe information on Outside Inmates is incorrect or outdated, please use the resource correction process so it can be reviewed.",
    ],
  },
  {
    title: "Children and families",
    paragraphs: [
      "Outside Inmates provides information that may be useful to parents, caregivers, and families with children affected by incarceration. The website is not designed to knowingly collect personal information directly from children under 13.",
      "Children should not submit personal information through the site without the involvement of a parent, guardian, or trusted adult.",
    ],
  },
  {
    title: "Data retention",
    paragraphs: [
      "We keep personal information only for as long as reasonably necessary for the purpose for which it was collected, to maintain appropriate records, resolve problems, protect the site, or comply with applicable legal obligations.",
      "Information that is no longer reasonably needed may be deleted or anonymized.",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We use reasonable technical and organizational measures intended to protect information handled through Outside Inmates. No website, email system, database, or internet transmission can be guaranteed to be completely secure.",
      "For that reason, please avoid sending highly sensitive information through ordinary website forms or email.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "You may contact us to ask about personal information you previously submitted directly to Outside Inmates or to request that it be corrected or deleted when reasonably possible.",
      "Some information may need to be retained when required for security, recordkeeping, legal, or operational reasons.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="privacy-page">
    <PageHero variant="page" mediaKey="privacy.hero" eyebrow="Privacy" title="Looking for help should not cost you your privacy." description="Outside Inmates is built for people navigating complicated systems. We collect only what we reasonably need to operate the site, and we want you to understand what happens with information you choose to share." />

    <section className="section privacy-intro" aria-labelledby="privacy-principles-heading"><div className="container"><div className="privacy-section-lede"><p className="eyebrow">The short version</p><h2 id="privacy-principles-heading">Three promises worth putting in plain English.</h2><p>This page explains the details below, but these principles guide how Outside Inmates approaches privacy.</p></div><div className="privacy-principles">{privacyPrinciples.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

    <section className="privacy-sensitive-note" aria-labelledby="privacy-sensitive-heading"><div className="container"><div><p className="eyebrow">Before you send anything</p><h2 id="privacy-sensitive-heading">Keep highly sensitive information out of ordinary forms and messages.</h2></div><div><p>Please do not submit Social Security numbers, financial account information, passwords, medical records, full criminal case files, identification documents, verification codes, or other highly sensitive personal information unless Outside Inmates specifically requests it through an appropriate secure process.</p><p>If a name, address, case number, or other identifying detail is not necessary to explain the issue, leave it out.</p></div></div></section>

    <section className="section privacy-policy" aria-labelledby="privacy-details-heading"><div className="container privacy-policy-layout"><aside><p className="eyebrow">Privacy policy</p><h2 id="privacy-details-heading">What happens with information.</h2><p>Last updated August 14, 2026.</p></aside><div className="privacy-policy-sections">{policySections.map((section, index) => <article key={section.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}</div></div></section>

    <section className="section privacy-change-section" aria-labelledby="privacy-changes-heading"><div className="container privacy-change-layout"><div><p className="eyebrow">As the site grows</p><h2 id="privacy-changes-heading">If the privacy practices change, this page changes too.</h2></div><div><p>Outside Inmates will continue to grow, and the way the website operates may change with it. If our privacy practices materially change, we will update this page and revise the last updated date.</p><p>Questions, concerns, or requests about information you submitted directly to Outside Inmates can be sent through the contact page. You do not need to explain your relationship to an incarcerated person in order to ask a privacy question.</p><div className="privacy-actions"><Link className="button button-primary" href="/contact">Contact Outside Inmates <span aria-hidden="true">→</span></Link><Link href="/transparency">See our transparency page <span aria-hidden="true">→</span></Link></div></div></div></section>
  </main><SiteFooter /></>;
}
