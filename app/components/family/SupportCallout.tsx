import Link from "next/link";

export function SupportCallout({ title = "You do not have to figure this out all at once.", body = "Choose one small next step, then come back when you need another.", href = "/resources/results?category=family-support", action = "Find family resources" }: { title?: string; body?: string; href?: string; action?: string }) {
  return <aside className="support-callout"><p className="eyebrow">A steady next step</p><h2>{title}</h2><p>{body}</p><Link className="button button-primary" href={href}>{action} <span aria-hidden="true">→</span></Link></aside>;
}
