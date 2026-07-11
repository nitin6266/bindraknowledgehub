/**
 * About page content. Kept separate from UI per AGENTS.md so copy can later
 * move to a CMS without touching presentation. All prose is authored to feel
 * authentic, warm and family-driven — no marketing exaggeration.
 */

export interface TimelineItem {
  phase: string;
  title: string;
  description: string;
}

export interface CoreValue {
  icon: "heart" | "award" | "sprout" | "shield" | "book" | "sparkles";
  title: string;
  description: string;
}

export interface FamilyMember {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

export interface Letter {
  eyebrow: string;
  title: string;
  salutation: string;
  paragraphs: string[];
  signoff: string;
  signature: string;
}

export const aboutContent = {
  hero: {
    eyebrow: "Our Story",
    title: "About Bindra Knowledge Hub",
    subtitle:
      "A family legacy dedicated to inspiring young minds through quality education, personal attention and a passion for teaching.",
  },
  story: {
    eyebrow: "Our Story",
    title: "Where a family's love for teaching became a school",
    paragraphs: [
      "Bindra Knowledge Hub began at a kitchen table, not a boardroom. For more than twenty years, Mrs. Tejinder Kaur taught children in her neighbourhood — patiently, personally, and with the quiet belief that every child learns in their own time and their own way.",
      "That belief shaped everything that followed. When her son, Mandeep Singh Bindra, joined university as a faculty member, the family saw how rarely students were met as individuals. The gap between how young people learn and how they are taught stayed with him.",
      "So the family did what came naturally: they opened their doors. Bindra Knowledge Hub is the result — a small, warm academy built on personal attention, steady encouragement, and a genuine care for the whole child, not just their marks.",
      "We are still, at heart, a family teaching family. Every student who walks in is treated the way we would want our own to be taught: with respect, with patience, and with the conviction that confidence is the foundation of all learning.",
    ],
  },
  timeline: {
    eyebrow: "Our Journey",
    title: "A journey shaped by family and teaching",
    items: [
      {
        phase: "Roots",
        title: "Mrs. Tejinder Kaur",
        description: "More than 20 years of dedicated, one-on-one teaching in the community she calls home.",
      },
      {
        phase: "Scholar",
        title: "Mandeep Singh Bindra",
        description: "A university faculty member who saw the need for education that treats each student as an individual.",
      },
      {
        phase: "Today",
        title: "Bindra Knowledge Hub",
        description: "A warm, family-run academy where students grow in confidence, clarity and character — together.",
      },
    ] satisfies TimelineItem[],
  },
  mission: {
    eyebrow: "Mission",
    title: "Our Mission",
    body: "To give every student a calm, supportive place to learn — where personal attention comes first, foundations are built with care, and success is measured in confidence as much as in results.",
  },
  vision: {
    eyebrow: "Vision",
    title: "Our Vision",
    body: "A generation of learners who are curious, kind and self-assured — young people who carry a love of learning with them long after they leave our classrooms.",
  },
  values: {
    eyebrow: "Core Values",
    title: "What we stand for",
    items: [
      {
        icon: "heart",
        title: "Care Before Curriculum",
        description: "We get to know the child first. A student who feels safe and seen is a student who can learn.",
      },
      {
        icon: "award",
        title: "Excellence",
        description: "We hold a quiet, steady standard — not perfection, but our genuine best in every lesson.",
      },
      {
        icon: "sprout",
        title: "Continuous Growth",
        description: "Progress over pressure. We celebrate small steps because they lead to lasting change.",
      },
      {
        icon: "shield",
        title: "Trust & Integrity",
        description: "Honest feedback, transparent communication, and promises we keep to families.",
      },
      {
        icon: "book",
        title: "Learning Without Boundaries",
        description: "We meet students where they are — across subjects, grades, and learning styles.",
      },
      {
        icon: "sparkles",
        title: "Character Alongside Academics",
        description: "Kindness, resilience and integrity matter as much as any grade on a report card.",
      },
    ] satisfies CoreValue[],
  },
  family: {
    eyebrow: "Meet the Family",
    title: "The people behind the Hub",
    members: [
      { name: "Mr. Mandeep Singh Bindra", role: "Co-Founder · Faculty", initials: "MB", image: "/about/Mandeep.jpg" },
      { name: "Mrs. Manroop Kaur", role: "Co-Founder · Curriculum & Care", initials: "MK", image: "/about/ManroopKaur.png" },
      { name: "Mrs. Tejinder Kaur", role: "Founding Teacher · 20+ years", initials: "TK" },
    ] satisfies FamilyMember[],
  },
  letterToParents: {
    eyebrow: "A Note to Parents",
    title: "Dear Parents",
    salutation: "Dear Parents,",
    paragraphs: [
      "Choosing where your child learns is one of the most personal decisions you will make. We know that, because we are parents too. We do not take the trust you place in us lightly.",
      "At Bindra Knowledge Hub, your child will never be just a roll number. We will learn how they think, where they struggle, and what makes them light up. We will tell you the truth about their progress — the wins and the work that remains.",
      "Our promise is simple: we will teach your child with the same patience and care we would want for our own. If that is what you are looking for, we would be glad to welcome your family.",
    ],
    signoff: "With warmth,",
    signature: "The Bindra Family",
  } satisfies Letter,
  letterToStudents: {
    eyebrow: "A Note to Students",
    title: "Dear Students",
    salutation: "Dear Students,",
    paragraphs: [
      "This is your place. You do not have to be the smartest person in the room to belong here — you only have to be willing to try.",
      "Some days learning will feel easy, and some days it will feel hard. Both are normal. We are here for the hard days too, and we will not give up on you when something does not click right away.",
      "Ask questions. Make mistakes. Be curious. That is what this Hub is for — and we cannot wait to see where your learning takes you.",
    ],
    signoff: "Your cheering squad,",
    signature: "The Bindra Family",
  } satisfies Letter,
  finalCta: {
    title: "Let's Build Your Child's Bright Future Together",
    description:
      "Come see how a warm, personal approach to learning feels. The first step is simply a conversation.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
  },
} as const;
