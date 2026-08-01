import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Understanding Supervision | Outside Inmates", description: "A general guide for organizing supervision questions and official instructions." };
export default function SupervisionPage() { return <ReentryPageLayout slug="supervision" />; }
