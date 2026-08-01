import { trustItems } from "../data/site";

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trust and safety commitments">
      <div className="container trust-list">
        {trustItems.map((item) => <p key={item}><span aria-hidden="true">✦</span>{item}</p>)}
      </div>
    </section>
  );
}
