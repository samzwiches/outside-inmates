import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { MobileStartAnchor } from "./components/MobileStartAnchor";
import "./globals.css";
import "./journeys.css";
import "./media.css";
import "./reentry.css";
import "./organization.css";
import "./about-polish.css";
import "./auth.css";
import "./community.css";
import "./community-preview.css";
import "./resource-submit.css";
import "./resource-panel.css";
import "./breadcrumb-contrast.css";
import "./hero-sizing.css";
import "./ui-consistency.css";
import "./transparency-punch.css";
import "./privacy.css";
import "./contact.css";
import "./family-card-polish.css";
import "./card-editor.css";
import "./editable-card-image-consistency.css";
import "./home-card-consistency.css";
import "./justice.css";
import "./resource-admin.css";
import "./mobile-urgency.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : undefined;

  return {
    metadataBase,
    title: "Outside Inmates | Resources, answers, and community",
    description: "A calm, practical place to find resources, answers, and community through incarceration and reentry.",
    openGraph: { title: "Outside Inmates", description: "Support does not stop at the prison gate.", images: ["/og.png"] },
    twitter: { card: "summary_large_image", title: "Outside Inmates", description: "Support does not stop at the prison gate.", images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<MobileStartAnchor /></body></html>;
}
