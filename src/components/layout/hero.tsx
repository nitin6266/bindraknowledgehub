"use client";

import { Sparkles, Users, Award, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import { HeroWrapper } from "@/components/layout/hero-wrapper";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { HeroPlaceholder } from "@/components/layout/hero-placeholder";

/** Trust badge configuration */
const trustBadges = [
  { label: "20+ Years Teaching Legacy", icon: Award },
  { label: "Offline & Online Classes", icon: Target },
  { label: "Personalized Attention", icon: Users },
  { label: "Classes 3–12", icon: BookOpen },
] as const;

export function Hero() {
  return (
    <HeroWrapper id="hero" muted align="left" aria-labelledby="hero-heading">
      <Container className="flex min-h-[calc(100vh-4rem)] items-center gap-8 lg:gap-16 px-6 sm:px-8 lg:px-10">
        {/* Left: Content */}
        <div className="flex w-full flex-1 flex-col justify-center gap-6 lg:max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" className="size-4" />
            </span>
            <span className="text-body-sm font-medium text-primary">Bindra Knowledge Hub</span>
          </div>

          <Heading as="h1" id="hero-heading" size="display" className="max-w-3xl">
            Building Strong Foundations for Bright Futures
          </Heading>

          <p className="text-body-lg text-muted-foreground max-w-xl">
            At Bindra Knowledge Hub, we believe every child has the potential to achieve excellence.
            Guided by experienced educators and a family legacy of teaching, we provide personalized
            learning from Class 3 to 12, helping students build confidence, master concepts, and achieve
            academic success.
          </p>

          <div className="flex flex-col items-start gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto min-h-[52px] px-8">
              <Link href="/admissions">Book a FREE Demo Class</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] px-8">
              <Link href="#contact">Talk to an Academic Counsellor</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <badge.icon aria-hidden="true" className="size-4 opacity-60" />
                <span className="font-medium text-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hero Placeholder */}
        <div className="hidden lg:flex lg:w-1/2 lg:max-w-lg">
          <HeroPlaceholder size="lg" />
        </div>
      </Container>
    </HeroWrapper>
  );
}