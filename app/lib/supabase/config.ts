import type { SupabasePublicConfig } from "./types";

export type SupabaseConfig = SupabasePublicConfig & {
  serviceRoleKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  // Server aliases remain runtime values on this host. NEXT_PUBLIC fallbacks
  // keep local development simple, where Vinext exposes public variables.
  const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;
  return { url, anonKey, serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined };
}

/** Server-only runtime values passed to the browser sign-in component. */
export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const config = getSupabaseConfig();
  return config ? { url: config.url, anonKey: config.anonKey } : null;
}

export function hasSupabaseServiceRole() {
  return Boolean(getSupabaseConfig()?.serviceRoleKey);
}
