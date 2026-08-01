import Link from "next/link";
import type { JourneyData } from "../../data/journeys";

export function JourneyCard({ journey, number, compact = false }: { journey: JourneyData; number: number; compact?: boolean }) {
  return <article className={`journey-card ${compact ? "is-compact" : ""}`}><span className="journey-card-marker" aria-hidden="true">{String(number).padStart(2, "0")}</span><h3>{journey.cardTitle}</h3><p>{journey.shortDescription}</p><div className="journey-card-action"><span>Begin with</span><strong>{journey.firstAction}</strong></div><Link href={`/start/${journey.slug}`}>Open this path <span aria-hidden="true">→</span></Link></article>;
}
