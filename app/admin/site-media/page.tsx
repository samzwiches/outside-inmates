import Link from "next/link";
import { SignOutButton } from "../../components/auth/SignOutButton";
import { SiteMediaEditor } from "../../components/media/SiteMediaEditor";
import { requireAdmin } from "../../lib/auth";
import { getSupabasePublicConfig } from "../../lib/supabase/config";
import { getAppearancesForAdmin, getSiteMediaForAdmin } from "../../lib/site-media-server";

export const metadata = { title: "Media + Appearance | Outside Inmates", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SiteMediaAdminPage() {
  await requireAdmin("/admin/site-media");
  const [media, appearances] = await Promise.all([getSiteMediaForAdmin(), getAppearancesForAdmin()]);
  return <main className="admin-shell"><div className="container admin-topline"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><div className="admin-topline-actions"><Link className="quiet-link" href="/admin">Admin home <span aria-hidden="true">→</span></Link><SignOutButton config={getSupabasePublicConfig()} /></div></div><SiteMediaEditor media={media} appearances={appearances} /></main>;
}
