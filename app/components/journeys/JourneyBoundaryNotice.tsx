export function JourneyBoundaryNotice({ notice }: { notice: { title: string; body: string; items: string[] } }) {
  return <aside className="journey-boundary-notice" aria-labelledby="journey-boundary-title"><p className="eyebrow">A note about boundaries</p><h2 id="journey-boundary-title">{notice.title}</h2><p>{notice.body}</p><ul>{notice.items.map((item) => <li key={item}>{item}</li>)}</ul></aside>;
}
