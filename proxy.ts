import { type NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "./app/lib/supabase/proxy";

const PUBLIC_HOSTS = new Set([
  "outsideinmates.com",
  "www.outsideinmates.com",
]);

export async function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_HOSTS.has(hostname) && pathname !== "/coming-soon") {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
