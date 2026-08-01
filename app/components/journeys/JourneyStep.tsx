export function JourneyStep({ step, number }: { step: string; number: number }) {
  return <li className="journey-step"><span aria-hidden="true">{String(number).padStart(2, "0")}</span><p>{step}</p></li>;
}
