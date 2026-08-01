import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/auth";

export default async function AdminMediaPage() {
  await requireAdmin();
  redirect("/admin/site-media");
}
