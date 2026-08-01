import type { Metadata } from "next";
import { JourneyPageLayout } from "../../components/journeys/JourneyPageLayout";

export const metadata: Metadata = { title: "Preparing for coming home | Outside Inmates", description: "A guided bridge for preparing for release and the first week home." };

export default function ComingHomeJourneyPage() { return <JourneyPageLayout slug="coming-home" />; }
