import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Health Care and Medications | Outside Inmates", description: "A planning guide for health care, medications, and recovery support after release." };
export default function HealthPage() { return <ReentryPageLayout slug="health" />; }
