import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { buildMetadata, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyBottomCta } from "@/components/layout/sticky-cta";
import { PageTransition } from "@/components/animations/page-transition";

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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.address,
    addressCountry: "IN",
  },
  sameAs: Object.values(siteConfig.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, plusJakarta.variable, fraunces.variable)}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main" className="flex-1 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
        <StickyBottomCta />
      </body>
    </html>
  );
}
