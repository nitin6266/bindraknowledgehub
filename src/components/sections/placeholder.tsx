import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import type { PageMeta } from "@/types";

/**
 * Generic placeholder shown on routes not yet built (Sprint 1).
 * Keeps every route consistent, on-brand and accessible while real
 * sections are authored in later sprints.
 */
export function PagePlaceholder({ page }: { page: PageMeta }) {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <Badge variant="accent" className="mb-6">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Coming Soon
        </Badge>

        <IconWrapper size="lg" variant="accent" className="mb-8" aria-hidden="true">
          <Sparkles />
        </IconWrapper>

        <Heading as="h1" size="display" align="center" className="max-w-3xl">
          {page.title}
        </Heading>

        <p className="mt-5 max-w-prose text-balance text-body-lg text-muted-foreground">
          {page.description}
        </p>

        <p className="mt-10 text-body-sm text-muted-foreground">
          This page is part of the Bindra Knowledge Hub foundation. Full content arrives in an
          upcoming sprint.
        </p>
      </Container>
    </Section>
  );
}
