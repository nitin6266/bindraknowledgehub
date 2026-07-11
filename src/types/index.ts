/**
 * Shared domain & UI types. Keeping types centralized avoids drift between
 * content, data and components. No `any` is used anywhere in this project.
 */

export interface NavItem {
  title: string;
  href: string;
  /** Optional badge label, e.g. "New" (reserved for future use). */
  badge?: string;
  /** When true, link is rendered as external (new tab). */
  external?: boolean;
}

export interface SocialLink {
  platform: "instagram" | "facebook" | "youtube" | "linkedin";
  label: string;
  href: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  themeColor: string;
  twitterHandle: string;
  contact: ContactInfo;
  social: Record<"instagram" | "facebook" | "youtube" | "linkedin", string>;
  nav: NavItem[];
}

/** Generic content record shape for pages until real content is authored. */
export interface PageMeta {
  slug: string;
  title: string;
  description: string;
  status: "coming-soon" | "draft" | "published";
}
