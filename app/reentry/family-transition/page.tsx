import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Preparing the Household | Outside Inmates", description: "Grounded guidance for family and household transition after release." };
export default function FamilyTransitionPage() { return <ReentryPageLayout slug="family-transition" />; }
