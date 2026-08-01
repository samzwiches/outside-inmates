export type Pathway = { title: string; detail: string; accent: "clay" | "sage" | "blue" };
export type Resource = { title: string; description: string };
export type ForumPost = { title: string; category: string; replies: number; time: string };

export const navigation = [
  { label: "Resources", href: "/resources" },
  { label: "Start Here", href: "/start", emphasis: true },
  { label: "Community", href: "/#community" },
  { label: "Families", href: "/families" },
  { label: "Reentry", href: "/reentry" },
  { label: "Ask for Help", href: "/start/not-sure" },
  { label: "About", href: "/about" },
];

export const pathways: Pathway[] = [
  { title: "My loved one was just incarcerated", detail: "First steps, locating someone, and what to expect next.", accent: "clay" },
  { title: "I need visitation or communication information", detail: "Calls, mail, visitation, and staying connected.", accent: "blue" },
  { title: "I am preparing for release", detail: "A practical checklist for the weeks ahead.", accent: "sage" },
  { title: "I need housing, employment, or identification help", detail: "Start with essentials that make the next steps possible.", accent: "clay" },
  { title: "I need legal or advocacy resources", detail: "Find trusted guidance and know what questions to ask.", accent: "blue" },
  { title: "I feel overwhelmed and need support", detail: "Take one small step. You do not have to carry this alone.", accent: "sage" },
];

export const resourceCategories: Resource[] = [
  { title: "Housing", description: "A place to start" },
  { title: "Employment", description: "Work and training" },
  { title: "Identification", description: "Documents and records" },
  { title: "Legal help", description: "Rights and advocacy" },
  { title: "Family support", description: "Care from the outside" },
  { title: "Mental health", description: "Care and counseling" },
  { title: "Substance use recovery", description: "Recovery support" },
  { title: "Transportation", description: "Getting where you need to go" },
];

export const forumPosts: ForumPost[] = [
  { title: "How do I find out where my brother was transferred?", category: "Family navigation", replies: 12, time: "2h ago" },
  { title: "What identification can someone get before release?", category: "Reentry basics", replies: 8, time: "5h ago" },
  { title: "How do I explain incarceration to a child?", category: "Family support", replies: 21, time: "Yesterday" },
  { title: "Housing options after a felony conviction", category: "Housing", replies: 34, time: "Yesterday" },
];

export const trustItems = ["Privacy-minded", "Moderated community", "Lived experience welcome", "No judgment", "Resources reviewed regularly"];

export const footerLinks = [
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Transparency", href: "/transparency" },
  { label: "Community Guidelines", href: "#site-footer" },
  { label: "Privacy", href: "#site-footer" },
  { label: "Terms", href: "#site-footer" },
  { label: "Submit a Resource", href: "/resources#submit-resource" },
  { label: "Volunteer", href: "/support#participation-note" },
  { label: "Contact", href: "#site-footer" },
];
