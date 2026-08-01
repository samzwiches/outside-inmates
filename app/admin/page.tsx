import Link from "next/link";
import { SignOutButton } from "../components/auth/SignOutButton";
import { requireAdmin } from "../lib/auth";
import { getSupabasePublicConfig } from "../lib/supabase/config";

export const metadata = { title: "Admin | Outside Inmates", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  return <main className="admin-shell"><div className="container admin-topline"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><SignOutButton config={getSupabasePublicConfig()} /></div><div className="container admin-home"><p className="eyebrow">Outside Inmates administration</p><h1>A focused place to care for the site.</h1><p>Media and presentation controls are intentionally limited to approved site locations. They do not change page copy, navigation, layouts, or resource content.</p><Link className="button button-primary" href="/admin/site-media">Open Media + Appearance <span aria-hidden="true">→</span></Link></div></main>;
}
