import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

/** Service-role client. Import only from server code and never expose it to a client component. */
export function getSupabaseAdminClient() {
  const config = getSupabaseConfig();
  if (!config?.serviceRoleKey) throw new Error("The Supabase service role is not configured.");
  return createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}
