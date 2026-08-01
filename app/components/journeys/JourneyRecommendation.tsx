import Link from "next/link";

export type JourneyRecommendationData = { title: string; body: string; href: string; action: string; links: { label: string; href: string }[] };

export function JourneyRecommendation({ recommendation }: { recommendation: JourneyRecommendationData }) {
  return <section className="journey-recommendation" aria-live="polite" aria-labelledby="journey-recommendation-title"><p className="eyebrow">A possible place to begin</p><h2 id="journey-recommendation-title">{recommendation.title}</h2><p>{recommendation.body}</p><Link className="button button-primary" href={recommendation.href}>{recommendation.action} <span aria-hidden="true">→</span></Link><div><p>Other useful links</p><ul>{recommendation.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label} <span aria-hidden="true">→</span></Link></li>)}</ul></div></section>;
}
