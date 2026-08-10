import Link from "next/link";
import { SignOutButton } from "../../components/auth/SignOutButton";
import { SiteCardEditor } from "../../components/cards/SiteCardEditor";
import { siteCardRegistry } from "../../data/card-registry";
import { requireAdmin } from "../../lib/auth";
import { getSiteCardsForAdmin } from "../../lib/site-card-server";
import { getSupabasePublicConfig } from "../../lib/supabase/config";

export const metadata = { title: "Cards | Outside Inmates", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CardsAdminPage() {
  await requireAdmin("/admin/cards");
  const saved = await getSiteCardsForAdmin();
  const config = getSupabasePublicConfig();
  return <main className="admin-shell"><div className="container admin-topline"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><div className="admin-topline-actions"><Link className="quiet-link" href="/admin">Admin home <span aria-hidden="true">→</span></Link><SignOutButton config={config} /></div></div><SiteCardEditor definitions={siteCardRegistry} saved={saved} supabaseConfig={config} /></main>;
}
