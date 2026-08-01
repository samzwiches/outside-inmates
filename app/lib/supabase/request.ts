import type { NextRequest } from "next/server";

const localFallbackUrl = "http://localhost:3000";

function normalizeUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function getPublicSiteUrl() {
  return normalizeUrl(process.env.SITE_URL) ?? normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? new URL(localFallbackUrl);
}

/**
 * Uses the actual request host for the configured production domain and local
 * development. Unrecognised Host headers cannot become redirect targets.
 */
export function getRequestOrigin(request: NextRequest) {
  const configuredUrl = getPublicSiteUrl();
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const candidate = host ? normalizeUrl(protocol + "://" + host) : null;

  if (!candidate) return configuredUrl.origin;

  const isConfiguredHost = candidate.host === configuredUrl.host;
  const isLocalHost = candidate.hostname === "localhost" || candidate.hostname === "127.0.0.1";
  return isConfiguredHost || isLocalHost ? candidate.origin : configuredUrl.origin;
}

export function safeAdminPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value.startsWith("/admin") ? value : "/admin";
}
