import type { ResourceCategorySlug } from "../../data/resources";
import Link from "next/link";
import { getSiteCard } from "../../lib/site-card-server";
import { SiteCardImage } from "../cards/SiteCardImage";

type ResourceCategoryCardProps = { name: string; description: string; slug: ResourceCategorySlug };

export async function ResourceCategoryCard({ name, description, slug }: ResourceCategoryCardProps) {
  const cardKey = `resources.category.${slug}`;
  const card = await getSiteCard(cardKey);
  return (
    <Link className={`directory-category-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} href={card?.href ?? `/resources/results?category=${slug}`} data-card-key={cardKey}>
      {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}
      <span>{card?.title ?? name}</span>
      <small>{card?.description ?? description}</small>
      <b aria-hidden="true">→</b>
    </Link>
  );
}
