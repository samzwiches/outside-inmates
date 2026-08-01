"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabasePublicConfig } from "./types";

export type BrowserSupabaseConfig = SupabasePublicConfig;

export function createSupabaseBrowserClient(config: BrowserSupabaseConfig) {
  return createBrowserClient(config.url, config.anonKey, {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    },
  });
}
