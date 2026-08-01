import Link from "next/link";
import { SignInForm } from "../components/auth/SignInForm";
import { getSupabasePublicConfig } from "../lib/supabase/config";

export const metadata = { title: "Sign in | Outside Inmates", robots: { index: false, follow: false } };

export default function SignInPage() {
  return <main className="auth-page"><div className="auth-card"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><p className="eyebrow">Administrator access</p><h1>Sign in to the media desk.</h1><p>Use the account created for Outside Inmates administration. This sign-in does not indicate whether an account has editor access.</p><SignInForm config={getSupabasePublicConfig()} /><Link className="quiet-link" href="/">Return to the site <span aria-hidden="true">→</span></Link></div></main>;
}
