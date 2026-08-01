"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, type BrowserSupabaseConfig } from "../../lib/supabase/browser";

export function SignOutButton({ config }: { config: BrowserSupabaseConfig | null }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    try {
      await fetch("/auth/sign-out", { method: "POST", credentials: "same-origin" });
      if (config) await createSupabaseBrowserClient(config).auth.signOut({ scope: "local" });
    } finally {
      router.replace("/sign-in?status=signed-out");
      router.refresh();
    }
  }

  return <button className="quiet-link sign-out-button" type="button" onClick={signOut} disabled={isSigningOut}>{isSigningOut ? "Signing out…" : "Sign out"}</button>;
}
