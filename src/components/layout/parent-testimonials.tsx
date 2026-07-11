"use client";

import { Star, MessageSquare, Shield, Heart, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface Testimonial {
  name: string;
  role: string;
  childClass: string;
  review: string;
  stars: number;
  icon: React.ComponentType<{ className?: string }>;
}

const testimonials : Testimonial[] = [
  {
    name: "Mrs. Neha Sharma",
    role: "Parent of Arjun (Class 10)",
    childClass: "Class 10",
    review: "The transformation in my son's confidence has been remarkable. He went from dreading math to looking forward to his classes. The teachers here genuinely care about each child's progress.",
    stars: 5,
    icon: Heart,
  },
  {
    name: "Mr. Rajesh Gupta",
    role: "Parent of Priya (Class 8)",
    childClass: "Class 8",
    review: "We chose Bindra Knowledge Hub for their concept-based approach. The structured study plan and regular assessments kept our son on track for JEE. The faculty's dedication is truly commendable.",
    stars: 5,
    icon: GraduationCap,
  },
  {
    name: "Mrs. Anita Verma",
    role: "Parent of Rohan (Class 12 - JEE)",
    childClass: "Class 12",
    review: "As a teacher myself, I'm very particular about education quality. The small batch sizes and personalized attention at Bindra Knowledge Hub exceeded my expectations. My daughter scored 98.4% in boards!",
    stars: 5,
    icon: Shield,
  },
  {
    name: "Mr. Sunil Kumar",
    role: "Parent of Anjali (Class 12 - NEET)",
    childClass: "Class 12",
    review: "The online classes were seamless and interactive. The faculty ensured no student felt left behind. Regular parent-teacher meetings kept us informed. Highly recommend for competitive exam prep.",
    stars: 5,
    icon: Star,
  },
  {
    name: "Mrs. Kavita Singh",
    role: "Parent of Vikram (Class 10)",
    childClass: "Class 10",
    review: "What impressed me most was the caring environment. My son never felt pressured, only supported. The teachers go above and beyond. State rank 12 in Social Science speaks for itself.",
    stars: 5,
    icon: Shield,
  },
  {
    name: "Mr. Amit Patel",
    role: "Parent of Diya (Class 11 - NEET)",
    childClass: "Class 11",
    review: "As a CA, I value structured thinking. Bindra Knowledge Hub instills that in students. My daughter topped her school in Commerce. The mentorship she received was invaluable.",
    stars: 5,
    icon: GraduationCap,
  },
];

export function ParentTestimonials() {
  return (
    <Section id="testimonials" aria-labelledby="testimonials-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <MessageSquare aria-hidden="true" className="size-3.5" />
            Parent Testimonials
          </Badge>
          <Heading as="h2" id="testimonials-heading" size="display" align="center" className="max-w-3xl">
            What Parents Say About Us
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Real stories from families who trusted us with their children&apos;s education and future.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full flex flex-col p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <CardContent className="flex flex-col h-full">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={`size-5 ${
                        i < testimonial.stars
                          ? "text-accent fill-accent"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="flex-1">
                  <p className="text-body-lg text-foreground leading-relaxed mb-4">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>
                </blockquote>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <IconWrapper size="sm" variant="accent" className="opacity-60">
                      <MessageSquare aria-hidden="true" className="size-4" />
                    </IconWrapper>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-body-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-body-xs text-muted-foreground">{testimonial.childClass}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-body-sm text-muted-foreground">
          All testimonials use placeholder content. Real parent reviews will be added in an upcoming sprint.
        </p>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[52px]">
            <a href="/testimonials">View All Testimonials</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}