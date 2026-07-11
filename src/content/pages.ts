import type { PageMeta } from "@/types";

/**
 * Page content registry. UI components read from here so copy is never
 * hardcoded. During Sprint 1 these pages are placeholders ("coming-soon").
 * Sprint 2+ will replace bodies with real, authored content.
 */
const pagesData = {
  home: {
    slug: "/",
    title: "Home",
    description:
      "Bindra Knowledge Hub — a modern, student-first academy building confidence and clarity for every learner.",
    status: "coming-soon",
  },
  about: {
    slug: "/about",
    title: "About Us",
    description:
      "Our story, mission and the family-driven values that make Bindra Knowledge Hub a place where students thrive.",
    status: "published",
  },
  courses: {
    slug: "/courses",
    title: "Courses",
    description:
      "Explore thoughtfully designed courses that build strong academic foundations across grades and subjects.",
    status: "published",
  },
  faculty: {
    slug: "/faculty",
    title: "Faculty",
    description:
      "Meet the dedicated educators who guide, mentor and inspire every student at Bindra Knowledge Hub.",
    status: "coming-soon",
  },
  results: {
    slug: "/results",
    title: "Results",
    description:
      "Celebrating the achievements, milestones and success stories of our students.",
    status: "coming-soon",
  },
  gallery: {
    slug: "/gallery",
    title: "Gallery",
    description:
      "A glimpse into campus life, classrooms and moments that make learning joyful.",
    status: "coming-soon",
  },
  testimonials: {
    slug: "/testimonials",
    title: "Testimonials",
    description:
      "Hear from students and parents about their Bindra Knowledge Hub experience.",
    status: "coming-soon",
  },
  contact: {
    slug: "/contact",
    title: "Contact",
    description:
      "Get in touch with Bindra Knowledge Hub — visits, enquiries and admissions questions welcome.",
    status: "coming-soon",
  },
  admissions: {
    slug: "/admissions",
    title: "Admissions",
    description:
      "Begin your journey with us. Learn about the admissions process, requirements and timelines.",
    status: "coming-soon",
  },
} satisfies Record<string, PageMeta>;

export const pages = pagesData;
