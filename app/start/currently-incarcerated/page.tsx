import type { Metadata } from "next";
import { JourneyPageLayout } from "../../components/journeys/JourneyPageLayout";

export const metadata: Metadata = { title: "Managing incarceration from the outside | Outside Inmates", description: "Guidance for communication, family life, boundaries, and support while a loved one is incarcerated." };

export default function CurrentlyIncarceratedJourneyPage() { return <JourneyPageLayout slug="currently-incarcerated" />; }
