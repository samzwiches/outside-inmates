import Link from "next/link";

export function ReentryPathwayCard({ title, detail, href, resourceHref, tone, number }: { title: string; detail: string; href: string; resourceHref: string; tone: "clay" | "sage" | "blue"; number: number }) {
  return <article className={`reentry-pathway-card reentry-pathway-${tone}`}><span aria-hidden="true">{String(number).padStart(2, "0")}</span><h3>{title}</h3><p>{detail}</p><div><Link href={href}>Explore guide <span aria-hidden="true">→</span></Link><Link href={resourceHref}>Find resources <span aria-hidden="true">→</span></Link></div></article>;
}
