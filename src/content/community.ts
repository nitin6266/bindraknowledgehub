/**
 * Community (Success Stories & Campus Life) page content. Kept separate
 * from UI per AGENTS.md. All copy/figures are placeholders, structured so
 * new students, reviews and gallery items can be added by editing data only.
 */

export interface StudentStory {
  name: string;
  className: string;
  achievement: string;
  subject: string;
  goal: string;
  quote: string;
  initials: string;
}

export interface ParentTestimonial {
  name: string;
  studentClass: string;
  rating: number;
  review: string;
  initials: string;
}

export interface FeatureItem {
  icon: "pointer" | "bulb" | "help" | "user" | "shield" | "users" | "clipboard" | "heart";
  title: string;
  description: string;
}

export interface ActivityItem {
  icon: "flask" | "award" | "trophy" | "workshop" | "flame" | "party";
  title: string;
  description: string;
}

export type GalleryCategory =
  | "Classrooms"
  | "Teaching"
  | "Students"
  | "Achievements"
  | "Events"
  | "Campus";

export interface GalleryItem {
  title: string;
  category: GalleryCategory;
}

export const communityContent = {
  hero: {
    eyebrow: "Our Community",
    title: "Learning, Growing and Celebrating Together",
    subtitle:
      "Every classroom experience, every achievement and every smile reflects our commitment to creating a positive learning environment where students thrive.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Visit Our Academy",
    secondaryHref: "/contact",
  },
  stories: {
    eyebrow: "Student Success Stories",
    title: "The students who make our days brighter",
    items: [
      {
        name: "Aarav Sharma",
        className: "Class 10",
        achievement: "School topper in Mathematics",
        subject: "Mathematics",
        goal: "Engineer",
        quote: "I stopped fearing exams and started enjoying the process of learning.",
        initials: "AS",
      },
      {
        name: "Gurleen Kaur",
        className: "Class 12 · Medical",
        achievement: "Secured NEET preparation track",
        subject: "Biology",
        goal: "Doctor",
        quote: "The way concepts were explained made everything finally click.",
        initials: "GK",
      },
      {
        name: "Rohan Verma",
        className: "Class 12 · Non-Medical",
        achievement: "Excelled in Physics & Chemistry",
        subject: "Physics",
        goal: "Researcher",
        quote: "Regular practice turned my weak spots into real strengths.",
        initials: "RV",
      },
      {
        name: "Simranjit",
        className: "Class 9",
        achievement: "Improved 20% in Science",
        subject: "Science",
        goal: "Scientist",
        quote: "I feel more confident asking questions now than ever before.",
        initials: "SJ",
      },
      {
        name: "Ananya",
        className: "Class 10",
        achievement: "Distinction in English",
        subject: "English",
        goal: "Writer & Teacher",
        quote: "My teachers helped me find my voice through writing.",
        initials: "AN",
      },
      {
        name: "Kabir",
        className: "Class 11",
        achievement: "Batch topper in Chemistry",
        subject: "Chemistry",
        goal: "Engineer",
        quote: "Learning here feels personal — like someone truly believes in me.",
        initials: "KB",
      },
    ] satisfies StudentStory[],
  },
  testimonials: {
    eyebrow: "Parent Testimonials",
    title: "What parents tell us",
    items: [
      {
        name: "Mrs. Kaur",
        studentClass: "Parent of Class 10 student",
        rating: 5,
        review:
          "We finally see our child enjoying studies. The teachers keep us informed and genuinely care about progress, not just marks.",
        initials: "MK",
      },
      {
        name: "Mr. Sharma",
        studentClass: "Parent of Class 12 student",
        rating: 5,
        review:
          "The personal attention made all the difference. My daughter's confidence has grown so much over the year.",
        initials: "RS",
      },
      {
        name: "Mrs. Verma",
        studentClass: "Parent of Class 11 student",
        rating: 4,
        review:
          "Honest feedback and regular tests helped us support our son at exactly the right moments.",
        initials: "VV",
      },
      {
        name: "Mr. Singh",
        studentClass: "Parent of Class 9 student",
        rating: 5,
        review:
          "The small batch sizes mean the teacher actually knows my child. That changed everything for us.",
        initials: "PS",
      },
      {
        name: "Mrs. Bedi",
        studentClass: "Parent of Class 8 student",
        rating: 5,
        review:
          "A warm, disciplined environment where learning feels safe. We are very happy with the progress.",
        initials: "SB",
      },
      {
        name: "Mr. Arora",
        studentClass: "Parent of Class 10 student",
        rating: 4,
        review:
          "Good communication and steady improvement. We always know where our child stands.",
        initials: "AA",
      },
    ] satisfies ParentTestimonial[],
  },
  classroom: {
    eyebrow: "Classroom Experience",
    title: "How learning happens here",
    items: [
      {
        icon: "pointer",
        title: "Interactive Learning",
        description: "Lessons invite questions and discussion, so students stay engaged and active.",
      },
      {
        icon: "bulb",
        title: "Concept-Based Teaching",
        description: "We teach for understanding, building durable knowledge rather than rote answers.",
      },
      {
        icon: "help",
        title: "Doubt Solving",
        description: "No question is too small — doubt sessions keep every student unstuck and moving.",
      },
      {
        icon: "user",
        title: "Personal Attention",
        description: "Small groups let teachers meet each child where they are and guide them forward.",
      },
    ] satisfies FeatureItem[],
  },
  activities: {
    eyebrow: "Activities & Celebrations",
    title: "Moments that bring us together",
    items: [
      {
        icon: "flask",
        title: "Science Day",
        description: "Hands-on experiments that turn curiosity into discovery.",
      },
      {
        icon: "award",
        title: "Award Ceremony",
        description: "Celebrating effort and achievement across subjects and grades.",
      },
      {
        icon: "trophy",
        title: "Board Success Celebration",
        description: "Honouring the hard work behind every board result.",
      },
      {
        icon: "workshop",
        title: "Student Workshops",
        description: "Skill-building sessions beyond the textbook.",
      },
      {
        icon: "flame",
        title: "Motivational Sessions",
        description: "Guest talks and mentors who inspire students to aim higher.",
      },
      {
        icon: "party",
        title: "Festival Celebrations",
        description: "Togetherness and culture, celebrated as one family.",
      },
    ] satisfies ActivityItem[],
  },
  gallery: {
    eyebrow: "Photo Gallery",
    title: "A glimpse into campus life",
    categories: ["Classrooms", "Teaching", "Students", "Achievements", "Events", "Campus"] as GalleryCategory[],
    items: [
      { title: "Morning assembly", category: "Campus" },
      { title: "Group discussion", category: "Classrooms" },
      { title: "One-on-one doubt session", category: "Teaching" },
      { title: "Board topper celebration", category: "Achievements" },
      { title: "Science Day demo", category: "Events" },
      { title: "Students collaborating", category: "Students" },
      { title: "Award on stage", category: "Achievements" },
      { title: "Lab practical", category: "Teaching" },
      { title: "Festival gathering", category: "Events" },
      { title: "Reading corner", category: "Classrooms" },
      { title: "Campus courtyard", category: "Campus" },
      { title: "Peer mentoring", category: "Students" },
    ] satisfies GalleryItem[],
  },
  environment: {
    eyebrow: "Learning Environment",
    title: "A place where students feel they belong",
    items: [
      {
        icon: "shield",
        title: "Safe Environment",
        description: "A respectful, bullying-free space where every student feels secure to learn.",
      },
      {
        icon: "users",
        title: "Small Batch Size",
        description: "Small groups mean more attention and more chances to be heard.",
      },
      {
        icon: "clipboard",
        title: "Regular Assessments",
        description: "Frequent, low-pressure checks keep learning steady and on track.",
      },
      {
        icon: "heart",
        title: "Supportive Faculty",
        description: "Teachers who encourage, guide and genuinely believe in each student.",
      },
    ] satisfies FeatureItem[],
  },
  finalCta: {
    title: "Come Experience the Difference Yourself",
    description:
      "We invite you to visit Bindra Knowledge Hub, meet our educators, experience our classrooms and discover how we help every student grow.",
    primaryLabel: "Book a FREE Demo Class",
    primaryHref: "/admissions",
    secondaryLabel: "Schedule a Visit",
    secondaryHref: "/contact",
  },
} as const;
