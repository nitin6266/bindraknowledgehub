import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Lightbulb,
  UserCheck,
  ClipboardCheck,
  Users,
  MessageSquare,
  Smile,
  type LucideIcon,
} from "lucide-react";

import { buildMetadata, siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { coursesContent as c } from "@/content/courses";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Paragraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/layout/surface";
import { Grid } from "@/components/layout/grid";
import { SectionHeader } from "@/components/utility/section-header";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { CtaBanner } from "@/components/utility/cta-banner";
import { CourseCard } from "@/cards/course-card";
import { FeatureCard } from "@/cards/feature-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description: c.hero.subtitle,
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Courses | Bindra Knowledge Hub",
    description: c.hero.subtitle,
    type: "website",
  },
});

const approachIcons: Record<(typeof c.approach.items)[number]["icon"], LucideIcon> = {
  bulb: Lightbulb,
  user: UserCheck,
  clipboard: ClipboardCheck,
  users: Users,
  message: MessageSquare,
  smile: Smile,
};

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <Check className="size-4" />
          </span>
          <span className="text-body text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CoursesPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Courses" },
  ];

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: c.overview.cards.map((card, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: card.title,
        description: card.description,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          sameAs: siteConfig.url,
        },
      },
    })),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "https://www.bindraknowledgehub.com/" },
              { name: "Courses", url: "https://www.bindraknowledgehub.com/courses" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(courseStructuredData) }}
      />

      {/* 1. Hero */}
      <Section className="pt-12 lg:pt-16">
        <Container>
          <Breadcrumb items={crumbs} className="mb-8" />
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col items-start">
              <Badge variant="accent" className="mb-5">
                {c.hero.eyebrow}
              </Badge>
              <Heading as="h1" size="display" className="max-w-xl">
                {c.hero.title}
              </Heading>
              <Subheading className="mt-5 max-w-prose">{c.hero.subtitle}</Subheading>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="cta" size="lg">
                  <Link href={c.hero.primaryHref}>{c.hero.primaryLabel}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={c.hero.secondaryHref}>{c.hero.secondaryLabel}</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
              <Image
                src="/courses/hero.svg"
                alt="Students learning together at Bindra Knowledge Hub"
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Program Overview */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.overview.eyebrow}
            title={c.overview.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.overview.cards.map((card) => (
              <CourseCard
                key={card.title}
                title={card.title}
                description={card.description}
                level={card.meta}
                href={card.href}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 3. Junior Program */}
      <Section className="bg-surface/40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeader eyebrow={c.junior.eyebrow} title={c.junior.title} align="left" />
              <Paragraph size="lg" className="mt-5 max-w-prose">
                {c.junior.intro}
              </Paragraph>
              <Button asChild variant="cta" size="lg" className="mt-8">
                <Link href={c.junior.cta.href}>{c.junior.cta.label}</Link>
              </Button>
            </div>
            <Surface tone="card" shadow="sm" radius="xl" className="p-8">
              <FeatureList items={c.junior.features} />
            </Surface>
          </div>
        </Container>
      </Section>

      {/* 4. Senior Program */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.senior.eyebrow}
            title={c.senior.title}
            align="center"
            className="mx-auto mb-10 max-w-2xl"
          />
          <Paragraph size="lg" className="mx-auto mb-10 max-w-3xl text-center">
            {c.senior.intro}
          </Paragraph>
          <div className="mx-auto mb-12 max-w-3xl">
            <FeatureList items={c.senior.features} />
          </div>
          <Grid cols={2} gap="lg" className="mx-auto max-w-3xl">
            {c.senior.subjects.map((subject) => (
              <CourseCard
                key={subject.title}
                title={subject.title}
                description={subject.description}
                level={subject.level}
                href="/admissions"
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 5. Online Learning */}
      <Section className="bg-surface/40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Surface tone="card" shadow="sm" radius="xl" className="order-2 p-8 lg:order-1">
              <FeatureList items={c.online.features} />
            </Surface>
            <div className="order-1 lg:order-2">
              <SectionHeader eyebrow={c.online.eyebrow} title={c.online.title} align="left" />
              <Paragraph size="lg" className="mt-5 max-w-prose">
                {c.online.intro}
              </Paragraph>
              <Button asChild variant="cta" size="lg" className="mt-8">
                <Link href={c.online.cta.href}>{c.online.cta.label}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Teaching Approach */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.approach.eyebrow}
            title={c.approach.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.approach.items.map((item) => (
              <FeatureCard
                key={item.title}
                icon={approachIcons[item.icon]}
                title={item.title}
                description={item.description}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 7. FAQ */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.faq.eyebrow}
            title={c.faq.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {c.faq.items.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <Paragraph>{item.answer}</Paragraph>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* 8. Final CTA */}
      <Section>
        <Container>
          <CtaBanner
            title={c.finalCta.title}
            description={c.finalCta.description}
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent" size="lg">
                  <Link href={c.finalCta.primaryHref}>{c.finalCta.primaryLabel}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href={c.finalCta.secondaryHref}>{c.finalCta.secondaryLabel}</Link>
                </Button>
              </div>
            }
          />
        </Container>
      </Section>
    </article>
  );
}
