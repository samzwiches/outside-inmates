import Link from "next/link";
import type { ReentryGuideData, ReentrySlug } from "../../data/reentry";
import type { SiteMediaKey } from "../../data/media";
import { getSiteCard } from "../../lib/site-card-server";
import { SiteCardImage } from "../cards/SiteCardImage";
import { SiteMedia } from "../media/SiteMedia";

const reentryGuideMediaKeys: Record<ReentrySlug, SiteMediaKey> = {
  "first-week": "reentry.first-week",
  documents: "reentry.documents",
  housing: "reentry.housing",
  employment: "reentry.employment",
  health: "reentry.health",
  supervision: "reentry.supervision",
  transportation: "reentry.transportation",
  "family-transition": "reentry.family-transition",
};

export async function ReentryGuideCard({ guide }: { guide: ReentryGuideData }) {
  const cardKey = `reentry.guide.${guide.slug}`;
  const card = await getSiteCard(cardKey);
  const mediaKey = reentryGuideMediaKeys[guide.slug];
  return <article className={`reentry-guide-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey}>
    {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : <SiteMedia mediaKey={mediaKey} className="reentry-card-media" sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={false} />}
    <div className="reentry-guide-card-body"><p className="eyebrow">{card?.eyebrow ?? guide.kicker}</p><h3>{card?.title ?? guide.title}</h3><p>{card?.description ?? guide.shortDescription}</p><Link href={card?.href ?? `/reentry/${guide.slug}`}>{card?.actionLabel ?? "Read guide"} <span aria-hidden="true">→</span></Link></div>
  </article>;
}
