"use client";

import { MessageSquare, Star } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface Testimonial {
  name: string;
  role: string;
  studentClass: string;
  review: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Mrs. Priya Sharma",
    role: "Parent of Arjun (Class 10)",
    studentClass: "Class 10",
    review: "Bindra Knowledge Hub has been a game-changer for my son. The personalized attention and concept-based teaching have transformed his approach to learning. His confidence in Mathematics and Science has soared, and he actually enjoys studying now!",
    stars: 5,
  },
  {
    name: "Mr. Rajesh Kumar",
    role: "Parent of Priya (Class 8)",
    studentClass: "Class 8",
    review: "The faculty genuinely cares about each student's progress. My daughter was struggling with Chemistry, but after joining the weekend batch, she not only improved her grades but developed a genuine interest in the subject. Highly recommend!",
    stars: 5,
  },
  {
    name: "Mrs. Anita Verma",
    role: "Parent of Rohan (Class 12 - JEE)",
    studentClass: "Class 12",
    review: "As a working parent, I appreciated the regular updates and the transparent communication. The JEE integrated program is well-structured, and the mock tests perfectly simulate the actual exam environment. My son secured a great rank!",
    stars: 5,
  },
  {
    name: "Mr. Sunil Gupta",
    role: "Parent of Anjali (Class 6)",
    studentClass: "Class 6",
    review: "We enrolled our daughter in the Foundation program, and the change in her study habits has been remarkable. The interactive teaching methods and regular assessments keep her engaged. She now manages her studies independently.",
    stars: 5,
  },
  {
    name: "Mrs. Kavita Singh",
    role: "Parent of Vikram (Class 11 - NEET)",
    studentClass: "Class 11",
    review: "The NEET preparation here is exceptional. The faculty's deep subject knowledge, combined with regular doubt-clearing sessions, made a huge difference. The personalized study plan helped my son balance board exams and NEET preparation effectively.",
    stars: 5,
  },
  {
    name: "Mr. Amit Patel",
    role: "Parent of Diya (Class 9)",
    studentClass: "Class 9",
    review: "What sets this academy apart is the family-like environment. My daughter feels supported, not pressured. The regular parent-teacher meetings give us clear insights into her progress. The online/offline flexibility is a huge plus for our schedule.",
    stars: 5,
  },
] as const;

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
            Real families share their experience with Bindra Knowledge Hub and the impact on their children's academic journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
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
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-body-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-body-xs text-muted-foreground">{testimonial.studentClass}</p>
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