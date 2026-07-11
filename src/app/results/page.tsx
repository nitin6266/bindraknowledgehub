import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Users,
  Award,
  ClipboardCheck,
  Clock,
  Stethoscope,
  Wrench,
  FlaskConical,
  GraduationCap,
  Rocket,
  Microscope,
  type LucideIcon,
} from "lucide-react";

import { buildMetadata } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { resultsContent as c } from "@/content/results";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Paragraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Surface } from "@/components/layout/surface";
import { Grid } from "@/components/layout/grid";
import { SectionHeader } from "@/components/utility/section-header";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { CtaBanner } from "@/components/utility/cta-banner";
import { StatisticCard } from "@/cards/statistic-card";
import { ResultCard } from "@/cards/result-card";
import { FeatureCard } from "@/cards/feature-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = buildMetadata({
  title: "Results",
  description: c.hero.subtitle,
  alternates: { canonical: "/results" },
  openGraph: {
    title: "Results | Bindra Knowledge Hub",
    description: c.hero.subtitle,
    type: "website",
  },
});

const statIcons: Record<(typeof c.stats.items)[number]["icon"], LucideIcon> = {
  users: Users,
  award: Award,
  clipboard: ClipboardCheck,
  clock: Clock,
};

const aspirationIcons: Record<(typeof c.aspirations.items)[number]["icon"], LucideIcon> = {
  doctor: Stethoscope,
  engineer: Wrench,
  scientist: FlaskConical,
  teacher: GraduationCap,
  entrepreneur: Rocket,
  researcher: Microscope,
};

function Monogram({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-gradient-to-b from-primary/10 to-accent/10 font-heading text-3xl font-bold text-primary ${className ?? ""}`}
    >
      {initials}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div aria-label={`Rated ${rating} out of 5`} className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i < rating ? "size-4 fill-accent text-accent" : "size-4 text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Results" },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "https://www.bindraknowledgehub.com/" },
              { name: "Results", url: "https://www.bindraknowledgehub.com/results" },
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
                <Link href={c.hero.ctaHref}>{c.hero.ctaLabel}</Link>
              </Button>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
              <Image
                src="/results/hero.svg"
                alt="Celebrating student success at Bindra Knowledge Hub"
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

      {/* 2. Academic Excellence */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.stats.eyebrow}
            title={c.stats.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.stats.items.map((stat) => (
              <StatisticCard
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={statIcons[stat.icon]}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 3. Featured Achievers */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.featured.eyebrow}
            title={c.featured.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.featured.achievers.map((a) => (
              <Card key={a.name} className="flex h-full flex-col overflow-hidden">
                <Monogram initials={a.initials} className="aspect-[4/5] w-full" />
                <CardHeader>
                  <CardTitle>{a.name}</CardTitle>
                  <CardDescription>
                    {a.className} · {a.school}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="accent">{a.score}</Badge>
                    <Badge variant="outline">{a.achievement}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <p className="text-body-sm text-foreground">
                    <span className="font-medium text-primary">Future goal:</span> {a.goal}
                  </p>
                  <Paragraph size="sm" className="italic text-muted-foreground">
                    “{a.teacherQuote}”
                  </Paragraph>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 4. Wall of Success */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.wall.eyebrow}
            title={c.wall.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.wall.students.map((s) => (
              <Card key={s.name} className="flex h-full flex-col overflow-hidden">
                <Monogram initials={s.initials} className="aspect-square w-full" />
                <CardHeader>
                  <CardTitle className="text-heading-sm">{s.name}</CardTitle>
                  <CardDescription>{s.className}</CardDescription>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="accent">{s.marks}</Badge>
                    <Badge variant="outline">{s.achievement}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Paragraph size="sm">{s.message}</Paragraph>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/contact">
                      View Details <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 5. Success Stories */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.stories.eyebrow}
            title={c.stories.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <div className="mx-auto grid max-w-5xl gap-6">
            {c.stories.items.map((story) => (
              <Surface key={story.name} tone="card" shadow="sm" radius="xl" className="p-8">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="md:w-40 md:shrink-0">
                    <Monogram initials={story.initials} className="h-24 w-24 rounded-full text-2xl" />
                    <p className="mt-3 font-heading text-heading-sm font-semibold text-foreground">
                      {story.name}
                    </p>
                  </div>
                  <div className="grid flex-1 gap-4 sm:grid-cols-2">
                    <StoryField label="Journey" text={story.journey} />
                    <StoryField label="Challenges" text={story.challenges} />
                    <StoryField label="Support received" text={story.support} />
                    <StoryField label="Outcome" text={story.outcome} />
                  </div>
                </div>
                <Paragraph size="lg" className="mt-6 border-l-2 border-accent pl-5 italic">
                  “{story.quote}”
                </Paragraph>
              </Surface>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. University & Career Aspirations */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.aspirations.eyebrow}
            title={c.aspirations.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.aspirations.items.map((item) => (
              <FeatureCard
                key={item.title}
                icon={aspirationIcons[item.icon]}
                title={item.title}
                description={item.message}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 7. Year-wise Results */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.years.eyebrow}
            title={c.years.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {c.years.items.map((year, i) => (
              <AccordionItem key={year.year} value={`year-${i}`}>
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <span className="font-heading text-heading-sm font-semibold text-primary">
                      {year.year}
                    </span>
                    <span className="text-body-sm font-normal text-muted-foreground">{year.note}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <Grid cols={3} gap="md" className="pt-2">
                    {year.results.map((r) => (
                      <ResultCard key={r.name} exam={r.exam} score={r.score} subtitle={r.name} />
                    ))}
                  </Grid>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* 8. Parent Appreciation */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.parents.eyebrow}
            title={c.parents.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.parents.items.map((p) => (
              <Card key={p.name} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <Monogram initials={p.initials} className="h-14 w-14 shrink-0 rounded-full text-lg" />
                    <div>
                      <p className="font-heading text-heading-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-body-sm text-muted-foreground">{p.studentClass}</p>
                    </div>
                  </div>
                  <StarRating rating={p.rating} />
                  <Paragraph size="sm" className="flex-1">
                    “{p.feedback}”
                  </Paragraph>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 9. Final CTA */}
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

function StoryField({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">{label}</p>
      <p className="mt-1 text-body-sm text-muted-foreground">{text}</p>
    </div>
  );
}
