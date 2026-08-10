import Link from "next/link";
import type { FamilyGuideSlug } from "../../data/family";
import type { SiteMediaKey } from "../../data/media";
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

  return <article className="family-guide-card">
    <SiteMedia mediaKey={mediaKey} className="family-card-media" sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" showOverlay={false} />
    <div className="family-guide-card-body">
      <p className="eyebrow">{kicker}</p>
      <h3>{title}</h3>
      <p>{intro}</p>
      <Link href={`/families/${slug}`}>{actionLabel} <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
