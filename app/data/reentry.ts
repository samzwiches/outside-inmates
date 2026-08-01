import type { ResourceCategorySlug } from "./resources";

export type ReentrySlug = "first-week" | "documents" | "housing" | "employment" | "health" | "supervision" | "transportation" | "family-transition";
export type ReentrySection = { title: string; body: string[] };
export type ReentryWarning = { title: string; body: string; tone?: "clay" | "blue" | "sage" };
export type ReentryWorksheet = { title: string; intro: string; kind: "fields" | "document-tracker" | "transport-planner"; fields: string[] };

export type ReentryGuideData = {
  slug: ReentrySlug;
  kicker: string;
  title: string;
  shortDescription: string;
  intro: string;
  sections: ReentrySection[];
  checklistItems: string[];
  worksheet?: ReentryWorksheet;
  resourceCategories: ResourceCategorySlug[];
  reminders: string[];
  warnings: ReentryWarning[];
  relatedGuideSlugs: ReentrySlug[];
};

export const reentryGuides: ReentryGuideData[] = [
  {
    slug: "first-week",
    kicker: "First week planning",
    title: "Your first week home.",
    shortDescription: "A calm guide for release day, the first night, and the practical needs that may arrive early.",
    intro: "The first week can hold relief, pressure, exhaustion, and a lot of logistics. A plan can help, but it does not have to predict everything. Start with the details that need confirmation and the needs that make today safer or more stable.",
    sections: [
      { title: "Before leaving the facility", body: ["Confirm what you can about the release time, location, documents, medications, money, transportation, and any reporting instructions. These details can change, so use official channels rather than a rumor or an old plan.", "Keep a short list of questions for the facility, supervising agency, or provider. If an answer affects a deadline or legal obligation, confirm it directly with the appropriate authority or a qualified attorney."] },
      { title: "The day of release", body: ["Focus on a safe pickup or transportation option, a way to contact the people who need to know, and the first required stop if one applies. Make room for delays and do not assume a phone, charger, documents, or a full medication supply will be available."] },
      { title: "The first night", body: ["A safe place to sleep, food, a way to rest, and a clear plan for the next morning may be enough for the first night. If you are staying with someone, a short conversation about privacy, routines, visitors, money, and expectations can reduce pressure."] },
      { title: "The first three days", body: ["Prioritize any required report, medication, shelter, food, transportation, or appointment. Keep paperwork together and protect it from loss or theft. If you need a provider, ask what documentation and eligibility information they need before making a trip."] },
      { title: "The rest of the first week", body: ["Choose a few next tasks: documents, a medical appointment, housing, benefits, work, treatment, or transportation. You do not need every answer before you begin. Add only what is useful to the plan and come back for the rest later."] },
      { title: "What if the plan changes?", body: ["Release timing, transportation, housing, and supervision instructions may change. Recheck the official source, update the one or two people who need to know, and make a smaller backup plan. A change in plans is not a personal failure."] },
    ],
    checklistItems: ["Confirm official release date, time, location, and instructions", "Arrange a safe pickup or transportation backup", "Identify a safe first-night location", "List medications, prescription details, and health-care needs", "Keep release papers and available identification together", "Plan food, phone access, and a way to charge a device", "Confirm any required report or appointment", "Choose one or two first-week tasks, not every task at once"],
    worksheet: { title: "First Week Plan", intro: "These fields stay private to this page while it is open. They are not transmitted, saved, or stored by Outside Inmates.", kind: "fields", fields: ["Release date", "Release location", "Transportation plan", "First-night address", "Required reporting", "Medication needs", "Emergency contacts", "Food plan", "Phone access", "Important appointments", "Documents currently available", "Documents still needed"] },
    resourceCategories: ["reentry-planning", "housing", "food-basic-needs", "transportation", "identification-documents"],
    reminders: ["Release dates, locations, and instructions can change. Confirm them through official sources.", "A first-week plan can be useful even when it is incomplete.", "Outside Inmates does not confirm release details, monitor emergencies, or manage individual cases."],
    warnings: [],
    relatedGuideSlugs: ["documents", "housing", "supervision"],
  },
  {
    slug: "documents",
    kicker: "Documents and records",
    title: "Identification and documents.",
    shortDescription: "A practical way to track the records that may open up the next few steps.",
    intro: "Documents can affect housing, work, benefits, medical care, supervision, and travel. Requirements and processes vary by state and agency, so begin with what you have and ask the relevant office what they need next.",
    sections: [
      { title: "Start with what is already available.", body: ["Keep any state ID, driver license, birth certificate, Social Security information, health insurance information, release papers, supervision documents, education or employment records, medical records, and veteran records where relevant together. A photo or copy may be useful for your own planning, but some agencies require originals or certified copies."] },
      { title: "Ask before you pay for a replacement.", body: ["Fees, application steps, identity requirements, and processing times vary. Contact the relevant government office, agency, school, employer, health provider, or veteran service directly to ask what documents are needed and whether a fee waiver or navigator may be available."] },
      { title: "Protect your identity and your records.", body: ["Avoid sending a photo of identification, a Social Security number, or account credentials to an unexpected caller, text, or unofficial website. Use contact information you find yourself, and ask a trusted provider or qualified legal professional if you are unsure where a request came from."] },
    ],
    checklistItems: ["Gather every document currently available", "Make a private list of missing documents", "Find the official office or provider for each request", "Ask about costs, identification requirements, and timing", "Keep original documents in a safer place if possible", "Avoid sharing identity information with unexpected callers or links"],
    worksheet: { title: "Document tracker", intro: "Use this private worksheet to organize questions. Nothing entered here is sent, saved, or stored.", kind: "document-tracker", fields: ["State identification", "Driver license", "Birth certificate", "Social Security card", "Health insurance information", "Release papers", "Supervision documents", "Education records", "Employment records", "Medical records", "Veteran records where relevant"] },
    resourceCategories: ["identification-documents", "reentry-planning", "education", "employment"],
    reminders: ["Requirements and processes vary by state, agency, and record type.", "A document navigator can help prepare questions, but only the issuing office can confirm its current process.", "Do not share sensitive documents until you understand why they are needed and how they will be handled."],
    warnings: [{ title: "Identity and fee warning", body: "Unexpected calls or websites may pressure you to pay for a document or share an ID number. Verify the agency independently before paying or sending personal information.", tone: "clay" }],
    relatedGuideSlugs: ["first-week", "employment", "housing"],
  },
  {
    slug: "housing",
    kicker: "Housing and safety",
    title: "Finding a safe place to stay.",
    shortDescription: "Questions to bring to a shelter, program, household, or rental option before you commit.",
    intro: "A safe place to stay can look different for different people: immediate shelter, transitional or recovery housing, a family or friend arrangement, or a rental. Focus on safety, clear information, and whether an option works with any requirements you need to confirm.",
    sections: [
      { title: "Look at the full picture, not only the address.", body: ["Ask about total cost, deposits, application fees, background checks, eligibility restrictions, accessibility, transportation, household expectations, children or visitors, curfews, medications, and how concerns are handled. A space that is available today may still need careful questions."] },
      { title: "Plan for safety and practical access.", body: ["Consider transportation to required reporting, work, treatment, school, medical care, and food. If supervision applies, confirm any housing approval question with the supervising authority. If a household arrangement feels unsafe or pressured, look for another support option when possible."] },
      { title: "Be cautious with money and listings.", body: ["Do not send a deposit, application fee, or personal documents because an unfamiliar listing creates pressure. Verify the owner, program, or provider through an official source or a trusted local referral before paying."] },
    ],
    checklistItems: ["Is the location approved if supervision applies?", "What is the total cost?", "What documents are needed?", "Are there curfews or program requirements?", "Are medications allowed and managed safely?", "Are children or partners allowed to visit?", "Is transportation available?", "What happens if payment is late?", "How are complaints handled?"],
    resourceCategories: ["housing", "food-basic-needs", "transportation", "reentry-planning"],
    reminders: ["Housing rules, eligibility, deposits, and availability can change.", "Outside Inmates does not promise a listing, program, or household arrangement is safe or available.", "Confirm any supervision-related housing condition with the appropriate authority."],
    warnings: [{ title: "Fraudulent deposit warning", body: "Do not rely on an unofficial listing, unexpected payment request, or pressure to act immediately. Verify the property owner or provider independently before sharing money or documents.", tone: "clay" }],
    relatedGuideSlugs: ["first-week", "transportation", "family-transition"],
  },
  {
    slug: "employment",
    kicker: "Work and education",
    title: "Finding work after incarceration.",
    shortDescription: "A grounded guide to income needs, job readiness, training, and preparing for questions.",
    intro: "Work may be urgent, but it is not the only need that matters. Start with what will make applications, interviews, transportation, work clothing, training, or immediate income more manageable. No guide can promise that a particular employer will hire someone with a conviction.",
    sections: [
      { title: "Prepare the practical pieces first.", body: ["A résumé, reference list, work history notes, a reliable way to receive messages, transportation, interview clothing, and child care can all make a job search easier. Training, certifications, apprenticeships, education, self-employment, and gig work may be options, but each comes with different requirements and risks."] },
      { title: "Decide how to handle questions with care.", body: ["Background checks, disclosure questions, employment gaps, and references are handled differently by employers and applications. Read each question carefully. Do not conceal information where disclosure is legally required, and seek qualified legal or employment guidance for a specific question."] },
      { title: "Adaptable interview language", body: ["Example, not a required script: “I had time away from work and have been focused on preparing for a stable return to employment. I can talk about the skills I bring to this role.”", "Example, not a required script: “I am ready to be direct about what the application asks and to focus on the work I can do here.” Use only language that is accurate for your situation."] },
    ],
    checklistItems: ["List immediate income and transportation needs", "Gather work history, references, and any training records", "Prepare a résumé or ask for résumé support", "Read application questions carefully", "Plan transportation and clothing for an interview", "Look at training, certification, education, or apprenticeship options", "Ask a qualified source about a specific disclosure or legal question"],
    resourceCategories: ["employment", "education", "transportation", "identification-documents"],
    reminders: ["Outside Inmates does not promise a job, employer practice, or eligibility.", "Disclosure requirements and background-check processes can vary.", "Examples are starting points, not scripts you must use."],
    warnings: [],
    relatedGuideSlugs: ["documents", "transportation", "first-week"],
  },
  {
    slug: "health",
    kicker: "Health and recovery",
    title: "Health care, medications, and recovery support.",
    shortDescription: "Continuity questions for medication, care, insurance, recovery, and the next appointment.",
    intro: "Health care needs can be urgent after release. This guide can help organize questions about medications, prescriptions, insurance or benefits, primary care, mental health, recovery support, dental and vision care, records, and disability accommodations. It does not provide diagnosis or treatment advice.",
    sections: [
      { title: "Protect continuity where you can.", body: ["Keep the medication name, current dosage, last dose, pharmacy, prescribing provider, available prescription information, and next appointment together. A qualified health professional or pharmacist can answer questions about an individual medication, dose, refill, or urgent health concern."] },
      { title: "Ask about care and access.", body: ["A clinic, health provider, insurer, benefits office, or recovery provider can explain what care is available and what documents are needed. Ask about accessibility needs, medical records, transportation, language access, cost, and how to contact the office if a plan changes."] },
      { title: "Recovery and emotional support", body: ["Recovery support can include peer connection, treatment, counseling, medication support, and practical help. You do not need to decide every future step before asking for a conversation. If there is emotional distress or crisis, the 988 Lifeline offers call, text, and chat support."] },
    ],
    checklistItems: ["Write down medication name", "Write down current dosage", "Note last dose received", "Confirm whether a prescription is available", "Identify a pharmacy", "Record the prescribing provider", "Plan the next appointment", "Note whether a refill is needed"],
    worksheet: { title: "Medication continuity checklist", intro: "Keep only what is useful for your own planning. This page does not save, transmit, or store health information.", kind: "fields", fields: ["Medication name", "Current dosage", "Last dose received", "Prescription available", "Pharmacy", "Prescribing provider", "Next appointment", "Refill needed"] },
    resourceCategories: ["mental-health", "substance-use-recovery", "transportation", "reentry-planning"],
    reminders: ["This guide is not medical advice or a substitute for qualified medical care.", "Insurance, benefits, prescriptions, treatment, and provider availability vary.", "For an emergency or immediate physical danger, call emergency services."],
    warnings: [{ title: "Urgent emotional support", body: "If you or someone else is in emotional distress or crisis, call or text 988 or use the 988 Lifeline chat. If there is immediate physical danger, call emergency services.", tone: "blue" }],
    relatedGuideSlugs: ["first-week", "transportation", "family-transition"],
  },
  {
    slug: "supervision",
    kicker: "Requirements and reporting",
    title: "Understanding supervision requirements.",
    shortDescription: "A private place to organize questions about reporting, travel, work, treatment, and contact instructions.",
    intro: "Probation, parole, federal supervised release, and other forms of supervision can involve different requirements. Only the supervising authority or a qualified attorney can confirm an individual obligation or interpret a court order.",
    sections: [
      { title: "Confirm the instructions that apply to you.", body: ["Reporting location, first report date, travel, employment, housing, treatment, testing, fees, electronic monitoring, and contact changes can be handled differently in each case. Keep the written instructions you receive and ask the supervising authority to clarify a question before assuming an answer."] },
      { title: "Keep a simple record.", body: ["A list of agency contact information, appointment dates, reporting instructions, and questions can make it easier to prepare. If you are concerned about a possible violation or deadline, seek guidance from the supervising authority or a qualified attorney as soon as you can."] },
      { title: "Do not rely on general information for an individual order.", body: ["This guide does not interpret court orders or tell you whether a rule applies. Laws and conditions can vary by jurisdiction and individual case."] },
    ],
    checklistItems: ["Confirm agency and officer contact information", "Record first report date and location", "Ask about regular reporting schedule", "Ask how travel requests work", "Confirm housing and employment requirements", "Ask about treatment, testing, fees, and electronic monitoring if relevant", "Save written instructions and contact details", "Seek qualified guidance for a concern about an individual obligation"],
    worksheet: { title: "Supervision information worksheet", intro: "Use this private worksheet to keep confirmed instructions together. It is not transmitted, saved, or stored.", kind: "fields", fields: ["Agency", "Officer name", "Phone", "Reporting location", "First report date", "Regular schedule", "Travel rules", "Employment requirements", "Treatment requirements", "Testing requirements", "Fees", "Emergency contact instructions"] },
    resourceCategories: ["legal-help", "reentry-planning", "transportation", "employment"],
    reminders: ["Only a supervising authority or qualified attorney can confirm an individual obligation.", "Requirements may change or be clarified in writing.", "Outside Inmates does not interpret court orders, supervision conditions, or possible violations."],
    warnings: [{ title: "Individual requirements vary", body: "Do not use a general checklist as proof that a requirement applies or does not apply. Confirm your own instructions directly with the supervising authority or a qualified attorney.", tone: "blue" }],
    relatedGuideSlugs: ["first-week", "housing", "transportation"],
  },
  {
    slug: "transportation",
    kicker: "Getting where you need to go",
    title: "Getting where you need to go.",
    shortDescription: "A way to plan release-day pickup, required trips, and the transportation questions that can shape daily life.",
    intro: "Transportation can affect release day, reporting, work, treatment, health care, food, and family connection. The useful option may be a ride, public transportation, rural transit, medical transportation, a ride program, a bicycle, walking, or a combination.",
    sections: [
      { title: "Plan the next essential trip first.", body: ["Start with release-day pickup, required reporting, a medical appointment, treatment, work, or food. Ask about public, rural, medical, or local ride programs directly; availability, eligibility, hours, and advance notice may change."] },
      { title: "Consider access and safety.", body: ["A plan may need to account for disability accommodations, child care, weather, walking safety, a working phone, data access, vehicle access, insurance, driver license issues, or a backup when a ride falls through. Confirm supervision-related travel requirements with the relevant authority."] },
      { title: "Keep the week visible.", body: ["A simple week planner can show where a conflict may happen before the day arrives. Add only the trips that matter and keep a number for the provider, transit line, or person you have confirmed with."] },
    ],
    checklistItems: ["Confirm release-day pickup or a backup", "List required reporting, work, health, treatment, and food trips", "Check public, rural, medical, or ride-program options directly", "Ask about advance notice and accessibility", "Confirm any supervision-related travel rule", "Keep a contact number and backup plan for essential trips"],
    worksheet: { title: "Weekly transportation planner", intro: "Use this private planner to see essential trips in one place. It is not transmitted, saved, or stored.", kind: "transport-planner", fields: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    resourceCategories: ["transportation", "employment", "mental-health", "substance-use-recovery"],
    reminders: ["Ride-program availability, eligibility, costs, and schedules can change.", "A backup plan for one important trip can be enough to start.", "Confirm any travel requirement directly with the supervising authority if it applies."],
    warnings: [],
    relatedGuideSlugs: ["first-week", "housing", "employment"],
  },
  {
    slug: "family-transition",
    kicker: "Family and household transition",
    title: "Preparing the household for coming home.",
    shortDescription: "A guide for expectations, privacy, safety, and the conversations that can make a household plan clearer.",
    intro: "Coming home does not automatically mean living together, reuniting, sharing money, or returning to old roles. Every household can make choices based on safety, capacity, privacy, children, relationships, and what is actually realistic.",
    sections: [
      { title: "Make expectations discussable.", body: ["A household conversation can cover sleeping arrangements, privacy, parenting, money, responsibilities, communication, technology changes, transportation, visitors, and the support each person needs. There is no single right agreement, and a plan may need to change over time."] },
      { title: "Plan for conflict and safety.", body: ["Consider what will happen if conflict rises, someone needs space, substance use becomes a concern, or a child needs support. A trusted outside person, counselor, peer group, or professional may help with conversations that feel too difficult to manage alone."] },
      { title: "Support can happen at a distance.", body: ["Family support does not require sharing a home, money, or every detail of a person’s situation. Staying connected can include clear communication, practical help, a visit, a meal, a ride, or a boundary that protects everyone involved."] },
    ],
    checklistItems: ["Discuss sleeping arrangements and privacy", "Name realistic household expenses", "Talk about home rules and responsibilities", "Plan transportation and essential appointments", "Consider parenting decisions and children’s needs", "Identify topics that need professional support", "Choose a plan for conflict or a need for space", "Name outside support people or services"],
    worksheet: { title: "Household conversation guide", intro: "Use these prompts in the way that feels safe. This page does not transmit, save, or store your responses.", kind: "fields", fields: ["Where will everyone sleep?", "What expenses can the household realistically cover?", "What rules apply in the home?", "How will transportation work?", "How will parenting decisions be handled?", "What topics need professional support?", "What happens if conflict escalates?", "What privacy does each person need?", "What outside support is available?"] },
    resourceCategories: ["family-support", "housing", "mental-health", "substance-use-recovery", "food-basic-needs"],
    reminders: ["Reunification is not always safe, desired, or immediately possible.", "A household agreement should not require anyone to give up personal safety.", "Outside support can be practical, emotional, or professional."],
    warnings: [{ title: "Family support does not require giving up safety.", body: "Supporting someone does not require living together, sharing money, accepting threats, tolerating abuse, or abandoning personal safety. If you feel unsafe, consider local emergency, domestic-violence, or crisis support.", tone: "clay" }],
    relatedGuideSlugs: ["first-week", "housing", "health"],
  },
];

export const reentryPathways = [
  { title: "Release information and conditions", detail: "Confirm what needs to happen before, during, and just after release.", href: "/reentry/first-week", resourceHref: "/resources/results?category=reentry-planning", tone: "blue" },
  { title: "Identification and documents", detail: "Track the records that can unlock the next practical step.", href: "/reentry/documents", resourceHref: "/resources/results?category=identification-documents", tone: "clay" },
  { title: "Safe housing", detail: "Ask clearer questions about safety, cost, access, and expectations.", href: "/reentry/housing", resourceHref: "/resources/results?category=housing", tone: "sage" },
  { title: "Food and basic needs", detail: "Find support for the essentials that cannot wait.", href: "/resources/results?category=food-basic-needs", resourceHref: "/resources/results?category=food-basic-needs", tone: "blue" },
  { title: "Health care and medications", detail: "Organize continuity questions and the next care contact.", href: "/reentry/health", resourceHref: "/resources/results?category=mental-health", tone: "clay" },
  { title: "Transportation", detail: "Plan essential trips and a backup for the week ahead.", href: "/reentry/transportation", resourceHref: "/resources/results?category=transportation", tone: "sage" },
  { title: "Employment and education", detail: "Prepare for work, training, and the practical pieces around them.", href: "/reentry/employment", resourceHref: "/resources/results?category=employment", tone: "blue" },
  { title: "Supervision requirements", detail: "Keep confirmed instructions and questions in one place.", href: "/reentry/supervision", resourceHref: "/resources/results?category=legal-help", tone: "clay" },
  { title: "Recovery and mental health support", detail: "Find qualified, peer, and practical support without judgment.", href: "/reentry/health", resourceHref: "/resources/results?category=substance-use-recovery", tone: "sage" },
  { title: "Family and household transition", detail: "Make room for boundaries, expectations, and safety.", href: "/reentry/family-transition", resourceHref: "/resources/results?category=family-support", tone: "blue" },
] as const;

export const reentryPriorityGroups = [
  { title: "Before release", detail: "A helpful order to consider when there is time to plan.", items: ["Confirm release details", "Identify required reporting", "Gather available documents", "Plan transportation", "Confirm medications", "Identify a safe first-night location", "Prepare contact information"] },
  { title: "First 72 hours", detail: "Focus on the needs that may be immediate after release.", items: ["Report as required", "Secure immediate food and shelter", "Fill medications", "Confirm communication access", "Protect documents", "Contact essential support people"] },
  { title: "First 30 days", detail: "Add the next tasks only when the immediate basics are steadier.", items: ["Replace missing identification", "Establish health care", "Apply for benefits where eligible", "Begin housing and employment steps", "Arrange transportation", "Build routines", "Review supervision expectations"] },
] as const;

export const comprehensiveReentryChecklist = [
  { title: "Before release", items: ["Confirm current release details through official channels", "Gather available documents and contact information", "Plan a safe first-night location and transportation", "List medication and health-care questions", "Ask what reporting instructions need confirmation"] },
  { title: "Release day", items: ["Confirm pickup or a transportation backup", "Keep documents and available medication together", "Know the first required stop or contact", "Plan food, phone access, and a way to charge a device"] },
  { title: "First night", items: ["Secure a safe place to sleep", "Rest, eat, and make the next morning’s plan smaller", "Discuss only the household expectations that cannot wait"] },
  { title: "First 72 hours", items: ["Report or attend required appointments", "Address food, shelter, medication, and communication access", "Protect documents and record important contact information"] },
  { title: "First week", items: ["Choose one or two document, health, housing, work, or transportation steps", "Confirm eligibility and requirements directly with providers", "Ask for support when a task needs more than one person"] },
  { title: "First month", items: ["Build routines around requirements and essential care", "Review housing, employment, education, recovery, and family needs", "Return to this list only for the next useful step"] },
] as const;

export const reentryResourceCategories: { label: string; href: string; description: string }[] = [
  { label: "Housing", href: "/resources/results?category=housing", description: "Safe housing and planning support" },
  { label: "Employment", href: "/resources/results?category=employment", description: "Work, training, and job-readiness help" },
  { label: "Documents", href: "/resources/results?category=identification-documents", description: "Identification and record navigation" },
  { label: "Health care", href: "/reentry/health", description: "Medication and care-planning guidance" },
  { label: "Mental Health", href: "/resources/results?category=mental-health", description: "Counseling, support, and care connections" },
  { label: "Recovery", href: "/resources/results?category=substance-use-recovery", description: "Recovery navigation and peer support" },
  { label: "Transportation", href: "/resources/results?category=transportation", description: "Rides, transit, and essential trips" },
  { label: "Food and Basic Needs", href: "/resources/results?category=food-basic-needs", description: "Food, clothing, and daily essentials" },
  { label: "Education", href: "/resources/results?category=education", description: "Credentials, training, and school support" },
];

export function getReentryGuide(slug: string) { return reentryGuides.find((guide) => guide.slug === slug); }
export function getRelatedReentryGuides(slugs: ReentrySlug[]) { return slugs.map((slug) => getReentryGuide(slug)).filter((guide): guide is ReentryGuideData => Boolean(guide)); }
