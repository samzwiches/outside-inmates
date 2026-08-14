"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileStartAnchor() {
  const pathname = usePathname();
  const hidden = pathname === "/" || pathname === "/start" || pathname.startsWith("/admin") || pathname.startsWith("/auth");

  if (hidden) return null;

  return (
    <Link className="mobile-start-anchor" href="/start" aria-label="Back to Start Here">
      <span aria-hidden="true">←</span>
      <span>Back to Start</span>
    </Link>
  );
}
