import Link from "next/link";
import { SignInForm } from "../components/auth/SignInForm";
import { getSupabasePublicConfig } from "../lib/supabase/config";

export const metadata = { title: "Sign in | Outside Inmates", robots: { index: false, follow: false } };

export default function SignInPage() {
  return <main className="auth-page"><div className="auth-card"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><p className="eyebrow">Member access</p><h1>Sign in to join the conversation.</h1><p>Use your Outside Inmates account to ask questions, reply to discussions, or open the administration desk if your account has editor access.</p><SignInForm config={getSupabasePublicConfig()} /><Link className="quiet-link" href="/community">Return to the community <span aria-hidden="true">→</span></Link></div></main>;
}
