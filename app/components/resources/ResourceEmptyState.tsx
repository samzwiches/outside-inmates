import { PrimaryButton, SecondaryButton } from "../buttons";

type ResourceEmptyStateProps = { variant: "no-location" | "no-results" | "narrow" | "unavailable" };

const copy = {
  "no-location": { title: "Start with what you know.", body: "Enter a ZIP code or city, choose a need, or use the category cards to begin without a location.", action: "Search the directory" },
  "no-results": { title: "We could not find a match yet.", body: "Try a nearby city, fewer words, or a broader category. A good resource may use different language than you do.", action: "Adjust your search" },
  narrow: { title: "Those filters may be doing too much.", body: "Remove one or two filters to see more options, then compare the details that matter most to you.", action: "Clear filters" },
  unavailable: { title: "The directory is not available right now.", body: "We could not reach the resource directory right now. Please try again or use the support links in the site footer.", action: "Back to resources" },
};

export function ResourceEmptyState({ variant }: ResourceEmptyStateProps) {
  const item = copy[variant];
  return <div className="resource-empty-state"><p className="eyebrow">A gentler next step</p><h2>{item.title}</h2><p>{item.body}</p>{variant === "narrow" ? <PrimaryButton href="/resources/results">{item.action}</PrimaryButton> : <SecondaryButton href="/resources">{item.action}</SecondaryButton>}</div>;
}
