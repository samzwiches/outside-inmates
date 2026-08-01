import type { Metadata } from "next";
import { JourneyPageLayout } from "../../components/journeys/JourneyPageLayout";
import { JourneySelector } from "../../components/journeys/JourneySelector";

export const metadata: Metadata = { title: "I do not know where to start | Outside Inmates", description: "A private, on-page guide for finding a useful starting point." };

export default function NotSureJourneyPage() { return <JourneyPageLayout slug="not-sure"><JourneySelector /></JourneyPageLayout>; }
