"use client";

import { PrintableChecklist } from "../family/PrintableChecklist";

type ChecklistGroup = { title: string; items: readonly string[] };

export function ReentryChecklist({ title, intro, items, groups }: { title: string; intro: string; items?: string[]; groups?: readonly ChecklistGroup[] }) {
  if (items) return <PrintableChecklist title={title} intro={intro} items={items} />;
  return <section className="reentry-checklist" aria-labelledby="reentry-checklist-title"><div className="reentry-checklist-heading"><div><p className="eyebrow">A printable reference</p><h2 id="reentry-checklist-title">{title}</h2><p>{intro}</p></div><button className="button button-secondary" type="button" onClick={() => window.print()}>Print checklist</button></div><div className="reentry-checklist-groups">{groups?.map((group) => <section key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}><span aria-hidden="true" /><p>{item}</p></li>)}</ul></section>)}</div></section>;
}
