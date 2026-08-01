import type { Metadata } from "next";
import { ReentryPageLayout } from "../../components/reentry/ReentryPageLayout";

export const metadata: Metadata = { title: "Transportation Planning | Outside Inmates", description: "A practical guide for essential trips, release-day pickup, and transportation support." };
export default function TransportationPage() { return <ReentryPageLayout slug="transportation" />; }
