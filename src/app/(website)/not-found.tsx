import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or may have moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section className="flex min-h-[80vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <Badge variant="accent" className="mb-6">
          <Compass aria-hidden="true" className="size-3.5" />
          404
        </Badge>

        <IconWrapper size="lg" variant="soft" className="mb-8" aria-hidden="true">
          <Compass />
        </IconWrapper>

        <Heading as="h1" size="display" align="center" className="max-w-2xl">
          This page wandered off
        </Heading>

        <Subheading align="center" className="mt-4 max-w-prose">
          The page you're looking for doesn't exist, or may have moved. Let's get you back to
          something helpful.
        </Subheading>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="cta" size="lg">
            <Link href="/">
              <Home aria-hidden="true" className="size-4" />
              Return home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admissions">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Explore admissions
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
