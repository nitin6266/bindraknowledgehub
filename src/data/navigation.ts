import type { SocialLink, NavItem } from "@/types";

/**
 * Static data that supports the UI. Kept separate from components so it can
 * later be migrated to a CMS or API without touching presentation logic.
 */

export const socialLinks: SocialLink[] = [
  { platform: "instagram", label: "Instagram", href: "https://instagram.com/bindraknowledgehub" },
  { platform: "facebook", label: "Facebook", href: "https://facebook.com/bindraknowledgehub" },
  { platform: "youtube", label: "YouTube", href: "https://youtube.com/@bindraknowledgehub" },
  { platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/bindraknowledgehub" },
];

/** Footer quick-link groups (content-driven, not hardcoded in the component). */
export const footerQuickLinks: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Academy",
    items: [
      { title: "About", href: "/about" },
      { title: "Faculty", href: "/faculty" },
      { title: "Results", href: "/results" },
    ],
  },
  {
    heading: "Programs",
    items: [
      { title: "Courses", href: "/courses" },
      { title: "Admissions", href: "/admissions" },
      { title: "Gallery", href: "/gallery" },
    ],
  },
  {
    heading: "Community",
    items: [
      { title: "Testimonials", href: "/testimonials" },
      { title: "Contact", href: "/contact" },
    ],
  },
];
