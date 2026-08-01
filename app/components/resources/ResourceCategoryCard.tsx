import type { ResourceCategorySlug } from "../../data/resources";

type ResourceCategoryCardProps = { name: string; description: string; slug: ResourceCategorySlug };

export function ResourceCategoryCard({ name, description, slug }: ResourceCategoryCardProps) {
  return (
    <a className="directory-category-card" href={`/resources/results?category=${slug}`}>
      <span>{name}</span>
      <small>{description}</small>
      <b aria-hidden="true">→</b>
    </a>
  );
}
