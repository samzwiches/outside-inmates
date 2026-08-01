import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/auth";

export default async function AdminMediaPage() {
  await requireAdmin("/admin/site-media");
  redirect("/admin/site-media");
}
