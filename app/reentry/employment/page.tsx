import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Finding Work After Incarceration | Outside Inmates", description: "Practical employment and education guidance for reentry." };
export default function EmploymentPage() { return <ReentryPageLayout slug="employment" />; }
