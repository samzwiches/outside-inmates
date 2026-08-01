type SectionHeadingProps = {
  eyebrow: string;
  id: string;
  title: string;
  description?: string;
  inverted?: boolean;
};

export function SectionHeading({ eyebrow, id, title, description, inverted = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading ${inverted ? "is-inverted" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
