import type { Metadata } from "next";
import { JourneyPageLayout } from "../../components/journeys/JourneyPageLayout";

export const metadata: Metadata = { title: "Rebuilding after incarceration | Outside Inmates", description: "A respectful, practical path for documents, housing, work, health, and daily life." };

export default function RebuildingJourneyPage() { return <JourneyPageLayout slug="rebuilding" />; }
