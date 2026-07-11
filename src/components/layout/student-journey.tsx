"use client";

import { ChevronRight, Check, Target, BookOpen, MessageSquare, Shield, Users, Sparkles } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface JourneyStep {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

const journeySteps: JourneyStep[] = [
  {
    step: 1,
    title: "Assessment",
    description: "Comprehensive diagnostic to identify strengths and learning gaps.",
    icon: Target,
    details: [
      "Concept-level diagnostic across subjects",
      "Learning style identification",
      "Baseline performance benchmark",
    ],
  },
  {
    step: 2,
    title: "Learning Plan",
    description: "Personalized roadmap based on assessment results and goals.",
    icon: BookOpen,
    details: [
      "Customized curriculum mapping",
      "Weekly milestone targets",
      "Resource recommendations",
    ],
  },
  {
    step: 3,
    title: "Weekly Classes",
    description: "Interactive sessions with experienced faculty in small batches.",
    icon: Users,
    details: [
      "Live instruction (online/offline)",
      "Concept clarification & practice",
      "Weekly homework & review",
    ],
  },
  {
    step: 4,
    title: "Regular Tests",
    description: "Frequent assessments to track progress and identify gaps early.",
    icon: BookOpen,
    details: [
      "Weekly concept checks",
      "Monthly comprehensive tests",
      "Mock exams for board prep",
    ],
  },
  {
    step: 5,
    title: "Doubt Solving",
    description: "Dedicated support for concept clarification and homework help.",
    icon: MessageSquare,
    details: [
      "Daily doubt-solving sessions",
      "WhatsApp support group",
      "Recorded session access",
    ],
  },
  {
    step: 6,
    title: "Parent Feedback",
    description: "Regular updates and collaborative progress review with parents.",
    icon: Shield,
    details: [
      "Monthly progress reports",
      "Quarterly parent-teacher meetings",
      "24/7 portal access",
    ],
  },
  {
    step: 7,
    title: "Board Success",
    description: "Comprehensive preparation leading to exam readiness and confidence.",
    icon: Sparkles,
    details: [
      "Final revision & mock exams",
      "Exam strategy sessions",
      "Stress management support",
    ],
  },
] as const;

export function StudentJourney() {
  return (
    <Section id="student-journey" aria-labelledby="student-journey-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <Sparkles aria-hidden="true" className="size-3" />
            Student Journey
          </Badge>
          <Heading as="h2" id="student-journey-heading" size="display" align="center" className="max-w-3xl">
            A Structured Path from Curiosity to Confidence
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Every student follows a proven 7-step journey designed to build strong foundations,
            develop exam readiness, and nurture lifelong learning habits.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-[2.5rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" aria-hidden="true" />

          <div className="space-y-10 pl-16 lg:pl-24">
            {journeySteps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Timeline dot & connector */}
                <div className="hidden lg:block absolute -left-16 top-2 size-4 rounded-full bg-primary border-4 border-background shadow-sm z-10 transition-all duration-300 group-hover:scale-125 group-hover:border-primary" aria-hidden="true" />
                <div className="lg:hidden inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary mr-3 flex-shrink-0">
                  <span className="text-body-xs font-bold">{step.step}</span>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="lg:w-24 flex-shrink-0">
                    <span className="inline-block text-body-xs font-medium text-primary uppercase tracking-wider mb-1">
                      Step {step.step}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-2">
                      <Heading as="h3" size="lg" className="text-foreground">
                        {step.title}
                      </Heading>
                      <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground flex-shrink-0" />
                    </div>
                    <p className="text-body text-muted-foreground leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <ul className="space-y-1 pl-4 lg:pl-16">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                          <Check aria-hidden="true" className="size-4 text-primary/60 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-only step indicators */}
        <div className="lg:hidden mt-10">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
            {journeySteps.map((step, index) => (
              <span
                key={index}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-body-xs font-medium transition-all ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.step}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 lg:mt-20 text-center">
          <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
            Start Your Child&apos;s Journey Today
          </Heading>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
            The first step is understanding where your child stands. Book a free assessment to begin.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[280px] px-10 min-h-[56px]">
              <a href="/admissions">Book Free Assessment</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[56px]">
              <a href="#free-assessment">Learn More</a>
            </Button>
          </div>
          <p className="mt-8 text-center text-body-sm text-muted-foreground">
            This section uses placeholder content. Full journey details arrive in an upcoming sprint.
          </p>
        </div>
      </Container>
    </Section>
  );
}