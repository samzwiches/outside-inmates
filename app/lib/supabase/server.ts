import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { getSupabaseConfig } from "./config";

/** Reads the browser's SSR cookies. The request proxy handles refresh writes. */
export async function createSupabaseServerClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const secure = requestHeaders.get("x-forwarded-proto") === "https";
  return createServerClient(config.url, config.anonKey, {
    cookieOptions: { path: "/", sameSite: "lax", secure },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; the request proxy persists refreshes.
        }
      },
    },
  });
}
