import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./journeys.css";
import "./media.css";
import "./reentry.css";
import "./organization.css";
import "./auth.css";
import "./community.css";
import "./resource-submit.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : undefined;

  return {
    metadataBase,
    title: "Outside Inmates | Resources, answers, and community",
    description: "A calm, practical place to find resources, answers, and community through incarceration and reentry.",
    openGraph: {
      title: "Outside Inmates",
      description: "Support does not stop at the prison gate.",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Outside Inmates",
      description: "Support does not stop at the prison gate.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
