import Link from "next/link";
import { SiteMediaEditor } from "../../components/media/SiteMediaEditor";
import { requireAdmin } from "../../lib/auth";
import { getAppearancesForAdmin, getSiteMediaForAdmin } from "../../lib/site-media-server";

export const metadata = { title: "Media + Appearance | Outside Inmates", robots: { index: false, follow: false } };

export default async function SiteMediaAdminPage() {
  await requireAdmin();
  const [media, appearances] = await Promise.all([getSiteMediaForAdmin(), getAppearancesForAdmin()]);
  return <main className="admin-shell"><div className="container admin-topline"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><Link className="quiet-link" href="/admin">Admin home <span aria-hidden="true">→</span></Link></div><SiteMediaEditor media={media} appearances={appearances} /></main>;
}
