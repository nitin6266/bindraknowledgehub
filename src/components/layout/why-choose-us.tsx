"use client";

import {
  Award,
  GraduationCap,
  Users,
  Target,
  Shield,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

/** Feature cards configuration - matches prompt specification exactly */
const features: FeatureItem[] = [
  {
    icon: Award,
    title: "20+ Years Teaching Legacy",
    description: "Inspired by a family dedicated to quality education and student success.",
  },
  {
    icon: GraduationCap,
    title: "Experienced Faculty",
    description: "Learn from university-level educators and subject specialists passionate about teaching.",
  },
  {
    icon: Users,
    title: "Small Batch Learning",
    description: "Every student receives individual attention and continuous academic guidance.",
  },
  {
    icon: Target,
    title: "Offline & Online Classes",
    description: "Flexible learning options for students across India and abroad.",
  },
  {
    icon: Shield,
    title: "Proven Results",
    description: "Consistent track record of top ranks, score improvements, and student milestones.",
  },
  {
    icon: Heart,
    title: "Personalized Attention",
    description: "Every student's learning journey is tracked, supported, and celebrated individually.",
  },
] as const;

/** CTA configuration */
const ctaConfig = {
  primary: {
    label: "Book a FREE Demo Class",
    href: "/admissions",
    variant: "primary" as const,
  },
  secondary: {
    label: "Talk to an Academic Counsellor",
    href: "/contact",
    variant: "outline" as const,
  },
};

export function WhyChooseUs() {
  return (
    <Section id="why-choose-us" aria-labelledby="why-choose-us-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <Heading
            as="h2"
            id="why-choose-us-heading"
            size="display"
            align="center"
            className="max-w-3xl mx-auto"
          >
            Why Choose Us
          </Heading>
          <p className="mt-6 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Every decision at Bindra Knowledge Hub is guided by what's best for your child's
            growth and confidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex h-full flex-col items-start p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="flex w-full flex-col items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon aria-hidden="true" className="size-6" />
                </div>
                <h3 className="font-heading text-heading-md font-semibold leading-snug text-foreground">
                  {feature.title}
                </h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-12 lg:mt-16 text-center">
          <p className="text-body text-muted-foreground mb-6 max-w-xl mx-auto">
            Ready to see how Bindra Knowledge Hub can help your child thrive?
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="min-w-[280px] min-h-[52px] px-8"
            >
              <a href={ctaConfig.primary.href}>{ctaConfig.primary.label}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[280px] min-h-[52px] px-8"
            >
              <a href={ctaConfig.secondary.href}>{ctaConfig.secondary.label}</a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}