import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Identification and Documents | Outside Inmates", description: "A practical document tracker and guide for reentry." };
export default function DocumentsPage() { return <ReentryPageLayout slug="documents" />; }
