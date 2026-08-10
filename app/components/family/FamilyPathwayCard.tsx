import Link from "next/link";
import type { SiteMediaKey } from "../../data/media";
import { getSiteCard } from "../../lib/site-card-server";
import { SiteCardImage } from "../cards/SiteCardImage";
import { SiteMedia } from "../media/SiteMedia";

type FamilyPathwayCardProps = { title: string; description: string; href: string; tone: "clay" | "sage" | "blue"; number: number };

function mediaKeyForHref(href: string): SiteMediaKey | null {
  if (href.startsWith("/families/just-incarcerated")) return "families.just-incarcerated";
  if (href.startsWith("/families/staying-connected")) return "families.staying-connected";
  if (href.startsWith("/families/children")) return "families.children";
  if (href.startsWith("/families/visitation")) return "families.visitation";
  if (href.startsWith("/families/emotional-support")) return "families.emotional-support";
  return null;
}

export async function FamilyPathwayCard({ title, description, href, tone, number }: FamilyPathwayCardProps) {
  const cardKey = `families.pathway.${String(number).padStart(2, "0")}`;
  const card = await getSiteCard(cardKey);
  const resolvedHref = card?.href ?? href;
  const resolvedTone = card?.tone ?? tone;
  const mediaKey = mediaKeyForHref(resolvedHref);

  return <Link href={resolvedHref} className={`family-pathway-card family-pathway-${resolvedTone} ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey}>
    {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} className="family-card-media" /> : mediaKey ? <SiteMedia mediaKey={mediaKey} className="family-card-media" sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={false} /> : null}
    <div className="family-pathway-card-body">
      <span className="family-pathway-number">{String(number).padStart(2, "0")}</span>
      <strong>{card?.title ?? title}</strong>
      <small>{card?.description ?? description}</small>
      <b aria-hidden="true">→</b>
    </div>
  </Link>;
}
