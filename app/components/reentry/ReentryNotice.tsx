import type { ReentryWarning } from "../../data/reentry";

export function ReentryNotice({ notice }: { notice: ReentryWarning }) {
  return <aside className={`reentry-notice reentry-notice-${notice.tone ?? "sage"}`}><p className="eyebrow">Important to know</p><h2>{notice.title}</h2><p>{notice.body}</p></aside>;
}
