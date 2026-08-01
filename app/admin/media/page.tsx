import { notFound } from "next/navigation";
import { MediaDesk } from "../../components/media/MediaDesk";

export default function AdminMediaPage() {
  // There is no administrator authentication in this frontend-only project.
  // Never expose the desk as a public production route until that changes.
  if (process.env.NODE_ENV === "production") notFound();
  return <MediaDesk />;
}
