import type { ForumPost, Pathway, Resource } from "../data/site";
import Link from "next/link";

export function PathwayCard({ title, detail, accent, number }: Pathway & { number: number }) {
  return (
    <a className={`pathway-card pathway-${accent}`} href="#resources">
      <span className="pathway-number" aria-hidden="true">{String(number).padStart(2, "0")}</span>
      <span className="pathway-title">{title}</span>
      <span className="pathway-detail">{detail}</span>
      <span className="pathway-arrow" aria-hidden="true">→</span>
    </a>
  );
}

export function ResourceCard({ title, description }: Resource) {
  return (
    <li><Link className="resource-card" href="/resources"><span>{title}</span><small>{description}</small><b aria-hidden="true">↗</b></Link></li>
  );
}

export function ForumPreviewCard({ title, category, replies, time }: ForumPost) {
  return (
    <article className="forum-card">
      <p className="forum-category">{category}</p>
      <h3>{title}</h3>
      <footer><span>{replies} replies</span><span>{time}</span></footer>
    </article>
  );
}

type ActionCardProps = { id: string; eyebrow: string; title: string; description: string; action: string; href: string; theme: "clay" | "sage"; visual: "family" | "reentry" };

export function ActionCard({ id, eyebrow, title, description, action, href, theme, visual }: ActionCardProps) {
  return (
    <article className={`action-card action-${theme}`} id={id}>
      <div className="action-content">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href={href}>{action} <span aria-hidden="true">→</span></Link>
      </div>
      <div className={`action-visual visual-${visual}`} aria-hidden="true"><span /><i /><b /></div>
    </article>
  );
}
