"use client";

import { Sparkles, Users, Award, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import { HeroWrapper } from "@/components/layout/hero-wrapper";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { HeroPlaceholderInline } from "@/components/layout/hero-placeholder";

/** Trust chips shown on mobile (compact, first-screen trust signals). */
const trustChips = [
  { label: "20+ Years", icon: Award },
  { label: "Offline + Online", icon: Target },
  { label: "Small Batches", icon: Users },
  { label: "Classes 3–12", icon: BookOpen },
] as const;

/** Desktop trust badges (preserved from original layout). */
const trustBadges = [
  { label: "20+ Years Teaching Legacy", icon: Award },
  { label: "Offline & Online Classes", icon: Target },
  { label: "Personalized Attention", icon: Users },
  { label: "Classes 3–12", icon: BookOpen },
] as const;

export function Hero() {
  return (
    <HeroWrapper id="hero" muted align="left" aria-labelledby="hero-heading">
      <Container className="flex flex-col-reverse gap-8 py-10 lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:items-center lg:gap-16 lg:py-16 lg:px-8">
        {/* Content */}
        <div className="flex w-full flex-col items-center text-center lg:w-auto lg:flex-1 lg:items-start lg:text-left lg:max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" className="size-4" />
            </span>
            <span className="text-body-sm font-medium text-primary">Bindra Knowledge Hub</span>
          </div>

          <Heading as="h1" id="hero-heading" size="display" className="mt-5 max-w-3xl text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-6xl">
            Building Strong Foundations for Bright Futures
          </Heading>

          {/* Shorter subtitle on mobile, fuller copy on desktop */}
          <p className="mt-4 max-w-xl text-balance text-body lg:hidden">
            Personalized coaching from Class 3–12 that builds real confidence — online or offline.
          </p>
          <p className="mt-5 hidden max-w-xl text-body-lg text-muted-foreground lg:block">
            At Bindra Knowledge Hub, we believe every child has the potential to achieve excellence.
            Guided by experienced educators and a family legacy of teaching, we provide personalized
            learning from Class 3 to 12, helping students build confidence, master concepts, and achieve
            academic success.
          </p>

          <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Button asChild size="lg" className="w-full px-8 sm:w-auto min-h-[52px]">
              <Link href="/admissions">Book a FREE Demo Class</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full px-8 sm:w-auto min-h-[52px]">
              <Link href="/contact">Talk to an Academic Counsellor</Link>
            </Button>
          </div>

          {/* Mobile trust chips */}
          <ul className="mt-7 flex flex-wrap justify-center gap-2 lg:hidden">
            {trustChips.map((chip) => (
              <li
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-body-xs font-medium text-foreground"
              >
                <chip.icon aria-hidden="true" className="size-3.5 text-primary" />
                {chip.label}
              </li>
            ))}
          </ul>

          {/* Desktop trust badges (preserved) */}
          <div className="mt-7 hidden items-center gap-6 border-t border-border/50 pt-4 lg:flex">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <badge.icon aria-hidden="true" className="size-4 opacity-60" />
                <span className="font-medium text-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image (16:9 on mobile, tall on desktop) */}
        <div className="w-full lg:w-1/2 lg:max-w-lg">
          <HeroPlaceholderInline className="w-full rounded-3xl shadow-lg lg:aspect-[4/3]" />
        </div>
      </Container>
    </HeroWrapper>
  );
}
