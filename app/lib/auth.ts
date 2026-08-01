import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export type CurrentAdmin = { id: string; email: string | null };

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const client = await createSupabaseServerClient();
  if (!client) return null;

  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;

  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.role === "admin" ? { id: user.id, email: user.email ?? null } : null;
}

/** Admin route guard. It never reveals whether a particular account is an administrator. */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/sign-in?next=/admin");
  return admin;
}
