import type { Metadata, Viewport } from "next";
import { buildMetadata, siteConfig } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyBottomCta } from "@/components/layout/sticky-cta";
import { PageTransition } from "@/components/animations/page-transition";
import { SiteOverlays } from "@/components/layout/site-chrome";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
      />

      <Navbar />

      <main id="main" className="flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
      <StickyBottomCta />

      <SiteOverlays />
    </div>
  );
}
