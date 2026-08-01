import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseRouteClient } from "../../lib/supabase/route-client";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  const client = createSupabaseRouteClient(request, response);
  if (client) await client.auth.signOut({ scope: "local" });
  return response;
}
