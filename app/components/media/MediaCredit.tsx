import type { MediaAttribution } from "../../data/media";

export function MediaCredit({ attribution }: { attribution?: MediaAttribution }) {
  if (!attribution?.creditName || !attribution.sourceName) return null;
  const content = <>Photo: {attribution.creditName} / {attribution.sourceName}</>;

  return attribution.sourceUrl ? <a className="media-credit" href={attribution.sourceUrl} target="_blank" rel="noreferrer">{content}</a> : <span className="media-credit">{content}</span>;
}
