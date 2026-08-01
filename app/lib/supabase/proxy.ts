import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

/**
 * Refreshes Supabase's cookie session before Server Components and route
 * handlers read it. The request and response cookie stores stay in sync.
 */
export async function updateSupabaseSession(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.next({ request });

  const secure = request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:";
  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.anonKey, {
    cookieOptions: { path: "/", sameSite: "lax", secure },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
