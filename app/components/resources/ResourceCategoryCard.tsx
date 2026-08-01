import type { ResourceCategorySlug } from "../../data/resources";
import Link from "next/link";

type ResourceCategoryCardProps = { name: string; description: string; slug: ResourceCategorySlug };

export function ResourceCategoryCard({ name, description, slug }: ResourceCategoryCardProps) {
  return (
    <Link className="directory-category-card" href={`/resources/results?category=${slug}`}>
      <span>{name}</span>
      <small>{description}</small>
      <b aria-hidden="true">→</b>
    </Link>
  );
}
