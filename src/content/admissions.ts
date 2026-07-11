/**
 * Admissions page content — copy lives here, never inside UI components.
 * Server components read these values to compose the /admissions route.
 */

export const admissionsContent = {
  hero: {
    eyebrow: "Begin your journey",
    title: "Admissions that start with a conversation",
    subtitle:
      "Joining Bindra Knowledge Hub is simple and personal. Explore our process, book a free demo, and tell us about your child — we’ll help you find the right path.",
    ctaLabel: "Start your enquiry",
    ctaHref: "#enquiry",
  },
  journey: {
    eyebrow: "How it works",
    title: "Your admission journey in four warm steps",
    intro:
      "We keep things clear so families always know what comes next. Every step is designed to put your child’s needs first.",
    steps: [
      {
        title: "Connect with us",
        description:
          "Reach out through the enquiry form or a free demo call. We listen first to understand your child’s goals.",
      },
      {
        title: "Free academic assessment",
        description:
          "A gentle, no-pressure assessment helps us understand strengths, gaps and the best way to support learning.",
      },
      {
        title: "Personalised plan",
        description:
          "We recommend the right batch, mentor and course fit — never a one-size-fits-all package.",
      },
      {
        title: "Welcome to the hub",
        description:
          "Onboarding is warm and structured. Your child joins a small, caring cohort built for confidence.",
      },
    ],
  },
  demo: {
    eyebrow: "Step 1",
    title: "Book a free demo class",
    description:
      "See how our mentors teach before you decide. A 30-minute demo is the easiest way to feel the Bindra difference — completely free, no obligation.",
    ctaLabel: "Book a free demo",
    ctaHref: "https://wa.me/910000000000?text=Hi%20Bindra%20Knowledge%20Hub,%20I'd%20like%20to%20book%20a%20free%20demo%20class.",
  },
  assessment: {
    eyebrow: "Step 2",
    title: "Free academic assessment",
    description:
      "Every child learns differently. Our free assessment maps your child’s current level and learning style so we can place them where they’ll thrive.",
    ctaLabel: "Request free assessment",
    ctaHref: "#enquiry",
  },
  enquiry: {
    eyebrow: "Enquire now",
    title: "Admission enquiry form",
    description:
      "Tell us a little about your child and we’ll get back within one working day. Fields marked with * are required.",
  },
  academy: {
    eyebrow: "Why families choose us",
    title: "The Bindra Knowledge Hub advantage",
    intro:
      "Small batches, caring mentors and a curriculum built around clarity — here is what makes our academy feel like home.",
    items: [
      {
        title: "Small, focused batches",
        description:
          "Limited class sizes mean every student is seen, heard and supported individually.",
      },
      {
        title: "Mentors who care",
        description:
          "Our faculty mentor beyond the syllabus — building confidence, not just marks.",
      },
      {
        title: "Progress you can see",
        description:
          "Regular feedback and assessments keep parents informed at every step.",
      },
      {
        title: "Flexible learning modes",
        description:
          "Choose offline campus learning or live online sessions that fit your routine.",
      },
    ],
  },
  visit: {
    eyebrow: "Come say hello",
    title: "Visit our campus",
    description:
      "The best way to feel our warmth is to walk in. Schedule a visit and meet the mentors who’ll guide your child.",
  },
  faq: {
    eyebrow: "Good to know",
    title: "Frequently asked questions",
    items: [
      {
        question: "What is the right age or grade to join?",
        answer:
          "We welcome learners across school grades and a range of subjects. Share your child’s current grade in the enquiry form and we’ll suggest the best fit.",
      },
      {
        question: "Is the demo class really free?",
        answer:
          "Yes. The first demo class and academic assessment are completely free with no obligation to enrol.",
      },
      {
        question: "Do you offer online classes?",
        answer:
          "We do. You can choose offline campus learning or live online sessions — whichever suits your family’s schedule.",
      },
      {
        question: "How soon will we hear back after enquiring?",
        answer:
          "Our team responds to every enquiry within one working day, usually much sooner during school hours.",
      },
      {
        question: "What documents are needed to enrol?",
        answer:
          "Once we confirm the right course, we’ll guide you through a simple onboarding with basic student details. No complex paperwork.",
      },
    ],
  },
  finalCta: {
    title: "Your child’s brighter beginning starts here",
    description:
      "Book a free demo or send an enquiry today — we’re excited to meet your family.",
    primaryLabel: "Book a free demo",
    primaryHref:
      "https://wa.me/910000000000?text=Hi%20Bindra%20Knowledge%20Hub,%20I'd%20like%20to%20book%20a%20free%20demo%20class.",
    secondaryLabel: "Send an enquiry",
    secondaryHref: "#enquiry",
  },
} as const;
