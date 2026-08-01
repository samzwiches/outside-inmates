import type { ForumPost, Pathway, Resource } from "../data/site";

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
    <li><a className="resource-card" href="#site-footer"><span>{title}</span><small>{description}</small><b aria-hidden="true">↗</b></a></li>
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

type ActionCardProps = { id: string; eyebrow: string; title: string; description: string; action: string; theme: "clay" | "sage"; visual: "family" | "reentry" };

export function ActionCard({ id, eyebrow, title, description, action, theme, visual }: ActionCardProps) {
  return (
    <article className={`action-card action-${theme}`} id={id}>
      <div className="action-content">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <a href="#resources">{action} <span aria-hidden="true">→</span></a>
      </div>
      <div className={`action-visual visual-${visual}`} aria-hidden="true"><span /><i /><b /></div>
    </article>
  );
}
