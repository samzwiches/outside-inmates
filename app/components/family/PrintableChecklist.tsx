"use client";

export function PrintableChecklist({ title, intro, items }: { title: string; intro: string; items: string[] }) {
  return <section className="printable-checklist" aria-labelledby={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-checklist`}><div className="checklist-heading"><div><p className="eyebrow">Take this with you</p><h2 id={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-checklist`}>{title}</h2><p>{intro}</p></div><button className="button button-secondary print-trigger" type="button" onClick={() => window.print()}>Print checklist</button></div><ul>{items.map((item) => <li key={item}><span aria-hidden="true" /><p>{item}</p></li>)}</ul></section>;
}
