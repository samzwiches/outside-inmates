import Link from "next/link";
import { SignOutButton } from "../../components/auth/SignOutButton";
import { ResourceAdminEditor, type AdminResourceRow } from "../../components/resources/ResourceAdminEditor";
import { requireAdmin } from "../../lib/auth";
import { getSupabaseAdminClient } from "../../lib/supabase/admin";
import { getSupabasePublicConfig } from "../../lib/supabase/config";

export const metadata = { title: "Resources Admin | Outside Inmates", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ResourcesAdminPage() {
  await requireAdmin("/admin/resources");
  const client = getSupabaseAdminClient();
  const { data } = await client.from("resources").select("id,name,slug,short_description,full_description,categories,services,eligibility,location,city,state,zip_code,service_area,phone,website,email,hours,cost,service_area_type,verification_status,source_url,source_type,review_notes,verified_date,status,published,featured,free_or_low_cost").order("name");
  const resources = (data ?? []) as AdminResourceRow[];
  const config = getSupabasePublicConfig();
  return <main className="admin-shell"><div className="container admin-topline"><Link className="wordmark" href="/" aria-label="Outside Inmates home">Outside <em>Inmates</em></Link><div className="admin-topline-actions"><Link className="quiet-link" href="/admin">Admin home <span aria-hidden="true">→</span></Link><SignOutButton config={config} /></div></div><ResourceAdminEditor resources={resources} /></main>;
}
