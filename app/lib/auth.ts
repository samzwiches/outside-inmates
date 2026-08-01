import { redirect } from "next/navigation";
import { safeAdminPath } from "./supabase/request";
import { createSupabaseServerClient } from "./supabase/server";

export type CurrentAdmin = { id: string; email: string | null };
type AdminState = {
  admin: CurrentAdmin | null;
  reason: "missing-session" | "not-authorized" | "session-unavailable" | null;
};

async function getAdminState(): Promise<AdminState> {
  const client = await createSupabaseServerClient();
  if (!client) return { admin: null, reason: "session-unavailable" };

  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError) {
    const missingSession = userError.name === "AuthSessionMissingError" || userError.message === "Auth session missing!";
    return { admin: null, reason: missingSession ? "missing-session" : "session-unavailable" };
  }
  if (!user) return { admin: null, reason: "missing-session" };

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) return { admin: null, reason: "session-unavailable" };
  return profile?.role === "admin"
    ? { admin: { id: user.id, email: user.email ?? null }, reason: null }
    : { admin: null, reason: "not-authorized" };
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  return (await getAdminState()).admin;
}

/** Admin route guard. It never reveals whether a particular account is an administrator. */
export async function requireAdmin(nextPath = "/admin") {
  const state = await getAdminState();
  if (!state.admin) {
    const search = new URLSearchParams({ next: safeAdminPath(nextPath) });
    if (state.reason === "not-authorized") search.set("status", "access-denied");
    else if (state.reason === "missing-session") search.set("status", "sign-in-required");
    else if (state.reason === "session-unavailable") search.set("status", "session-unavailable");
    redirect("/sign-in?" + search.toString());
  }
  return state.admin;
}
