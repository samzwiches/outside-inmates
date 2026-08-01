export type FamilyGuideSlug = "just-incarcerated" | "staying-connected" | "children" | "visitation" | "emotional-support";

export const familyGuides: { slug: FamilyGuideSlug; kicker: string; title: string; intro: string; resourceHref: string; resourceLabel: string }[] = [
  { slug: "just-incarcerated", kicker: "The first 72 hours", title: "Someone I love was just incarcerated. What do I do now?", intro: "A calm first list for locating someone, protecting your information, and getting through the immediate hours.", resourceHref: "/resources/results?category=family-support", resourceLabel: "Find family support" },
  { slug: "staying-connected", kicker: "Calls, mail, and communication", title: "Stay connected without losing yourself in the rules.", intro: "A practical place to track facility information, communication options, boundaries, and common restrictions.", resourceHref: "/resources/results?category=communication-visitation", resourceLabel: "Find communication support" },
  { slug: "children", kicker: "Helping children feel safe", title: "Children need truth, safety, and room to feel.", intro: "Age-aware guidance for conversations, routines, school communication, and noticing when more support could help.", resourceHref: "/resources/results?category=family-support", resourceLabel: "Find family support" },
  { slug: "visitation", kicker: "Visitation without the guesswork", title: "Prepare for a visit one step at a time.", intro: "A steady checklist for rules, approval, identification, transportation, and the feelings that can follow a visit.", resourceHref: "/resources/results?category=communication-visitation", resourceLabel: "Find visitation support" },
  { slug: "emotional-support", kicker: "Caring for yourself without guilt", title: "You are allowed to have complicated feelings.", intro: "Support for the grief, anger, fear, love, relief, and exhaustion that can live alongside each other.", resourceHref: "/resources/results?category=mental-health", resourceLabel: "Find mental health resources" },
];

export const familyPathways = [
  { title: "Someone was just arrested or incarcerated", description: "Start with the first facts you can confirm and the needs right in front of you.", href: "/families/just-incarcerated", tone: "clay" },
  { title: "I need to locate my loved one", description: "Learn what to write down and where to confirm information directly.", href: "/families/just-incarcerated#locate", tone: "blue" },
  { title: "I need help with calls, mail, or money", description: "Keep communication details in one place and pause before sending payment.", href: "/families/staying-connected", tone: "sage" },
  { title: "I am preparing for a visit", description: "Use the facility’s official rules and a simple visit-prep checklist.", href: "/families/visitation", tone: "clay" },
  { title: "I need help supporting a child", description: "Find age-aware language, routines, and signs a child may need more care.", href: "/families/children", tone: "blue" },
  { title: "I am overwhelmed and need support", description: "Make room for your own needs without having to explain or defend them.", href: "/families/emotional-support", tone: "sage" },
];

export const familyQuestions = [
  { question: "How do I find where someone is being held?", answer: "Start with the official corrections, jail, or court information for the place where the arrest or transfer occurred. Have the person’s full legal name, date of birth, and any known identification number ready. Information can take time to update after an arrest or transfer, so confirm directly with the facility when you can." },
  { question: "Why can I not reach them yet?", answer: "The first hours and days can include intake, transport, safety checks, classification, or a change in housing. Communication may not be available right away. That delay does not necessarily tell you what is happening; use official contact information rather than rumors or messages from unknown callers." },
  { question: "How do phone calls and accounts work?", answer: "Facilities often use different phone or messaging providers, account systems, schedules, and approval steps. Ask the facility for its current instructions and write down the provider name before adding money or opening an account." },
  { question: "What can I send through the mail?", answer: "Mail rules can differ by facility and may change. Before sending anything, confirm the exact mailing address, required identifying information, permitted materials, and any limits directly with the facility." },
  { question: "How do I learn the visitation rules?", answer: "Look for the facility’s official visitor information. Ask whether approval is required, what identification is needed, how children are included, how visits are scheduled, and what items or clothing are not allowed. Confirm again before you travel." },
  { question: "What should I tell a child?", answer: "Use simple, honest language that fits the child’s age and what they already know. It can help to say that the situation is not their fault and that adults are working on keeping them safe. Avoid promises about release dates or contact that you cannot confirm." },
  { question: "How do I protect myself from scams?", answer: "Pause before paying or sharing information. Verify a facility and caller using official contact information you find yourself. Do not rely only on a phone number, link, or verification code provided in an unexpected call or message." },
  { question: "What information should I write down?", answer: "Keep a dated note with the facility name, official phone number, resident or inmate number if known, housing information, communication provider, visitation steps, and the name of any staff member you speak with. It can make the next call less overwhelming." },
];

export const familyJourney = [
  { stage: "The first hours and days", detail: "Confirm what you can, handle urgent household needs, and avoid making big decisions from panic." },
  { stage: "Learning the system", detail: "Rules, language, and timelines can be confusing. Write down what you learn and confirm it with official sources." },
  { stage: "Staying connected", detail: "Calls, mail, visits, and boundaries can all change. Keep only the details that are useful for your family." },
  { stage: "Managing family life", detail: "Children, work, money, caregiving, and your own health still need attention. It is okay to ask for help." },
  { stage: "Preparing for release", detail: "Planning can start early, but dates and options may shift. Focus on documents, housing, support, and realistic next steps." },
  { stage: "Starting again", detail: "Reentry can bring hope and stress at the same time. Families may need new routines, boundaries, and support." },
];

export const childSupportPoints = [
  "Use age-appropriate, honest language rather than filling gaps with guesses.",
  "Remind children that incarceration is not their fault.",
  "Avoid promises about release dates or contact that are uncertain.",
  "Keep routines where possible, including meals, school, sleep, and trusted adults.",
  "Make room for mixed feelings. Love, anger, sadness, curiosity, and relief can all be real.",
  "Tell schools or caregivers only what is useful and safe for the child.",
  "Seek professional support when behavior or distress becomes concerning or feels hard to manage alone.",
];

export const firstHoursChecklist = [
  "Confirm the facility or court information using an official source.",
  "Write down the person’s full legal name, date of birth, and any known ID number.",
  "Keep a dated record of calls, names, and information you receive.",
  "Pause before paying or sharing account details with an unexpected caller.",
  "Learn the facility’s current rules for calls, mail, visits, and approved payments.",
  "Make a short list of household needs that cannot wait today.",
  "Decide what a child needs to know now, using simple and honest language.",
  "Reach out to one trusted person for practical or emotional support.",
  "Seek legal advice from a qualified source if you have a specific legal question or deadline.",
];

export const visitPreparationChecklist = [
  "Confirm the date, start time, arrival window, and visitation schedule directly with the facility.",
  "Check whether you are approved and whether children need separate approval or documentation.",
  "Bring the identification the facility requires.",
  "Review clothing, personal-item, and vehicle rules before leaving home.",
  "Plan transportation, parking, child care, and enough time for check-in.",
  "Pack only items the facility says are permitted.",
  "Prepare children for what may happen at check-in and who they can ask for help.",
  "Plan something gentle for after the visit, especially if emotions run high.",
];

export const facilityWorksheetFields = [
  "Facility name", "Facility phone number", "Mailing address", "Resident or inmate number", "Housing unit", "Approved communication provider", "Visitation scheduling method", "Account information location",
];

export const childAgeGuidance = [
  { label: "Young children", example: "An adaptable example: “They are away in a place where adults are helping keep things safe. You did nothing to cause this, and you can ask me questions anytime.”" },
  { label: "School-age children", example: "An adaptable example: “They are in jail or prison. It is an adult situation, and it is not your fault. We will tell you what we know when we know it.”" },
  { label: "Teens", example: "An adaptable example: “This can bring up a lot of feelings and questions. I will be honest about what I know, and you do not have to handle this by yourself.”" },
];
