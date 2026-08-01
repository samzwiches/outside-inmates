import Link from "next/link";
import type { ReentryGuideData } from "../../data/reentry";

export function ReentryGuideCard({ guide }: { guide: ReentryGuideData }) {
  return <article className="reentry-guide-card"><p className="eyebrow">{guide.kicker}</p><h3>{guide.title}</h3><p>{guide.shortDescription}</p><Link href={`/reentry/${guide.slug}`}>Read guide <span aria-hidden="true">→</span></Link></article>;
}
