import { getSiteCards } from "../../lib/site-card-server";
import { SiteCardImage } from "../cards/SiteCardImage";

export async function FamilyJourney({ items }: { items: { stage: string; detail: string }[] }) {
  const cards = await getSiteCards(items.map((_, index) => `families.journey.${String(index + 1).padStart(2, "0")}`));
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));
  return <ol className="family-journey">{items.map((item, index) => {
    const cardKey = `families.journey.${String(index + 1).padStart(2, "0")}`;
    const card = cardsByKey.get(cardKey);
    return <li className={`${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={item.stage}>
      {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} /> : null}
      <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{card?.title ?? item.stage}</h3><p>{card?.description ?? item.detail}</p></div>
    </li>;
  })}</ol>;
}
