"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../../lib/supabase/browser";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "error"; message: string }>({ kind: "idle", message: "" });
  const configured = isSupabaseBrowserConfigured();

  async function signIn(formData: FormData) {
    if (!configured) return;
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
      setStatus({ kind: "error", message: "Enter your email address and password." });
      return;
    }
    setStatus({ kind: "saving", message: "Signing in…" });
    const { error } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (error) {
      setStatus({ kind: "error", message: "We could not sign you in with those details." });
      return;
    }
    const next = searchParams.get("next");
    router.refresh();
    router.replace(next?.startsWith("/") ? next : "/admin");
  }

  if (!configured) return <div className="auth-setup-note"><p className="eyebrow">Setup required</p><h2>Admin sign-in is not connected yet.</h2><p>This environment needs its own Outside Inmates Supabase URL and anonymous key before an administrator can sign in. Follow <code>docs/SUPABASE_SETUP.md</code>; no credentials are stored in this repository.</p></div>;

  return <form className="auth-form" action={signIn}>
    <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
    {status.kind !== "idle" ? <p className={`auth-status ${status.kind === "error" ? "is-error" : ""}`} role="status">{status.message}</p> : null}
    <button className="button button-primary" type="submit" disabled={status.kind === "saving"}>{status.kind === "saving" ? "Signing in…" : "Sign in"}</button>
  </form>;
}
