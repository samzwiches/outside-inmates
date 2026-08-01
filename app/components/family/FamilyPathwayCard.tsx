import Link from "next/link";

type FamilyPathwayCardProps = { title: string; description: string; href: string; tone: "clay" | "sage" | "blue"; number: number };

export function FamilyPathwayCard({ title, description, href, tone, number }: FamilyPathwayCardProps) {
  return <Link href={href} className={`family-pathway-card family-pathway-${tone}`}><span className="family-pathway-number">{String(number).padStart(2, "0")}</span><strong>{title}</strong><small>{description}</small><b aria-hidden="true">→</b></Link>;
}
