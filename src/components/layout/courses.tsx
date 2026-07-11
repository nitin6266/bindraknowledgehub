"use client";

import { Sparkles, Target, Award, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface Course {
  name: string;
  shortDesc: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  badge: { text: string; variant: "default" | "accent" | "outline" | "success" };
  level: string;
}

const courses: Course[] = [
  {
    name: "Foundation (Classes 3–5)",
    shortDesc: "Building strong fundamentals in English, Mathematics, Science and Social Studies.",
    features: ["Concept clarity focus", "Interactive learning", "Regular parent updates", "Activity-based methods"],
    icon: Sparkles,
    badge: { text: "Popular", variant: "accent" },
    level: "Classes 3–5",
  },
  {
    name: "Middle School (Classes 6–8)",
    shortDesc: "Strengthening core concepts and preparing students for higher academic challenges.",
    features: ["Subject experts", "Lab-based science", "Olympiad preparation", "Digital learning tools"],
    icon: BookOpen,
    badge: { text: "Core", variant: "default" },
    level: "Classes 6–8",
  },
  {
    name: "High School (Classes 9–10)",
    shortDesc: "Comprehensive board exam preparation with concept mastery and exam strategies.",
    features: ["NCERT alignment", "Sample papers", "Doubt clearing sessions", "Progress tracking"],
    icon: Target,
    badge: { text: "Boards", variant: "success" },
    level: "Classes 9–10",
  },
  {
    name: "Senior Secondary (Classes 11–12)",
    shortDesc: "Advanced preparation for board exams and competitive entrance tests (JEE/NEET).",
    features: ["JEE/NEET integrated", "Expert faculty", "Test series", "Career guidance"],
    icon: Award,
    badge: { text: "Advanced", variant: "outline" },
    level: "Classes 11–12",
  },
] as const;

export function Courses() {
  return (
    <Section id="courses" aria-labelledby="courses-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-6 inline-flex">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Our Courses
          </Badge>
          <Heading as="h2" id="courses-heading" size="display" align="center" className="max-w-3xl mx-auto">
            Courses for Every Stage
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Structured programs from foundational learning to competitive exam readiness.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="flex h-full flex-col p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="flex w-full flex-col items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <course.icon aria-hidden="true" className="size-6" />
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={course.badge.variant}>{course.badge.text}</Badge>
                    <span className="text-body-xs font-medium text-muted-foreground">{course.level}</span>
                  </div>
                  <Heading as="h3" size="md" className="text-foreground">
                    {course.name}
                  </Heading>
                  <p className="mt-2 text-body text-muted-foreground leading-relaxed">
                    {course.shortDesc}
                  </p>
                </div>

                <ul className="w-full space-y-2 mt-2">
                  {course.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                      <Sparkles aria-hidden="true" className="size-4 opacity-50 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-body-xs text-muted-foreground">
                  Course details are placeholders. Full curriculum arrives in an upcoming sprint.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-body-sm text-muted-foreground">
          All course curricula are placeholders. Full content arrives in an upcoming sprint.
        </p>
      </Container>
    </Section>
  );
}