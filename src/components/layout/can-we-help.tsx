"use client";

import { Mail, Phone, MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HelpOption {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
}

const helpOptions: HelpOption[] = [
  {
    icon: Mail,
    title: "Academic Counselling",
    description: "Speak with our counsellors to understand the best learning path for your child.",
    cta: "Book Counselling",
  },
  {
    icon: Phone,
    title: "Academic Assessment",
    description: "Schedule a free diagnostic test to identify strengths and improvement areas.",
    cta: "Book Assessment",
  },
  {
    icon: MessageSquare,
    title: "Demo Class",
    description: "Experience our teaching methodology with a complimentary demo session.",
    cta: "Book Demo",
  },
] as const;

const grades = Array.from({ length: 12 }, (_, i) => i + 1);

const interestOptions = [
  { value: "foundation", label: "Foundation (Classes 3–5)" },
  { value: "middle", label: "Middle School (Classes 6–8)" },
  { value: "high", label: "High School (Classes 9–10)" },
  { value: "senior", label: "Senior Secondary (Classes 11–12)" },
  { value: "competitive", label: "JEE/NEET Preparation" },
] as const;

export function CanWeHelp() {
  return (
    <Section id="can-we-help" aria-labelledby="can-we-help-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Can We Help Your Child?
          </Badge>
          <Heading as="h2" id="can-we-help-heading" size="display" align="center" className="max-w-3xl mx-auto">
            Every Child Learns Differently
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Tell us about your child and we&apos;ll help you find the right program, schedule, and mentor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {helpOptions.map((option, index) => (
            <Card key={index} className="h-full p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <CardContent className="flex w-full flex-col items-center gap-4 text-center">
                <IconWrapper size="lg" variant="accent" className="opacity-60">
                  <option.icon aria-hidden="true" className="size-6" />
                </IconWrapper>
                <div className="flex flex-col items-center gap-2">
                  <Heading as="h3" size="md" className="text-foreground">
                    {option.title}
                  </Heading>
                  <p className="text-body text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto min-w-[160px]">
                  <a href="#enquiry-form">{option.cta}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enquiry Form */}
        <div id="enquiry-form" className="mt-16 lg:mt-20">
          <div className="relative rounded-2xl p-8 lg:p-12 text-center bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/50">
            <IconWrapper size="lg" variant="accent" className="mx-auto mb-6 opacity-60">
              <Sparkles />
            </IconWrapper>
            <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
              Submit an Enquiry
            </Heading>
            <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
              Fill out this form and our academic counsellors will reach out within 24 hours.
            </p>

            <form className="mx-auto max-w-2xl space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="parent-name" className="block text-body-sm font-medium text-foreground mb-1.5">
                    Parent Name *
                  </label>
                  <Input
                    id="parent-name"
                    name="parentName"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="child-name" className="block text-body-sm font-medium text-foreground mb-1.5">
                    Child Name *
                  </label>
                  <Input
                    id="child-name"
                    name="childName"
                    placeholder="Child's name"
                    required
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-body-sm font-medium text-foreground mb-1.5">
                    Phone (WhatsApp) *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-body-sm font-medium text-foreground mb-1.5">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-body-sm font-medium text-foreground mb-1.5">
                    Current Grade *
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    className="w-full h-11 rounded-full border border-input bg-background px-4 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select grade</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade.toString()}>
                        Class {grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="interest" className="block text-body-sm font-medium text-foreground mb-1.5">
                    Area of Interest
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    className="w-full h-11 rounded-full border border-input bg-background px-4 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select subject/course</option>
                    {interestOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-body-sm font-medium text-foreground mb-1.5">
                  Message / Specific Requirements
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your child's current academic needs, preferred learning mode (online/offline), schedule preferences, or any specific concerns..."
                  className="w-full"
                  required
                />
              </div>

              <Button size="lg" className="w-full sm:w-auto min-w-[280px] px-10" type="submit">
                Submit Enquiry
              </Button>

              <p className="text-center text-body-xs text-muted-foreground">
                This is a placeholder form. Backend integration arrives in an upcoming sprint.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}