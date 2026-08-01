export function FamilyJourney({ items }: { items: { stage: string; detail: string }[] }) {
  return <ol className="family-journey">{items.map((item, index) => <li key={item.stage}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.stage}</h3><p>{item.detail}</p></div></li>)}</ol>;
}
