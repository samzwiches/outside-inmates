import type { Metadata } from "next";
import { JourneyPageLayout } from "../../components/journeys/JourneyPageLayout";

export const metadata: Metadata = { title: "Helping someone practically | Outside Inmates", description: "Guidance for family, friends, advocates, employers, volunteers, and providers." };

export default function SupportingSomeoneJourneyPage() { return <JourneyPageLayout slug="supporting-someone" />; }
