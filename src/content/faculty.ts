/**
 * Faculty page content. Kept separate from UI per AGENTS.md. Trust-focused,
 * authentic copy about the educators behind Bindra Knowledge Hub.
 */

export interface Educator {
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: string;
  profile: string;
  initials: string;
}

export interface ApartItem {
  icon: "cap" | "bulb" | "user" | "users" | "clipboard" | "message";
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export const facultyContent = {
  hero: {
    eyebrow: "Our Faculty",
    title: "Meet the Educators Behind Every Success Story",
    subtitle:
      "At Bindra Knowledge Hub, teaching is more than a profession—it is a commitment to nurturing confidence, curiosity and academic excellence.",
    ctaLabel: "Book a FREE Demo Class",
    ctaHref: "/admissions",
  },
  philosophy: {
    eyebrow: "Our Teaching Philosophy",
    title: "Teaching with Heart. Learning for Life.",
    body: "Education is not simply about completing the syllabus. It is about helping students understand concepts, develop confidence and enjoy the process of learning.",
  },
  educators: {
    eyebrow: "Meet Our Educators",
    title: "The people your child will learn from",
    members: [
      {
        name: "Mr. Mandeep Singh Bindra",
        designation: "Director",
        qualification: "M.Tech. Computer Science",
        specialization: "Conceptual Clarity & Strategy",
        experience: "Former University Faculty",
        profile:
          "Inspired by his mother's lifelong dedication to teaching, Mr. Mandeep Singh Bindra founded Bindra Knowledge Hub to provide quality education with a student-first approach. His focus is on conceptual clarity, discipline and helping students build confidence for lifelong success.",
        initials: "MB",
      },
      {
        name: "Mrs. Manroop Kaur",
        designation: "Vice Principal",
        qualification: "M.Sc. Chemistry · Gold Medalist",
        specialization: "Senior Chemistry & Concept Simplification",
        experience: "Khalsa College, Amritsar",
        profile:
          "Mrs. Manroop Kaur believes teaching is a passion rather than a profession. Her ability to simplify complex concepts, encourage students and create a positive learning environment makes her a trusted mentor for senior students.",
        initials: "MK",
      },
      {
        name: "Mrs. Tejinder Kaur",
        designation: "Founding Inspiration",
        qualification: "Dedicated Educator",
        specialization: "Foundational Teaching & Values",
        experience: "20+ Years Teaching Experience",
        profile:
          "Mrs. Tejinder Kaur dedicated more than two decades to educating young minds with patience, discipline and compassion. Her values continue to inspire the vision and culture of Bindra Knowledge Hub.",
        initials: "TK",
      },
    ] satisfies Educator[],
  },
  apart: {
    eyebrow: "Why Our Faculty Stands Apart",
    title: "What makes our educators different",
    items: [
      {
        icon: "cap",
        title: "Qualified Educators",
        description: "Experienced teachers and subject specialists who know their subjects deeply.",
      },
      {
        icon: "bulb",
        title: "Concept-Based Teaching",
        description: "We explain the 'why' so students truly understand, not just memorise.",
      },
      {
        icon: "user",
        title: "Personalized Attention",
        description: "Every student is known, guided and supported as an individual.",
      },
      {
        icon: "users",
        title: "Small Batch Sizes",
        description: "Small groups mean more questions answered and doubts cleared.",
      },
      {
        icon: "clipboard",
        title: "Regular Assessments",
        description: "Frequent checks keep learning on track without last-minute pressure.",
      },
      {
        icon: "message",
        title: "Parent Communication",
        description: "Open, honest updates so families always know how their child is doing.",
      },
    ] satisfies ApartItem[],
  },
  process: {
    eyebrow: "Student-Centric Teaching",
    title: "How we help each student grow",
    steps: [
      {
        title: "Understand Student",
        description: "We learn how each child thinks, strengths and gaps.",
      },
      {
        title: "Identify Learning Needs",
        description: "We map exactly what support will help most.",
      },
      {
        title: "Personalized Guidance",
        description: "Teaching paced and shaped around the student.",
      },
      {
        title: "Regular Practice",
        description: "Consistent practice to build fluency and confidence.",
      },
      {
        title: "Continuous Feedback",
        description: "Ongoing feedback for students and parents.",
      },
      {
        title: "Confidence & Success",
        description: "Lasting confidence that shows in results and beyond.",
      },
    ] satisfies ProcessStep[],
  },
  finalCta: {
    title: "Meet Our Faculty and Experience the Difference",
    description:
      "Come see how a warm, personal approach to teaching feels for your child.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Talk to an Academic Counsellor",
    secondaryHref: "/contact",
  },
} as const;
