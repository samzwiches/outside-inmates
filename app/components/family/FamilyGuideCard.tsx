import Link from "next/link";
import type { FamilyGuideSlug } from "../../data/family";

type FamilyGuideCardProps = { slug: FamilyGuideSlug; kicker: string; title: string; intro: string };

export function FamilyGuideCard({ slug, kicker, title, intro }: FamilyGuideCardProps) {
  return <article className="family-guide-card"><p className="eyebrow">{kicker}</p><h3>{title}</h3><p>{intro}</p><Link href={`/families/${slug}`}>Read the guide <span aria-hidden="true">→</span></Link></article>;
}
