type ResourceDetailSectionProps = { title: string; children: React.ReactNode; className?: string };

export function ResourceDetailSection({ title, children, className = "" }: ResourceDetailSectionProps) {
  return <section className={`resource-detail-section ${className}`}><h2>{title}</h2><div>{children}</div></section>;
}
