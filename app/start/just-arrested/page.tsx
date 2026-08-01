import type { Metadata } from "next";
import { JourneyPageLayout } from "../../components/journeys/JourneyPageLayout";

export const metadata: Metadata = { title: "Someone I love was just arrested | Outside Inmates", description: "A calm first-days path for families after an arrest." };

export default function JustArrestedJourneyPage() { return <JourneyPageLayout slug="just-arrested" />; }
