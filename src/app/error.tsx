"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconWrapper } from "@/components/ui/icon-wrapper";

/**
 * Route-level error boundary (Next.js `error.tsx`). Catches render errors
 * in child segments and offers a recovery path. `reset` re-renders the
 * segment; `Home` returns to a safe route.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // A real app would forward this to an error-reporting service.
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[80vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <Badge variant="accent" className="mb-6">
          <AlertTriangle aria-hidden="true" className="size-3.5" />
          Something went wrong
        </Badge>

        <IconWrapper size="lg" variant="soft" className="mb-8" aria-hidden="true">
          <AlertTriangle />
        </IconWrapper>

        <Heading as="h1" size="display" align="center" className="max-w-2xl">
          We hit a snag
        </Heading>

        <Subheading align="center" className="mt-4 max-w-prose">
          An unexpected error occurred while loading this page. You can try again — if it persists,
          head back home and we'll help you from there.
        </Subheading>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button variant="cta" size="lg" onClick={reset}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home aria-hidden="true" className="size-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
