"use client";

import { Star, Users, GraduationCap, Award, BookOpen, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface SuccessCard {
  name: string;
  class: string;
  school: string;
  marks: string;
  achievement: string;
  quote: string;
  icon: React.ComponentType<{ className?: string }>;
}

const successStories: SuccessCard[] = [
  {
    name: "Aarav Sharma",
    class: "Class 10",
    school: "DAV Public School",
    marks: "98.4%",
    achievement: "District Topper - Science",
    quote: "The conceptual clarity I gained at Bindra Knowledge Hub helped me top my district. The teachers don't just teach; they make you understand.",
    icon: Award,
  },
  {
    name: "Priya Singh",
    class: "Class 12",
    school: "Kendriya Vidyalaya",
    marks: "96.2%",
    achievement: "NEET Qualified - AIR 1,247",
    quote: "The personalized study plan and regular mock tests kept me on track. My doubts were always resolved the same day.",
    icon: Target,
  },
  {
    name: "Rohan Gupta",
    class: "Class 10",
    school: "St. Mary's Academy",
    marks: "97.8%",
    achievement: "School Topper - Mathematics",
    quote: "The small batch size meant every question got answered. The weekly tests kept me consistently prepared throughout the year.",
    icon: GraduationCap,
  },
  {
    name: "Ananya Verma",
    class: "Class 12",
    school: "Delhi Public School",
    marks: "95.6%",
    achievement: "JEE Advanced - AIR 3,412",
    quote: "The concept-based approach and regular doubt sessions built my confidence. I never felt alone in my preparation journey.",
    icon: BookOpen,
  },
  {
    name: "Karan Malhotra",
    class: "Class 10",
    school: "Ryan International",
    marks: "98.0%",
    achievement: "State Rank 12 - Social Science",
    quote: "The timeline and study plan kept me organized. Teachers were always available for doubts, even on weekends.",
    icon: Star,
  },
  {
    name: "Meera Patel",
    class: "Class 12",
    school: "Amity International",
    marks: "94.4%",
    achievement: "CBSE Board - Commerce Stream Topper",
    quote: "The caring environment made all the difference. I felt supported not just as a student, but as a person.",
    icon: Users,
  },
] as const;

export function WallOfSuccess() {
  return (
    <Section id="wall-of-success" aria-labelledby="wall-of-success-heading" className="py-10 lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <Award aria-hidden="true" className="size-3" />
            Wall of Success
          </Badge>
          <Heading as="h2" id="wall-of-success-heading" size="display" align="center" className="max-w-3xl">
            Celebrating Student Success
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Our students&apos; achievements speak louder than any promise. Here are some of the many success stories
            from Bindra Knowledge Hub families.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {successStories.slice(0, 3).map((story, index) => (
              <Card key={index} className="h-full flex flex-col p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl max-lg:rounded-2xl">
              <CardContent className="flex flex-col h-full gap-4">
                <div className="flex items-center gap-2">
                  <IconWrapper size="md" variant="accent">
                    <story.icon aria-hidden="true" className="size-5" />
                  </IconWrapper>
                  <span className="text-body-xs font-medium text-primary uppercase tracking-wider">
                    {story.achievement}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap aria-hidden="true" className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{story.name}</p>
                    <p className="text-body-xs text-muted-foreground">{story.class} • {story.school}</p>
                  </div>
                </div>
                <p className="font-heading text-heading-sm font-semibold text-foreground">{story.marks}</p>
                <p className="text-body-sm text-primary font-medium">{story.achievement}</p>
                <blockquote className="text-body-sm text-muted-foreground italic border-l-2 border-primary/30 pl-4">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 lg:mt-16 text-center">
          <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
            View All Results
          </Heading>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
            Explore more success stories and see how Bindra Knowledge Hub helps students achieve their goals.
          </p>
          <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[52px]">
            <a href="/results">View All Results</a>
          </Button>
          <p className="mt-8 text-center text-body-sm text-muted-foreground">
            This section uses placeholder content. Full results gallery arrives in an upcoming sprint.
          </p>
        </div>
      </Container>
    </Section>
  );
}