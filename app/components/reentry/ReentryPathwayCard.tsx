import Link from "next/link";
import { getSiteCard } from "../../lib/site-card-server";
import { SiteCardImage } from "../cards/SiteCardImage";

export async function ReentryPathwayCard({ title, detail, href, resourceHref, tone, number }: { title: string; detail: string; href: string; resourceHref: string; tone: "clay" | "sage" | "blue"; number: number }) {
  const cardKey = `reentry.pathway.${String(number).padStart(2, "0")}`;
  const card = await getSiteCard(cardKey);
  const resolvedTone = card?.tone ?? tone;
  const guideHref = cardKey === "reentry.pathway.04" ? "/reentry/first-week" : (card?.href ?? href);
  return <article className={`reentry-pathway-card reentry-pathway-${resolvedTone} ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey}>
    {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}
    <span aria-hidden="true">{String(number).padStart(2, "0")}</span>
    <h3>{card?.title ?? title}</h3>
    <p>{card?.description ?? detail}</p>
    <div><Link href={guideHref}>{card?.actionLabel ?? "Explore guide"} <span aria-hidden="true">→</span></Link><Link href={card?.secondaryHref ?? resourceHref}>{card?.secondaryActionLabel ?? "Find resources"} <span aria-hidden="true">→</span></Link></div>
  </article>;
}
