import Link from "next/link";
import type { SiteMediaKey } from "../../data/media";
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
  const mediaKey = mediaKeyForHref(href);

  return <Link href={href} className={`family-pathway-card family-pathway-${tone}`}>
    {mediaKey ? <SiteMedia mediaKey={mediaKey} className="family-card-media" sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={false} /> : null}
    <div className="family-pathway-card-body">
      <span className="family-pathway-number">{String(number).padStart(2, "0")}</span>
      <strong>{title}</strong>
      <small>{description}</small>
      <b aria-hidden="true">→</b>
    </div>
  </Link>;
}
