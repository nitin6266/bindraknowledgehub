import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { buildMetadata, siteConfig } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

import { ThemeProvider, themeNoFlashScript } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyBottomCta } from "@/components/layout/sticky-cta";
import { PageTransition } from "@/components/animations/page-transition";
import { SiteOverlays } from "@/components/layout/site-chrome";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, plusJakarta.variable, fraunces.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <ThemeProvider>
          <Navbar />

          <main id="main" className="flex-1 pt-16">
            <PageTransition>{children}</PageTransition>
          </main>

          <Footer />
          <StickyBottomCta />
        </ThemeProvider>

        <SiteOverlays />
      </body>
    </html>
  );
}
