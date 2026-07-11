"use client";

import dynamic from "next/dynamic";

/**
 * Client-only site affordances. Code-split via dynamic import (ssr: false)
 * so the back-to-top control and cookie banner stay out of the initial
 * server payload and the critical render path.
 */
const BackToTop = dynamic(
  () => import("@/components/utility/back-to-top").then((m) => m.BackToTop),
  { ssr: false },
);

const CookieConsent = dynamic(
  () => import("@/components/utility/cookie-consent").then((m) => m.CookieConsent),
  { ssr: false },
);

export function SiteOverlays() {
  return (
    <>
      <BackToTop />
      <CookieConsent />
    </>
  );
}
