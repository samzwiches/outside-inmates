import Link from "next/link";
import type { FamilyGuideSlug } from "../../data/family";
import type { SiteMediaKey } from "../../data/media";
import { getSiteCard } from "../../lib/site-card-server";
import { SiteCardImage } from "../cards/SiteCardImage";
import { SiteMedia } from "../media/SiteMedia";

const guideCardMediaKeys: Record<FamilyGuideSlug, SiteMediaKey> = {
  "just-incarcerated": "families.just-incarcerated",
  "staying-connected": "families.staying-connected",
  children: "families.children",
  visitation: "families.visitation",
  "emotional-support": "families.emotional-support",
};

type FamilyGuideCardProps = {
  slug: FamilyGuideSlug;
  kicker: string;
  title: string;
  intro: string;
  actionLabel?: string;
};

export async function FamilyGuideCard({ slug, kicker, title, intro, actionLabel = "Read the guide" }: FamilyGuideCardProps) {
  const mediaKey = guideCardMediaKeys[slug];
  const cardKey = `families.guide.${slug}`;
  const card = await getSiteCard(cardKey);

  return <article className={`family-guide-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey}>
    {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} className="family-card-media" /> : <SiteMedia mediaKey={mediaKey} className="family-card-media" sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={false} />}
    <div className="family-guide-card-body">
      <p className="eyebrow">{card?.eyebrow ?? kicker}</p>
      <h3>{card?.title ?? title}</h3>
      <p>{card?.description ?? intro}</p>
      <Link href={card?.href ?? `/families/${slug}`}>{card?.actionLabel ?? actionLabel} <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
