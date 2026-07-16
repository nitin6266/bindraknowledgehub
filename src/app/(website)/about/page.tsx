import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  Award,
  Sprout,
  ShieldCheck,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { buildMetadata } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { aboutContent as c } from "@/content/about";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Paragraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Surface } from "@/components/layout/surface";
import { Grid } from "@/components/layout/grid";
import { Quote } from "@/components/typography/quote";
import { SectionHeader } from "@/components/utility/section-header";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { CtaBanner } from "@/components/utility/cta-banner";
import { TimelineCard } from "@/cards/timeline-card";
import { FacultyCard } from "@/cards/faculty-card";
import { FeatureCard } from "@/cards/feature-card";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: c.hero.subtitle,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About Us | Bindra Knowledge Hub`,
    description: c.hero.subtitle,
    type: "website",
  },
});

const valueIcons: Record<(typeof c.values.items)[number]["icon"], LucideIcon> = {
  heart: HeartHandshake,
  award: Award,
  sprout: Sprout,
  shield: ShieldCheck,
  book: BookOpen,
  sparkles: Sparkles,
};

export default function AboutPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "About" },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "https://www.bindraknowledgehub.com/" },
              { name: "About", url: "https://www.bindraknowledgehub.com/about" },
            ]),
          ),
        }}
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
              <Button asChild variant="cta" size="lg" className="mt-8">
                <Link href="/admissions">Book a FREE Demo Class</Link>
              </Button>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
              <Image
                src="/about/hero.svg"
                alt="A warm, welcoming learning space at Bindra Knowledge Hub"
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

      {/* 2. Our Story */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeader
              eyebrow={c.story.eyebrow}
              title={c.story.title}
              align="left"
              className="lg:sticky lg:top-24 lg:self-start"
            />
            <div className="space-y-5">
              {c.story.paragraphs.map((p, i) => (
                <Paragraph key={i} size="lg">
                  {p}
                </Paragraph>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Timeline */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.timeline.eyebrow}
            title={c.timeline.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <ol className="relative mx-auto max-w-3xl border-l border-border pl-6 sm:pl-8">
            {c.timeline.items.map((item, i) => (
              <li key={item.title} className={i === c.timeline.items.length - 1 ? "" : "mb-8"}>
                <span
                  aria-hidden="true"
                  className="absolute -left-[9px] mt-2 h-4 w-4 rounded-full border-2 border-background bg-accent"
                />
                <TimelineCard year={item.phase} title={item.title} description={item.description} />
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 4. Mission */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.mission.eyebrow}
            title={c.mission.title}
            align="center"
            className="mx-auto mb-10 max-w-2xl"
          />
          <Card className="mx-auto max-w-3xl border-accent/30 p-2 shadow-lg">
            <CardContent className="p-8 text-center sm:p-12">
              <Paragraph size="lg" className="text-balance">
                {c.mission.body}
              </Paragraph>
            </CardContent>
          </Card>
        </Container>
      </Section>

      {/* 5. Vision */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.vision.eyebrow}
            title={c.vision.title}
            align="center"
            className="mx-auto mb-10 max-w-2xl"
          />
          <Quote className="mx-auto max-w-3xl border-accent/40 text-center">
            {c.vision.body}
          </Quote>
        </Container>
      </Section>

      {/* 6. Core Values */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.values.eyebrow}
            title={c.values.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.values.items.map((value) => (
              <FeatureCard
                key={value.title}
                icon={valueIcons[value.icon]}
                title={value.title}
                description={value.description}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 7. Meet the Family */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.family.eyebrow}
            title={c.family.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-4xl">
            {c.family.members.map((member) => (
              <FacultyCard
                key={member.name}
                name={member.name}
                role={member.role}
                initials={member.initials}
                image={member.image}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 8. Letter to Parents */}
      <LetterSection letter={c.letterToParents} />

      {/* 9. Letter to Students */}
      <LetterSection letter={c.letterToStudents} />

      {/* 10. Final CTA */}
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

function LetterSection({ letter }: { letter: (typeof c.letterToParents) | (typeof c.letterToStudents) }) {
  return (
    <Section className="bg-surface/40">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow={letter.eyebrow} title={letter.title} align="left" className="mb-8" />
          <Surface tone="card" shadow="md" radius="xl" className="p-8 sm:p-10">
            <p className="font-heading text-heading-sm font-semibold text-foreground">{letter.salutation}</p>
            <div className="mt-5 space-y-4">
              {letter.paragraphs.map((p, i) => (
                <Paragraph key={i} size="lg">
                  {p}
                </Paragraph>
              ))}
            </div>
            <p className="mt-6 text-body font-medium text-muted-foreground">{letter.signoff}</p>
            <p className="mt-1 font-heading text-heading-sm font-semibold text-foreground">
              {letter.signature}
            </p>
          </Surface>
        </div>
      </Container>
    </Section>
  );
}
