"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient, type BrowserSupabaseConfig } from "../../lib/supabase/browser";

function statusMessage(status: string | null) {
  if (status === "access-denied") return "You are signed in, but this account cannot access administration.";
  if (status === "sign-in-required") return "Sign in to continue.";
  if (status === "session-unavailable") return "We could not confirm your session. Please sign in again.";
  if (status === "signed-out") return "You have been signed out.";
  return null;
}

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

export function SignInForm({ config }: { config: BrowserSupabaseConfig | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "error"; message: string }>({ kind: "idle", message: "" });
  const configured = Boolean(config);

  async function signIn(formData: FormData) {
    if (!config) return;

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
      setStatus({ kind: "error", message: "Enter your email address and password." });
      return;
    }

    setStatus({ kind: "saving", message: "Signing in…" });
    try {
      const { data, error } = await createSupabaseBrowserClient(config).auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        setStatus({ kind: "error", message: "We could not sign you in with those details." });
        return;
      }
    } catch {
      setStatus({ kind: "error", message: "We could not sign you in with those details." });
      return;
    }

    const next = safeNextPath(searchParams.get("next"));
    router.refresh();
    router.replace(next);
  }

  if (!configured) return <div className="auth-setup-note"><p className="eyebrow">Setup required</p><h2>Sign in is not connected yet.</h2><p>This environment needs its Outside Inmates Supabase URL and anonymous key before anyone can sign in. Follow <code>docs/SUPABASE_SETUP.md</code>; no credentials are stored in this repository.</p></div>;

  const message = statusMessage(searchParams.get("status"));
  const statusClass = status.kind === "error" ? "auth-status is-error" : "auth-status";

  return <form className="auth-form" action={signIn}>
    <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
    {message ? <p className="auth-status" role="status">{message}</p> : null}
    {status.kind !== "idle" ? <p className={statusClass} role="status">{status.message}</p> : null}
    <button className="button button-primary" type="submit" disabled={status.kind === "saving"}>{status.kind === "saving" ? "Signing in…" : "Sign in"}</button>
  </form>;
}
