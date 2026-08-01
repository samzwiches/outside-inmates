import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Your First Week Home | Outside Inmates", description: "A calm, practical guide for release day and the first week home." };
export default function FirstWeekPage() { return <ReentryPageLayout slug="first-week" />; }
