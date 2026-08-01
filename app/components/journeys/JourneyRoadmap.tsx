import { JourneyStep } from "./JourneyStep";

export function JourneyRoadmap({ steps }: { steps: string[] }) {
  return <section className="journey-roadmap" aria-labelledby="journey-roadmap-title"><div className="journey-roadmap-heading"><p className="eyebrow">A helpful order to consider</p><h2 id="journey-roadmap-title">Common next steps</h2><p>You may need these in a different order. This roadmap is informational only and does not save progress.</p></div><ol>{steps.map((step, index) => <JourneyStep step={step} number={index + 1} key={step} />)}</ol></section>;
}
