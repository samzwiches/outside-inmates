import type { Metadata } from "next";
import { FamilyGuideLayout } from "../../components/family/FamilyGuideLayout";
import { SupportCallout } from "../../components/family/SupportCallout";
import { SiteCardImage } from "../../components/cards/SiteCardImage";
import { childAgeGuidance } from "../../data/family";
import { getSiteCards } from "../../lib/site-card-server";

export const metadata: Metadata = { title: "Supporting Children | Outside Inmates", description: "Age-aware, adaptable guidance for supporting children through incarceration." };

const ageCardDetails = [
  { range: "Young children · roughly ages 3–6", support: "Keep explanations short, concrete, and reassuring. Repeat the same simple truth when they ask again." },
  { range: "School-age · roughly ages 7–12", support: "Answer the question they are actually asking, protect routines, and remind them this is not their responsibility." },
  { range: "Teens · roughly ages 13–17", support: "Be direct, respect privacy, and leave room for anger, loyalty, embarrassment, relief, or questions they are not ready to ask yet." },
] as const;

export default async function ChildrenPage() {
  const cards = await getSiteCards(childAgeGuidance.map((_, index) => `families.children.age.${String(index + 1).padStart(2, "0")}`));
  const cardsByKey = new Map(cards.map((card) => [card.key, card]));
  return <FamilyGuideLayout slug="children"><div className="guide-reading"><section className="age-guidance-section"><h2>What to say at different ages.</h2><p>Children need honesty they can understand, not a perfect speech. Start with what is true, keep it appropriate for their age, and make room for the same question to come back more than once.</p><div className="age-guidance-grid">{childAgeGuidance.map((item, index) => {
    const cardKey = `families.children.age.${String(index + 1).padStart(2, "0")}`;
    const card = cardsByKey.get(cardKey);
    const detail = ageCardDetails[index];
    return <article className={`age-guidance-card ${card?.imageUrl ? "has-card-image" : ""} ${card?.tone ? `card-tone-${card.tone}` : ""}`} data-card-key={cardKey} key={item.label}>
      {card?.imageUrl ? <SiteCardImage src={card.imageUrl} alt={card.imageAlt} focalX={card.focalX} focalY={card.focalY} className="age-guidance-media" /> : null}
      <div className="age-guidance-card-body">
        <p className="age-guidance-range">{detail.range}</p>
        <h3>{card?.title ?? item.label}</h3>
        <p className="age-guidance-support">{detail.support}</p>
        <p className="age-guidance-example"><strong>Try saying:</strong> {card?.description ?? item.example}</p>
      </div>
    </article>;
  })}</div></section><section><h2>How children may react.</h2><p>A child may be quiet, angry, worried, clingy, distracted, relieved, curious, or none of those things. Reactions can change over time. Listen without pushing for a particular feeling.</p></section><section><h2>Maintain connection when it feels right and safe.</h2><p>Calls, letters, drawings, recorded messages, or shared routines may help some children feel connected. Each family should make choices that fit the child’s safety, wishes, and the facility’s rules.</p></section><section><h2>Visits, calls, and school communication.</h2><p>Prepare children for what they may see and what they can do if they want a break. Tell schools or caregivers only what is useful and safe for the child. A trusted adult at school may help with routines and support.</p></section><section><h2>Caregiver stress matters, too.</h2><p>Children notice when adults are stretched thin. You do not have to hide every feeling, but finding one place for your own support can make it easier to stay present with a child.</p></section><section><h2>When additional support may be helpful.</h2><p>Consider speaking with a qualified child mental health professional, school counselor, pediatric provider, or another trusted professional when distress, behavior changes, sleep problems, or worry feel intense, persistent, or hard to manage alone.</p></section></div><SupportCallout title="Small, honest conversations can build safety." body="You do not need to have every answer today. Start with what is true, kind, and right for the child in front of you." href="/resources/results?category=family-support" action="Find family support" /></FamilyGuideLayout>;
}
