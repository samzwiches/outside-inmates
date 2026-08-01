import type { ResourceCategorySlug } from "./resources";

export type JourneySlug = "just-arrested" | "currently-incarcerated" | "coming-home" | "rebuilding" | "supporting-someone" | "not-sure";

export type JourneyGuide = { title: string; description: string; href: string };
export type JourneySection = { title: string; body: string[] };

export type JourneyData = {
  slug: JourneySlug;
  cardTitle: string;
  title: string;
  shortDescription: string;
  intro: string;
  firstAction: string;
  steps: string[];
  recommendedGuides: JourneyGuide[];
  resourceCategories: ResourceCategorySlug[];
  reminders: string[];
  checklistItems: string[];
  relatedJourneySlugs: JourneySlug[];
  detailSections: JourneySection[];
  boundaryNotice?: { title: string; body: string; items: string[] };
  urgentSupport?: boolean;
};

export const journeys: JourneyData[] = [
  {
    slug: "just-arrested",
    cardTitle: "Someone I love was just arrested",
    title: "Someone I love was just arrested. What happens now?",
    shortDescription: "I do not know where they are or what happens next.",
    intro: "The first hours can move quickly and still leave you waiting. Start with the facts you can confirm, protect your information, and handle only the needs that cannot wait today.",
    firstAction: "Confirm where they are being held using an official court, jail, or corrections source.",
    steps: ["Confirm where they are being held", "Write down identifying and case information", "Understand communication delays", "Protect yourself from scams", "Learn the facility rules", "Decide whether legal help is needed", "Prepare children or other family members", "Handle immediate household needs"],
    recommendedGuides: [
      { title: "Family Support", description: "A calm place for practical questions and the impact on family life.", href: "/families" },
      { title: "Someone I love was just incarcerated", description: "A first-hours guide for locating someone and making a smaller list.", href: "/families/just-incarcerated" },
      { title: "Calls, mail, and communication", description: "What to record before setting up accounts or sending money.", href: "/families/staying-connected" },
      { title: "Support for children", description: "Age-aware language and a steadier way to prepare children.", href: "/families/children" },
    ],
    resourceCategories: ["legal-help", "communication-visitation", "family-support"],
    reminders: ["A delay in information or contact does not always tell you what is happening.", "Do not rely on an unexpected caller, text, or payment link to confirm custody, a release, or an urgent fee.", "Facility rules, court processes, and legal options vary. This is general information, not legal advice."],
    checklistItems: ["Confirm location using an official source", "Write down full legal name, date of birth, and any case or booking number", "Keep a dated record of calls, names, and information received", "Pause before paying or sharing account details", "Ask about current communication, mail, visit, and payment rules", "List household needs that cannot wait today", "Choose what children need to know now", "Contact a qualified legal professional for a specific legal question or deadline"],
    relatedJourneySlugs: ["currently-incarcerated", "supporting-someone", "not-sure"],
    detailSections: [
      { title: "Keep one record, not ten loose notes.", body: ["A phone note, notebook, or printed sheet can make the next call less overwhelming. Keep the facility name, official number, case or booking information if known, and the name and date for every conversation.", "You do not need to solve a future problem before you know it is real. Write down what is confirmed and what still needs to be checked."] },
      { title: "Protect yourself while you are trying to help.", body: ["Urgent messages can feel convincing when you are scared. Find the facility or provider contact information yourself, then call that number rather than using a number or link supplied in an unexpected message.", "If you need legal advice, look for a qualified attorney or legal-aid organization. Outside Inmates cannot interpret a case, confirm custody, or provide legal representation."] },
    ],
  },
  {
    slug: "currently-incarcerated",
    cardTitle: "My loved one is incarcerated",
    title: "My loved one is incarcerated. How do we manage this?",
    shortDescription: "I need help staying connected and managing life outside.",
    intro: "Managing life outside can mean calls, mail, visits, bills, children, and your own well-being all at once. You can care about someone and still make choices that keep you and your household safe.",
    firstAction: "Confirm the facility’s current rules for contact, visits, approved payments, and account providers.",
    steps: ["Confirm contact and visitation rules", "Set communication expectations", "Plan calls, mail, and approved payments", "Protect the household budget", "Support children and caregivers", "Find emotional and peer support", "Prepare gradually for future transitions"],
    recommendedGuides: [
      { title: "Stay connected", description: "Track calls, mail, providers, and boundaries in one place.", href: "/families/staying-connected" },
      { title: "Visitation guide", description: "Prepare for approval, identification, travel, and the visit itself.", href: "/families/visitation" },
      { title: "Support for children", description: "Make space for age-appropriate truth, routines, and feelings.", href: "/families/children" },
      { title: "Emotional support", description: "Support for grief, fatigue, isolation, and complicated feelings.", href: "/families/emotional-support" },
    ],
    resourceCategories: ["family-support", "communication-visitation", "mental-health"],
    reminders: ["Communication providers, schedules, and visitation rules can change. Confirm details directly with the facility before you travel or send money.", "You are not required to answer every request immediately.", "Peer support can help with isolation, but it is not a substitute for legal, clinical, or crisis care."],
    checklistItems: [],
    relatedJourneySlugs: ["just-arrested", "coming-home", "supporting-someone"],
    detailSections: [
      { title: "Make a plan that includes your life outside.", body: ["A plan can include a call schedule, a monthly limit for approved expenses, a place for facility details, and one person you can call when you feel stretched. It does not have to be elaborate to be useful.", "If children are involved, choose routines and explanations that fit their ages. You do not need to promise a release date or a visit before it is confirmed."] },
      { title: "Prepare without living only in the future.", body: ["It can help to save copies of useful information and slowly learn what documents, housing, treatment, or transportation may be needed later. Dates and plans can change, so keep your immediate needs in view too."] },
    ],
    boundaryNotice: { title: "Supporting someone does not require accepting harm.", body: "Care, loyalty, and connection do not require you to accept abuse, financial pressure, manipulation, threats, or unsafe behavior.", items: ["It is okay to say you need time before agreeing to a request.", "It is okay to set a spending limit or not send money.", "It is okay to ask another trusted person or professional for support.", "If you feel unsafe, consider a local domestic-violence, crisis, or emergency support option."] },
  },
  {
    slug: "coming-home",
    cardTitle: "They are coming home soon",
    title: "They are coming home soon. How do we prepare?",
    shortDescription: "I need to prepare for release and what comes next.",
    intro: "Release can bring relief, uncertainty, pressure, and many practical questions at the same time. Start with the details that need confirmation, then make a first-week plan that can change if the timeline does.",
    firstAction: "Confirm the release date, release conditions, and any reporting instructions through official channels.",
    steps: ["Confirm the release date and release conditions", "Secure identification and documents", "Plan transportation", "Review housing options", "Prepare for supervision requirements", "Plan medications and treatment", "Discuss communication and household expectations", "Prepare children and family members", "Build a first week plan"],
    recommendedGuides: [
      { title: "Resource Finder: reentry planning", description: "Use sample listings to see the kinds of planning support to look for.", href: "/resources/results?category=reentry-planning" },
      { title: "Identification and documents", description: "Start with the paperwork that can unlock other next steps.", href: "/resources/results?category=identification-documents" },
      { title: "Housing resources", description: "Explore practical housing support and what to ask about eligibility.", href: "/resources/results?category=housing" },
      { title: "Family Support", description: "Prepare for changing routines and family expectations together.", href: "/families" },
    ],
    resourceCategories: ["reentry-planning", "identification-documents", "housing", "transportation", "mental-health"],
    reminders: ["Release dates, conditions, transportation arrangements, and reporting requirements can change. Confirm them directly through the relevant facility, court, supervising agency, or provider.", "Do not assume a person will leave with all needed identification, medication, money, or a confirmed place to stay.", "This is a guided preview of future reentry support, not a release-plan service."],
    checklistItems: ["Confirm official release date, time, location, and reporting instructions", "Ask what identification and documents will be available", "Plan a safe pickup or transportation backup", "Confirm the first place to sleep and a way to contact the household", "List medications, health-care needs, and treatment contacts", "Review supervision or court requirements with the appropriate official source", "Set aside basic food, hygiene items, clothing, and a charger if useful", "Choose one or two first-week appointments or tasks, not every task at once"],
    relatedJourneySlugs: ["rebuilding", "currently-incarcerated", "supporting-someone"],
    detailSections: [
      { title: "Make room for plans to change.", body: ["A release plan is useful, but it is not a guarantee. Keep a current phone number for the relevant official contact, confirm details close to the time of release, and have a backup transportation or lodging idea if possible.", "Be careful about making promises around work, housing, family visits, or money before the conditions and timeline are known."] },
      { title: "Talk about the first week, not every future year.", body: ["A calm first-week plan may include where to sleep, what to eat, how to get to an appointment, a way to charge a phone, and when to rest. A conversation about household expectations can be helpful, especially when it leaves room for uncertainty and consent."] },
    ],
  },
  {
    slug: "rebuilding",
    cardTitle: "I am rebuilding after incarceration",
    title: "I am rebuilding after incarceration. Where do I begin?",
    shortDescription: "I need help with documents, housing, work, treatment, and daily life.",
    intro: "You may be handling several urgent needs at once, or you may not know which one should come first. Begin with the step that makes today more stable, and return for the rest when it is useful.",
    firstAction: "Choose one basic need to address today: identification, a safe place to sleep, food, medication, transportation, or an official requirement.",
    steps: ["Identification and documents", "Safe housing", "Food and basic needs", "Medication and health care", "Supervision requirements", "Transportation", "Employment and education", "Recovery and mental health support", "Family reconnection", "Long term stability"],
    recommendedGuides: [
      { title: "Reentry planning resources", description: "A starting place for turning a long list into a few next steps.", href: "/resources/results?category=reentry-planning" },
      { title: "Identification and documents", description: "Find document-navigation support and practical preparation ideas.", href: "/resources/results?category=identification-documents" },
      { title: "Housing and basic needs", description: "Look for options that can make the next few days more stable.", href: "/resources/results?category=housing" },
      { title: "Employment and education", description: "Explore work, training, and credential support at your own pace.", href: "/resources/results?category=employment" },
    ],
    resourceCategories: ["identification-documents", "housing", "food-basic-needs", "transportation", "employment", "education", "substance-use-recovery", "mental-health", "reentry-planning"],
    reminders: ["You do not have to feel hopeful, reunited, sober, employed, or ready for every step to deserve practical support.", "Program eligibility, supervision requirements, and benefits rules vary. Confirm them with the agency or provider directly.", "Outside Inmates does not decide eligibility, store your information, or manage your requirements."],
    checklistItems: ["Identify the most urgent need for the next 24 hours", "Keep any current identification, release paperwork, and agency contacts together", "Find a safe place to sleep or ask about short-term housing options", "Plan food, medication, and a way to get to essential appointments", "Confirm any reporting or supervision requirements directly", "Choose one document, housing, work, recovery, or health step for this week", "Ask before sharing your information with a provider or another person", "Save a few resource options, then take a break if you need one"],
    relatedJourneySlugs: ["coming-home", "supporting-someone", "not-sure"],
    detailSections: [
      { title: "Start with stability, not an ideal timeline.", body: ["For some people, identification is the first task. For others, it is a safe place to sleep, a meal, medication, a report date, or a way to get to an appointment. The useful order can be different for everyone.", "Use the Resource Finder to browse one category at a time. Its current entries are demonstration data, so confirm details directly with any provider before relying on them."] },
      { title: "Let support be practical.", body: ["A provider, peer, family member, or friend may be able to help make a call, find a bus route, gather a document, or sit with you while you sort a list. You can choose what support feels useful and keep your personal information private until you are ready to share it."] },
    ],
    urgentSupport: true,
  },
  {
    slug: "supporting-someone",
    cardTitle: "I am trying to help someone",
    title: "I am trying to help someone. What is actually useful?",
    shortDescription: "I am a family member, friend, advocate, employer, volunteer, or service provider.",
    intro: "Practical help often starts with listening and asking what would make the next day easier. You can be supportive without taking over, making promises, or stepping outside your role.",
    firstAction: "Ask what feels most urgent, then listen before offering a solution.",
    steps: ["Listen before solving", "Confirm what the person actually needs", "Avoid promises you cannot keep", "Respect privacy", "Offer practical help", "Avoid financial scams", "Understand boundaries", "Connect people with verified services", "Stay within your role"],
    recommendedGuides: [
      { title: "Family Support", description: "For people managing incarceration and family life from the outside.", href: "/families" },
      { title: "Resource Finder", description: "Browse clear categories, then confirm provider details directly.", href: "/resources" },
      { title: "Legal help resources", description: "A starting point for finding appropriate legal-aid and advocacy options.", href: "/resources/results?category=legal-help" },
      { title: "Emotional support", description: "Acknowledge stress without trying to become someone’s clinician.", href: "/families/emotional-support" },
    ],
    resourceCategories: ["family-support", "legal-help", "housing", "employment", "mental-health"],
    reminders: ["Only share information that the person has agreed you can share.", "Do not represent yourself as a lawyer, clinician, corrections official, or service provider if that is not your role.", "Confirm a service directly before promising that it is available, free, or a fit."],
    checklistItems: [],
    relatedJourneySlugs: ["currently-incarcerated", "coming-home", "not-sure"],
    detailSections: [
      { title: "Help without taking over.", body: ["Useful help can be small and specific: sitting with someone while they make a call, offering a ride, helping make a list, sharing a meal, or finding an official phone number. Ask first, and let the person decide what happens with the information.", "Avoid making a promise on someone else’s behalf, taking control of their money or documents, or sharing their situation without permission. If a need is legal or clinical, help locate an appropriate professional rather than trying to fill that role."] },
      { title: "Keep support grounded.", body: ["Employers, volunteers, faith communities, advocates, and service providers can all be practical allies. Respecting privacy, naming your limits, and following through on one small offer can be more useful than trying to solve everything."] },
    ],
    boundaryNotice: { title: "Good support has boundaries.", body: "Offering help does not mean taking responsibility for every outcome or putting yourself at risk.", items: ["Be honest about what you can and cannot offer.", "Do not send money or share credentials because an unexpected caller creates pressure.", "Ask permission before contacting a provider or sharing someone’s personal story.", "Seek qualified legal or clinical guidance when a need is outside your role."] },
  },
  {
    slug: "not-sure",
    cardTitle: "I do not know where to start",
    title: "I do not know where to start.",
    shortDescription: "Help me sort through what is happening.",
    intro: "You do not need the right term, category, or plan before you begin. Answer a few optional questions on this page and we will point toward a useful starting place. Nothing you choose is saved.",
    firstAction: "Name the one thing that feels most urgent today.",
    steps: ["Name what is happening now", "Choose what feels most urgent", "Look at one useful path", "Take one small next step", "Come back when another need appears"],
    recommendedGuides: [
      { title: "Start with family support", description: "For questions about arrest, communication, visits, children, and care from the outside.", href: "/families" },
      { title: "Browse the Resource Finder", description: "Search by need when a situation is harder to name.", href: "/resources" },
      { title: "Just arrested", description: "A focused first-hours path for confirming information and protecting yourself.", href: "/start/just-arrested" },
    ],
    resourceCategories: ["family-support", "reentry-planning", "mental-health", "legal-help"],
    reminders: ["This selector is not an assessment, diagnosis, eligibility decision, or legal recommendation.", "Answers stay on this page. They are not collected, saved, transmitted, or logged.", "You can skip it and choose any path that feels more useful."],
    checklistItems: [],
    relatedJourneySlugs: ["just-arrested", "rebuilding", "supporting-someone"],
    detailSections: [
      { title: "There is no wrong first page.", body: ["A situation may fit more than one path. Choose the one that makes the next step clearer, then change direction whenever you need to.", "If the situation feels urgent or unsafe, use local emergency services when there is immediate physical danger, or the 988 Lifeline for emotional distress or crisis support."] },
    ],
    urgentSupport: true,
  },
];

export function getJourney(slug: string) {
  return journeys.find((journey) => journey.slug === slug);
}

export function getRelatedJourneys(slugs: JourneySlug[]) {
  return slugs.map((slug) => getJourney(slug)).filter((journey): journey is JourneyData => Boolean(journey));
}
