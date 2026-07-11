/**
 * Courses page content. Separated from UI per AGENTS.md so copy can move to
 * a CMS later. Conversion-focused, trustworthy copy for parents.
 */

export interface OverviewCard {
  title: string;
  meta: string;
  description: string;
  href: string;
}

export interface SubjectCard {
  title: string;
  description: string;
  level: string;
}

export interface FeatureItem {
  icon: "bulb" | "user" | "clipboard" | "users" | "message" | "smile";
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const coursesContent = {
  hero: {
    eyebrow: "Our Programs",
    title: "Programs Designed for Every Stage of Learning",
    subtitle:
      "From strong academic foundations in primary classes to focused board exam preparation for senior students, our programs are designed to help every learner succeed with confidence.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Talk to an Academic Counsellor",
    secondaryHref: "/contact",
  },
  overview: {
    eyebrow: "Program Overview",
    title: "Find the right fit for your child",
    cards: [
      {
        title: "Junior Classes",
        meta: "Class 3–10",
        description: "All Subjects",
        href: "/admissions",
      },
      {
        title: "Chemistry",
        meta: "Class 11–12",
        description: "Board & Competitive Preparation",
        href: "/admissions",
      },
      {
        title: "Physics",
        meta: "Class 11–12",
        description: "Concept-Based Learning",
        href: "/admissions",
      },
      {
        title: "Online International Batches",
        meta: "Flexible",
        description: "Flexible learning for students across India and abroad.",
        href: "/contact",
      },
    ] satisfies OverviewCard[],
  },
  junior: {
    eyebrow: "Junior Program",
    title: "Building confident learners in Class 3–10",
    intro:
      "Our junior program focuses on clarity and consistency — helping younger students enjoy learning while building the habits that lead to long-term success.",
    features: [
      "Concept building that makes basics stick",
      "Homework support from subject teachers",
      "Regular assessments to track progress",
      "Small batch sizes for personal attention",
      "Open parent communication after every term",
    ],
    cta: { label: "Enquire About Junior Classes", href: "/admissions" },
  },
  senior: {
    eyebrow: "Senior Program",
    title: "Focused board preparation for Class 11–12",
    intro:
      "For senior students, we go deep on concepts and exam technique — so board exams feel manageable, not overwhelming.",
    features: [
      "Chemistry (Class 11–12)",
      "Physics (Class 11–12)",
      "Board exam preparation",
      "Strong concept clarity",
      "Regular numericals practice",
      "Dedicated doubt sessions",
      "Revision tests before exams",
    ],
    subjects: [
      {
        title: "Chemistry",
        description:
          "From atomic structure to organic chemistry, we build the concepts that board and competitive exams both reward.",
        level: "Class 11–12",
      },
      {
        title: "Physics",
        description:
          "Concept-first teaching with plenty of numericals, so students understand the 'why' behind every formula.",
        level: "Class 11–12",
      },
    ] satisfies SubjectCard[],
  },
  online: {
    eyebrow: "Online Learning",
    title: "Learn from anywhere, with the same care",
    intro:
      "Our online batches bring the Bindra classroom to students across India and abroad — interactive, structured and personal.",
    features: [
      "Live interactive classes",
      "Flexible timings to suit school schedules",
      "Students across India & abroad",
      "Personalized attention in small groups",
      "Digital study material for every topic",
    ],
    cta: { label: "Enquire for Online Batch", href: "/contact" },
  },
  approach: {
    eyebrow: "Our Teaching Approach",
    title: "How we help students succeed",
    items: [
      {
        icon: "bulb",
        title: "Concept-Based Learning",
        description: "We teach for understanding, not rote memorization, so knowledge lasts beyond the exam.",
      },
      {
        icon: "user",
        title: "Personalized Attention",
        description: "Every student is known by name and taught at the pace that suits them best.",
      },
      {
        icon: "clipboard",
        title: "Regular Assessments",
        description: "Frequent, low-pressure checks show progress early and keep learning on track.",
      },
      {
        icon: "users",
        title: "Small Batches",
        description: "Small groups mean more questions answered and more doubts cleared.",
      },
      {
        icon: "message",
        title: "Continuous Feedback",
        description: "Students and parents always know where things stand and what to work on next.",
      },
      {
        icon: "smile",
        title: "Confidence Building",
        description: "We celebrate effort and progress, helping students believe in themselves.",
      },
    ] satisfies FeatureItem[],
  },
  faq: {
    eyebrow: "Frequently Asked Questions",
    title: "Questions parents often ask us",
    items: [
      {
        question: "Which classes do you teach?",
        answer:
          "We teach students from Class 3 through Class 12, covering all subjects for juniors and focused Chemistry and Physics for senior students.",
      },
      {
        question: "Do you offer online classes?",
        answer:
          "Yes. Our online international batches bring live, interactive classes to students across India and abroad, with the same personal attention as our in-person batches.",
      },
      {
        question: "How are batches organized?",
        answer:
          "Batches are kept small and grouped by class and subject level, so teaching stays focused and every student gets the attention they need.",
      },
      {
        question: "Do you conduct regular tests?",
        answer:
          "We do. Regular assessments and revision tests help track progress and prepare students calmly for their board exams.",
      },
      {
        question: "Are demo classes available?",
        answer:
          "Absolutely. We offer a free demo class so you and your child can experience our teaching style before enrolling.",
      },
      {
        question: "How can I enroll?",
        answer:
          "Simply book a free demo class or talk to our academic counsellor — we'll guide you through the right program for your child.",
      },
    ] satisfies FaqItem[],
  },
  finalCta: {
    title: "Let's Find the Right Learning Path for Your Child",
    description:
      "Tell us a little about your child, and we'll help you choose the program that fits them best.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Contact Our Counsellor",
    secondaryHref: "/contact",
  },
} as const;
