import { TimelineGroup } from "./TimelineGroup";

export function ReentryPriorityFramework({ groups }: { groups: readonly { title: string; detail: string; items: readonly string[] }[] }) {
  return <section className="reentry-priority-framework" aria-labelledby="reentry-priorities-title"><div className="reentry-priorities-heading"><p className="eyebrow">A flexible framework</p><h2 id="reentry-priorities-title">Some needs arrive before others.</h2><p>Priorities vary. You may need to address these steps in a different order, and no one should be expected to complete every task in a fixed timeframe.</p></div><div>{groups.map((group, index) => <TimelineGroup {...group} number={index + 1} key={group.title} />)}</div></section>;
}
