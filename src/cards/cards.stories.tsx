import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, Users } from "lucide-react";
import { FeatureCard } from "@/cards/feature-card";
import { FacultyCard } from "@/cards/faculty-card";
import { CourseCard } from "@/cards/course-card";
import { ResultCard } from "@/cards/result-card";
import { TestimonialCard } from "@/cards/testimonial-card";
import { GalleryCard } from "@/cards/gallery-card";
import { StatisticCard } from "@/cards/statistic-card";
import { TimelineCard } from "@/cards/timeline-card";

const meta = {
  title: "Cards/Domain",
  component: FeatureCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Domain cards built on the Card primitive + tokens. Each is a reusable, content-agnostic shell: Feature, Faculty, Course, Result, Testimonial, Gallery, Statistic, Timeline. All include hover-lift and reduced-motion support.",
      },
    },
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllCards: Story = {
  args: { title: "Feature", description: "desc" },
  render: () => (
    <div className="grid max-w-5xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <FeatureCard icon={BookOpen} title="Concept Clarity" description="We build understanding, not rote memory." />
      <FacultyCard name="Dr. Anita Bindra" role="Head of Mathematics" initials="AB" />
      <CourseCard title="Foundation Maths" description="Grades 6–8 core program." level="Beginner" duration="12 weeks" href="#" />
      <ResultCard exam="Board 2024" score="96%" subtitle="Topper, Mathematics" />
      <TestimonialCard quote="My daughter finally enjoys learning." author="Mrs. Sharma" role="Parent" />
      <GalleryCard alt="Campus event" title="Annual Day" />
      <StatisticCard value={1200} suffix="+" label="Students mentored" icon={Users} />
      <TimelineCard year="2015" title="Academy founded" description="Started with 20 students in a small campus." />
    </div>
  ),
  name: "All Cards",
  parameters: { layout: "fullscreen" },
};
