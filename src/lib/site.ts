import type { Metadata } from "next";
import type { SiteConfig } from "@/types";

/**
 * Central site configuration consumed by metadata, OpenGraph, Twitter,
 * sitemap and robots. Keep content/branding here — never hardcode in UI.
 */
export const siteConfig: SiteConfig = {
  name: "Bindra Knowledge Hub",
  shortName: "Bindra Hub",
  tagline: "Where curiosity becomes confidence.",
  description:
    "Bindra Knowledge Hub is a modern, student-first academy helping learners build strong foundations, clarity, and confidence for a brighter future.",
  url: "https://www.bindraknowledgehub.com",
  locale: "en_IN",
  themeColor: "#B45309",
  twitterHandle: "@bindraknowledgehub",
  contact: {
    email: "hello@bindraknowledgehub.com",
    phone: "+91 00000 00000",
    address: "123 Learning Lane, City, State, India",
  },
  social: {
    instagram: "https://instagram.com/bindraknowledgehub",
    facebook: "https://facebook.com/bindraknowledgehub",
    youtube: "https://youtube.com/@bindraknowledgehub",
    linkedin: "https://linkedin.com/company/bindraknowledgehub",
  },
  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Courses", href: "/courses" },
    { title: "Faculty", href: "/faculty" },
    { title: "Results", href: "/results" },
    { title: "Gallery", href: "/gallery" },
    { title: "Testimonials", href: "/testimonials" },
    { title: "Admissions", href: "/admissions" },
    { title: "Contact", href: "/contact" },
  ],
};

/**
 * Default metadata template applied to every route via the root layout.
 * Individual pages override title/description through `generateMetadata`
 * or the `metadata` export.
 */
export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  const title = overrides?.title
    ? `${overrides.title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  const description = overrides?.description ?? siteConfig.description;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: { telephone: true, email: true, address: true },
    alternates: {
      canonical: overrides?.alternates?.canonical ?? "/",
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title,
      description,
      ...overrides?.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      ...overrides?.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    ...overrides,
  };
}
