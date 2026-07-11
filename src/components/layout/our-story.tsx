"use client";

import { ChevronRight, Heart, Users, GraduationCap, Award, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface TimelineStep {
  step: string;
  name: string;
  title: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
}

const timelineSteps: TimelineStep[] = [
  {
    step: "Step 1",
    name: "Mrs. Tejinder Kaur",
    title: "The Inspiration",
    content: "For more than two decades, Mrs. Tejinder Kaur dedicated her life to teaching and inspiring students with patience, discipline and care.",
    icon: Award,
  },
  {
    step: "Step 2",
    name: "Mandeep Singh Bindra",
    title: "Carrying Forward a Legacy",
    content: "After completing his M.Tech. in Computer Science and serving as a university faculty member, he chose to continue his mother's dream of providing quality education through a student-focused academy.",
    icon: GraduationCap,
  },
  {
    step: "Step 3",
    name: "Mrs. Manroop Kaur",
    title: "Teaching with Passion",
    content: "An M.Sc. Chemistry Gold Medalist from Khalsa College Amritsar, Mrs. Manroop Kaur believes teaching is a passion and works wholeheartedly to inspire confidence and excellence in every student.",
    icon: Sparkles,
  },
  {
    step: "Step 4",
    name: "Bindra Knowledge Hub",
    title: "Our Mission Continues",
    content: "Today the academy continues this family legacy by providing quality education, personalized attention and a caring environment where every child has the opportunity to grow.",
    icon: Users,
  },
] as const;

const gridPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C9C9C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export function OurStory() {
  return (
    <Section id="our-story" aria-labelledby="our-story-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-6 inline-flex">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Our Story
          </Badge>
          <Heading as="h2" id="our-story-heading" size="display" align="center" className="max-w-4xl">
            A Legacy of Teaching. A Dream Fulfilled.
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-balance text-body-lg text-muted-foreground">
            Every great institution begins with a purpose. Bindra Knowledge Hub was founded on a
            family&apos;s lifelong dedication to education and the belief that every child deserves quality
            learning, personal attention, and the opportunity to achieve their full potential.
          </p>
        </div>

        {/* Two-column layout: Timeline + Image */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* LEFT: Timeline */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="hidden lg:block absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" aria-hidden="true" />

            <div className="space-y-10 pl-16 lg:pl-20">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute -left-16 top-2 size-4 rounded-full bg-primary border-4 border-background shadow-sm" aria-hidden="true" />
                  <div className="lg:hidden inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary mr-3 flex-shrink-0">
                    <span className="text-body-xs font-bold">{index + 1}</span>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="lg:w-32 flex-shrink-0">
                      <span className="inline-block text-body-xs font-medium text-primary uppercase tracking-wider mb-1">
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap mb-2">
                        <Heading as="h3" size="lg" className="text-foreground">
                          {step.name}
                        </Heading>
                        <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-body-sm text-primary font-medium">{step.title}</span>
                      </div>
                      <p className="text-body text-muted-foreground leading-relaxed">
                        {step.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Image Placeholder */}
          <div className="relative order-first lg:order-last">
            <div
              className="relative aspect-[4/5] max-w-lg mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/50"
              aria-hidden="true"
            >
              {/* Background pattern */}
              <div className="absolute inset-0" style={{ backgroundImage: gridPattern }} />

              {/* Center content */}
              <div className="relative z-10 flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <IconWrapper size="lg" variant="accent" className="mx-auto mb-6 opacity-60">
                    <Heart />
                  </IconWrapper>
                  <Heading as="h3" size="lg" className="mb-3">
                    Family at the Heart
                  </Heading>
                  <p className="text-body text-muted-foreground max-w-sm mx-auto">
                    Our story is built on family values, dedication, and the belief that every child
                    deserves to learn with heart.
                  </p>
                </div>

                {/* Decorative accents */}
                <div className="absolute top-6 left-6 size-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
                <div className="absolute bottom-6 right-6 size-24 rounded-full bg-accent/10 blur-2xl" aria-hidden="true" />
              </div>

              {/* Mobile-only placeholder note */}
              <p className="hidden lg:block mt-6 text-center text-body-xs text-muted-foreground">
                Placeholder — replace with family/academy photography in production
              </p>
            </div>
          </div>
        </div>

        {/* Mission Block */}
        <div className="mt-16 lg:mt-20">
          <div className="relative rounded-2xl p-8 lg:p-12 text-center bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/50">
            <Badge variant="accent" className="mb-4 inline-flex">
              <Sparkles aria-hidden="true" className="size-3" />
              Our Promise
            </Badge>
            <Heading as="h3" size="display" align="center" className="max-w-3xl mx-auto mb-4">
              Our Promise
            </Heading>
            <div className="max-w-2xl mx-auto space-y-3 text-body-lg text-muted-foreground">
              <p>We don&apos;t just prepare students for examinations.</p>
              <p>We help children discover confidence, curiosity and the courage to succeed.</p>
            </div>
          </div>
        </div>

        {/* Quote Block */}
        <div className="mt-12 lg:mt-16">
          <blockquote className="relative max-w-3xl mx-auto text-center p-8 lg:p-12 rounded-2xl bg-muted/30 border border-border/50">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="pt-4">
              <p className="text-body-lg lg:text-display-sm font-medium text-foreground leading-tight mb-2">
                &ldquo;Teaching with Heart.&rdquo;
              </p>
              <p className="text-body-lg lg:text-display-sm font-medium text-foreground leading-tight">
                &ldquo;Learning for Life.&rdquo;
              </p>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Heart aria-hidden="true" className="size-4" />
            </div>
          </blockquote>
        </div>

        {/* CTA Block */}
        <div className="mt-12 lg:mt-16 text-center">
          <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
            Become Part of Our Learning Family
          </Heading>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
            Join thousands of families who trust Bindra Knowledge Hub with their
            children&apos;s education and future.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[220px] px-8 min-h-[52px]">
              <a href="/admissions">Book a FREE Demo Class</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-w-[220px] px-8 min-h-[52px]">
              <a href="#meet-your-mentors">Meet Our Faculty</a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}