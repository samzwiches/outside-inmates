import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Finding Safe Housing | Outside Inmates", description: "Grounded questions for housing after incarceration." };
export default function HousingPage() { return <ReentryPageLayout slug="housing" />; }
