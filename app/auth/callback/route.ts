import { NextResponse, type NextRequest } from "next/server";
import { getRequestOrigin, safeAdminPath } from "../../lib/supabase/request";
import { createSupabaseRouteClient } from "../../lib/supabase/route-client";

export async function GET(request: NextRequest) {
  const next = safeAdminPath(request.nextUrl.searchParams.get("next"));
  const origin = getRequestOrigin(request);
  const destination = new URL(next, origin);
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  const client = createSupabaseRouteClient(request, response);
  const code = request.nextUrl.searchParams.get("code");

  if (!client || !code) {
    const failedResponse = NextResponse.redirect(new URL("/sign-in?status=session-unavailable", origin));
    failedResponse.headers.set("Cache-Control", "private, no-store");
    return failedResponse;
  }

  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) {
    response.headers.set("location", new URL("/sign-in?status=session-unavailable", origin).toString());
  }

  return response;
}
