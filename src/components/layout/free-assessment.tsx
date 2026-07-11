"use client";

import { Award, Target, Users, GraduationCap, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const benefits : Benefit[] = [
  {
    icon: Award,
    title: "Comprehensive Diagnostic",
    description: "Identifies conceptual gaps across all core subjects with detailed topic-level analysis.",
  },
  {
    icon: Target,
    title: "Personalized Learning Plan",
    description: "Custom roadmap based on diagnostic results, learning style, and academic goals.",
  },
  {
    icon: Users,
    title: "Expert Counselling Session",
    description: "One-on-one discussion with an academic counsellor to review results and set milestones.",
  },
  {
    icon: GraduationCap,
    title: "Program Recommendation",
    description: "Data-driven course recommendation (Foundation, Boards, JEE/NEET) with schedule options.",
  },
]

export function FreeAssessment() {
  return (
    <Section id="free-assessment" aria-labelledby="free-assessment-heading" className="py-10 lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <Sparkles aria-hidden="true" className="size-3" />
            Free Academic Assessment
          </Badge>
          <Heading as="h2" id="free-assessment-heading" size="display" align="center" className="max-w-3xl mx-auto">
            Know Where Your Child Stands
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Our complimentary diagnostic assessment evaluates conceptual understanding across subjects and provides a personalized roadmap for academic success.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12 lg:mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="h-full p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <CardContent className="flex flex-col items-center gap-4 text-center h-full">
                <IconWrapper size="lg" variant="accent" className="opacity-60">
                  <benefit.icon aria-hidden="true" className="size-6" />
                </IconWrapper>
                <Heading as="h3" size="md" className="text-foreground">
                  {benefit.title}
                </Heading>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assessment Process */}
        <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
          <div className="text-center mb-10">
            <Badge variant="accent" className="mb-4 inline-flex">
              <Sparkles aria-hidden="true" className="size-3" />
              How It Works
            </Badge>
            <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto">
              Simple 3-Step Process
            </Heading>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="relative text-center p-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-heading-sm">
                  1
                </span>
              </div>
              <div className="pt-5">
                <Heading as="h4" size="lg" className="mb-2">Book Your Slot</Heading>
                <p className="text-body text-muted-foreground">
                  Choose a convenient date and time for the assessment. Available online and offline.
                </p>
              </div>
            </div>

            <div className="relative text-center p-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-heading-sm">
                  2
                </span>
              </div>
              <div className="pt-5">
                <Heading as="h4" size="lg" className="mb-2">Take the Assessment</Heading>
                <p className="text-body text-muted-foreground">
                  60-minute diagnostic test covering key concepts. Online proctoring available.
                </p>
              </div>
            </div>

            <div className="relative text-center p-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-heading-sm">
                  3
                </span>
              </div>
              <div className="pt-5">
                <Heading as="h4" size="lg" className="mb-2">Get Your Roadmap</Heading>
                <p className="text-body text-muted-foreground">
                  Detailed report with strengths, gaps, and a personalized learning plan with counsellor review.
                </p>
              </div>
            </div>
          </div>

          {/* Connecting line */}
          <div className="hidden sm:block absolute top-[50px] left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary/30 via-transparent to-primary/30" />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
            Book Your Child&apos;s Free Assessment Today
          </Heading>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
            Limited slots available each week. Reserve your preferred time slot now.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[280px] px-10 min-h-[56px]">
              <a href="/admissions">Book Free Assessment</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[56px]">
              <a href="/admissions">Other Options</a>
            </Button>
          </div>

          <p className="mt-8 text-center text-body-sm text-muted-foreground">
            This is a placeholder CTA. Booking logic will be implemented in an upcoming sprint.
          </p>
        </div>
      </Container>
    </Section>
  );
}