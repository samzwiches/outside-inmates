"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileStartAnchor() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  const showStart = pathname !== "/" && pathname !== "/start";

  if (hidden) return null;

  function leaveSite() {
    window.location.replace("https://www.google.com/");
  }

  return (
    <nav className="mobile-safety-nav" aria-label="Quick navigation">
      {showStart ? (
        <Link className="mobile-start-anchor" href="/start" aria-label="Back to Start Here">
          <span aria-hidden="true">←</span>
          <span>Start here</span>
        </Link>
      ) : null}
      <button className="mobile-quick-exit" type="button" onClick={leaveSite}>
        Leave site
      </button>
    </nav>
  );
}
