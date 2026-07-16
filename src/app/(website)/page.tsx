import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { buildMetadata } from "@/lib/site";
import { pages } from "@/content/pages";
import { Hero } from "@/components/layout/hero";
import { TrustBar } from "@/components/layout/trust-bar";
import { WhyChooseUs } from "@/components/layout/why-choose-us";
import { Courses } from "@/components/layout/courses";
import { MeetYourMentors } from "@/components/layout/meet-your-mentors";
import { WallOfSuccess } from "@/components/layout/wall-of-success";
import { FreeAssessment } from "@/components/layout/free-assessment";
import { Gallery } from "@/components/layout/gallery";
import { ParentTestimonials } from "@/components/layout/parent-testimonials";
import { CtaBanner } from "@/components/utility/cta-banner";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/layout/surface";

const page = pages.home;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.description,
  alternates: { canonical: page.slug },
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyChooseUs />
      <StoryPreview />
      <Courses />
      <MeetYourMentors />
      <WallOfSuccess />
      <FreeAssessment />
      <Gallery />
      <ParentTestimonials />
      <FinalCta />
    </>
  );
}

/** Slim preview of the full story — links to the /about page. */
function StoryPreview() {
  return (
    <Section className="bg-surface/40 py-10 lg:py-section-y">
      <Container>
        <Surface tone="card" shadow="sm" radius="xl" className="overflow-hidden">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-10">
            <div className="flex flex-col items-start">
              <Badge variant="accent" className="mb-4">
                Our Story
              </Badge>
              <Heading as="h2" size="lg">
                A 20+ year teaching legacy, built on family values
              </Heading>
              <Paragraph className="mt-3 max-w-prose">
                Bindra Knowledge Hub was founded on a family&apos;s lifelong dedication to
                education — combining care, discipline and academic excellence to help every
                child learn with confidence.
              </Paragraph>
              <Button asChild variant="outline" size="lg" className="mt-6">
                <Link href="/about">
                  Read Our Story
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-primary/5 p-8">
              <BookOpen aria-hidden="true" className="size-20 text-accent" />
            </div>
          </div>
        </Surface>
      </Container>
    </Section>
  );
}

/** Closing conversion band — one clear action. */
function FinalCta() {
  return (
    <Section className="py-10 lg:py-section-y">
      <Container>
        <CtaBanner
          title="Your child's brighter beginning starts here"
          description="Book a free demo or assessment today — our team will help you find the right path."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link href="/admissions">Book a FREE Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          }
        />
      </Container>
    </Section>
  );
}
