import { createServerClient } from "@supabase/ssr";
import { type NextRequest, type NextResponse } from "next/server";
import { getSupabaseConfig } from "./config";

/** Creates a route client whose cookie changes are attached to its response. */
export function createSupabaseRouteClient(request: NextRequest, response: NextResponse) {
  const config = getSupabaseConfig();
  if (!config) return null;

  const secure = request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:";
  return createServerClient(config.url, config.anonKey, {
    cookieOptions: { path: "/", sameSite: "lax", secure },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
}
