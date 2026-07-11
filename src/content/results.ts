/**
 * Results page content. Kept separate from UI per AGENTS.md so new academic
 * years and students can be added by editing data only — no redesign needed.
 * All figures are placeholders.
 */

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: "users" | "award" | "clipboard" | "clock";
}

export interface FeaturedAchiever {
  name: string;
  className: string;
  school: string;
  score: string;
  achievement: string;
  goal: string;
  teacherQuote: string;
  initials: string;
}

export interface WallStudent {
  name: string;
  className: string;
  achievement: string;
  marks: string;
  message: string;
  initials: string;
}

export interface SuccessStory {
  name: string;
  journey: string;
  challenges: string;
  support: string;
  outcome: string;
  quote: string;
  initials: string;
}

export interface Aspiration {
  title: string;
  message: string;
  icon: "doctor" | "engineer" | "scientist" | "teacher" | "entrepreneur" | "researcher";
}

export interface YearResult {
  year: string;
  note: string;
  results: { name: string; exam: string; score: string }[];
}

export interface ParentAppreciation {
  name: string;
  studentClass: string;
  feedback: string;
  rating: number;
  initials: string;
}

export const resultsContent = {
  hero: {
    eyebrow: "Our Results",
    title: "Celebrating Every Student's Success",
    subtitle:
      "Every achievement is the result of dedication, guidance and consistent hard work. We are proud of every student who continues to grow and excel with us.",
    ctaLabel: "Book a FREE Demo Class",
    ctaHref: "/admissions",
  },
  stats: {
    eyebrow: "Academic Excellence",
    title: "A legacy measured in growth, not just grades",
    items: [
      { value: 500, suffix: "+", label: "Students Guided", icon: "users" },
      { value: 95, suffix: "%", label: "Academic Excellence", icon: "award" },
      { value: 100, suffix: "%", label: "Board Preparation", icon: "clipboard" },
      { value: 20, suffix: "+", label: "Years of Teaching Legacy", icon: "clock" },
    ] satisfies Stat[],
  },
  featured: {
    eyebrow: "Featured Achievers",
    title: "Students who made us proud",
    achievers: [
      {
        name: "Aarav Sharma",
        className: "Class 10",
        school: "Delhi Public School",
        score: "96.4%",
        achievement: "School topper in Mathematics",
        goal: "Aspiring Engineer",
        teacherQuote:
          "Aarav's consistency and curiosity made teaching him a genuine joy. He never stopped asking 'why'.",
        initials: "AS",
      },
      {
        name: "Gurleen Kaur",
        className: "Class 12 · Medical",
        school: "Springdale School",
        score: "94.8%",
        achievement: "Secured NEET preparation track",
        goal: "Aspiring Doctor",
        teacherQuote:
          "Gurleen simplifies the hardest topics for herself first — that discipline is why she excels.",
        initials: "GK",
      },
      {
        name: "Rohan Verma",
        className: "Class 12 · Non-Medical",
        school: "St. Xavier's School",
        score: "93.2%",
        achievement: "Excelled in Physics & Chemistry",
        goal: "Aspiring Researcher",
        teacherQuote:
          "Rohan connects concepts across subjects. His numericals work is among the best we've seen.",
        initials: "RV",
      },
    ] satisfies FeaturedAchiever[],
  },
  wall: {
    eyebrow: "Wall of Success",
    title: "Every name here is a story of effort",
    students: [
      { name: "Simranjit", className: "Class 9", achievement: "Improved 20% in Science", marks: "88%", message: "From nervous to confident in one term.", initials: "SJ" },
      { name: "Kabir", className: "Class 11", achievement: "Topper in Chemistry", marks: "95%", message: "Loves the lab more than ever.", initials: "KB" },
      { name: "Ananya", className: "Class 10", achievement: "Distinction in English", marks: "92%", message: "Found her voice through writing.", initials: "AN" },
      { name: "Harsh", className: "Class 12", achievement: "Cleared board with honours", marks: "91%", message: "Steady work paid off.", initials: "HR" },
      { name: "Mehar", className: "Class 8", achievement: "Maths star of the batch", marks: "90%", message: "Now helps her classmates.", initials: "MH" },
      { name: "Arjun", className: "Class 11", achievement: "Physics Olympiad selected", marks: "94%", message: "Curiosity turned into achievement.", initials: "AJ" },
      { name: "Navya", className: "Class 10", achievement: "All-round improvement", marks: "89%", message: "Growth in every subject.", initials: "NV" },
      { name: "Gurveer", className: "Class 9", achievement: "Subject improvement award", marks: "87%", message: "Small steps, big change.", initials: "GV" },
    ] satisfies WallStudent[],
  },
  stories: {
    eyebrow: "Success Stories",
    title: "How we helped students get there",
    items: [
      {
        name: "Aarav Sharma",
        journey: "Joined in Class 9 struggling with foundational Maths and low confidence in exams.",
        challenges: "Gaps in basics and exam anxiety made every test feel overwhelming.",
        support: "We rebuilt concepts step by step and gave him regular, low-pressure practice with personal feedback.",
        outcome: "By Class 10 he topped his school in Mathematics and enjoys the subject today.",
        quote: "I stopped fearing Maths and started enjoying it. That changed everything.",
        initials: "AS",
      },
      {
        name: "Gurleen Kaur",
        journey: "A diligent senior student aiming for a medical career but finding Chemistry dense.",
        challenges: "Complex reactions and memorisation were slowing her progress.",
        support: "Concept-first teaching and simplified frameworks helped her see the logic behind each topic.",
        outcome: "She secured a NEET preparation track with a 94.8% result in Class 12.",
        quote: "The way concepts were explained made everything click. I finally felt ready.",
        initials: "GK",
      },
      {
        name: "Rohan Verma",
        journey: "Strong in theory but inconsistent with numericals and board presentation.",
        challenges: "Lost marks on application questions despite knowing the theory.",
        support: "Targeted numerical practice and revision tests built both accuracy and exam technique.",
        outcome: "He excelled in Physics & Chemistry and is now set on a research path.",
        quote: "Regular practice and honest feedback turned my weak spots into strengths.",
        initials: "RV",
      },
    ] satisfies SuccessStory[],
  },
  aspirations: {
    eyebrow: "University & Career Aspirations",
    title: "The dreams we help nurture",
    items: [
      { title: "Doctor", message: "Healing others with care and precision.", icon: "doctor" },
      { title: "Engineer", message: "Building the world, one idea at a time.", icon: "engineer" },
      { title: "Scientist", message: "Asking the questions that move us forward.", icon: "scientist" },
      { title: "Teacher", message: "Passing on the gift of learning.", icon: "teacher" },
      { title: "Entrepreneur", message: "Turning ideas into possibilities.", icon: "entrepreneur" },
      { title: "Researcher", message: "Pushing the edge of what we know.", icon: "researcher" },
    ] satisfies Aspiration[],
  },
  years: {
    eyebrow: "Year-wise Results",
    title: "Browse results by academic year",
    items: [
      {
        year: "2025",
        note: "Our most recent batch of achievements.",
        results: [
          { name: "Gurleen Kaur", exam: "Class 12 · Medical", score: "94.8%" },
          { name: "Rohan Verma", exam: "Class 12 · Non-Medical", score: "93.2%" },
          { name: "Aarav Sharma", exam: "Class 10", score: "96.4%" },
        ],
      },
      {
        year: "2026",
        note: "Results updating as the academic year progresses.",
        results: [
          { name: "Kabir", exam: "Class 11 · Chemistry", score: "95%" },
          { name: "Arjun", exam: "Class 11 · Physics", score: "94%" },
          { name: "Ananya", exam: "Class 10 · English", score: "92%" },
        ],
      },
      {
        year: "Future Ready",
        note: "A growing community of learners yet to be celebrated.",
        results: [
          { name: "Mehar", exam: "Class 8 · Maths", score: "90%" },
          { name: "Navya", exam: "Class 10 · All-round", score: "89%" },
          { name: "Gurveer", exam: "Class 9 · Improvement", score: "87%" },
        ],
      },
    ] satisfies YearResult[],
  },
  parents: {
    eyebrow: "Parent Appreciation",
    title: "What families say about us",
    items: [
      {
        name: "Mrs. Kaur",
        studentClass: "Parent of Class 10 student",
        feedback:
          "We finally see our child enjoying studies. The teachers keep us informed and genuinely care.",
        rating: 5,
        initials: "MK",
      },
      {
        name: "Mr. Sharma",
        studentClass: "Parent of Class 12 student",
        feedback:
          "The personal attention made all the difference. My daughter's confidence has grown so much.",
        rating: 5,
        initials: "RS",
      },
      {
        name: "Mrs. Verma",
        studentClass: "Parent of Class 11 student",
        feedback:
          "Honest feedback and regular tests helped us support our son at the right moments.",
        rating: 5,
        initials: "VV",
      },
    ] satisfies ParentAppreciation[],
  },
  finalCta: {
    title: "Your Child Could Be Our Next Success Story",
    description: "Every achievement here started with a single step — a conversation with us.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Schedule an Academic Assessment",
    secondaryHref: "/contact",
  },
} as const;
