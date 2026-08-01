export function TimelineGroup({ title, detail, items, number }: { title: string; detail: string; items: readonly string[]; number: number }) {
  return <section className="timeline-group"><span aria-hidden="true">{String(number).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div></section>;
}
