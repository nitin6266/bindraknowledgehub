import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MousePointerClick,
  Lightbulb,
  HelpCircle,
  UserCheck,
  ShieldCheck,
  Users,
  ClipboardCheck,
  HeartHandshake,
  FlaskConical,
  Award,
  Trophy,
  Wrench,
  Flame,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";

import { buildMetadata } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { communityContent as c } from "@/content/community";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Paragraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Surface } from "@/components/layout/surface";
import { Grid } from "@/components/layout/grid";
import { SectionHeader } from "@/components/utility/section-header";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { CtaBanner } from "@/components/utility/cta-banner";
import { FeatureCard } from "@/cards/feature-card";
import { GalleryGrid } from "@/components/community/gallery-grid";

export const metadata: Metadata = buildMetadata({
  title: "Success Stories & Campus Life",
  description: c.hero.subtitle,
  alternates: { canonical: "/community" },
  openGraph: {
    title: "Success Stories & Campus Life | Bindra Knowledge Hub",
    description: c.hero.subtitle,
    type: "website",
  },
});

const classroomIcons: Record<(typeof c.classroom.items)[number]["icon"], LucideIcon> = {
  pointer: MousePointerClick,
  bulb: Lightbulb,
  help: HelpCircle,
  user: UserCheck,
};

const environmentIcons: Record<(typeof c.environment.items)[number]["icon"], LucideIcon> = {
  shield: ShieldCheck,
  users: Users,
  clipboard: ClipboardCheck,
  heart: HeartHandshake,
};

const activityIcons: Record<(typeof c.activities.items)[number]["icon"], LucideIcon> = {
  flask: FlaskConical,
  award: Award,
  trophy: Trophy,
  workshop: Wrench,
  flame: Flame,
  party: PartyPopper,
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

function ActivityIcon({ name }: { name: (typeof c.activities.items)[number]["icon"] }) {
  const Icon = activityIcons[name];
  return <Icon className="size-6" />;
}

export default function CommunityPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Community" },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "https://www.bindraknowledgehub.com/" },
              { name: "Community", url: "https://www.bindraknowledgehub.com/community" },
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
                src="/community/hero.svg"
                alt="Students and educators at Bindra Knowledge Hub"
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

      {/* 2. Student Success Stories */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.stories.eyebrow}
            title={c.stories.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-6xl">
            {c.stories.items.map((s) => (
              <Card key={s.name} className="flex h-full flex-col overflow-hidden">
                <Monogram initials={s.initials} className="aspect-[4/5] w-full" />
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                  <CardDescription>{s.className}</CardDescription>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="accent">{s.achievement}</Badge>
                    <Badge variant="outline">{s.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <p className="text-body-sm text-foreground">
                    <span className="font-medium text-primary">Future goal:</span> {s.goal}
                  </p>
                  <Paragraph size="sm" className="italic text-muted-foreground">
                    &ldquo;{s.quote}&rdquo;
                  </Paragraph>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 3. Parent Testimonials */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.testimonials.eyebrow}
            title={c.testimonials.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-6xl">
            {c.testimonials.items.map((t) => (
              <Card key={t.name} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <Monogram initials={t.initials} className="h-14 w-14 shrink-0 rounded-full text-lg" />
                    <div>
                      <p className="font-heading text-heading-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-body-sm text-muted-foreground">{t.studentClass}</p>
                    </div>
                  </div>
                  <StarRating rating={t.rating} />
                  <Paragraph size="sm" className="flex-1">
                    &ldquo;{t.review}&rdquo;
                  </Paragraph>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 4. Classroom Experience */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.classroom.eyebrow}
            title={c.classroom.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.classroom.items.map((item) => (
              <FeatureCard
                key={item.title}
                icon={classroomIcons[item.icon]}
                title={item.title}
                description={item.description}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 5. Activities & Celebrations */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.activities.eyebrow}
            title={c.activities.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-6xl">
            {c.activities.items.map((item) => (
              <Surface
                key={item.title}
                tone="card"
                shadow="sm"
                radius="xl"
                className="flex flex-col gap-4 p-6"
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary"
                >
                  <ActivityIcon name={item.icon} />
                </span>
                <div>
                  <p className="font-heading text-heading-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-body-sm text-muted-foreground">{item.description}</p>
                </div>
              </Surface>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 6. Photo Gallery */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.gallery.eyebrow}
            title={c.gallery.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <GalleryGrid items={c.gallery.items} categories={c.gallery.categories} />
        </Container>
      </Section>

      {/* 7. Learning Environment */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.environment.eyebrow}
            title={c.environment.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.environment.items.map((item) => (
              <FeatureCard
                key={item.title}
                icon={environmentIcons[item.icon]}
                title={item.title}
                description={item.description}
              />
            ))}
          </Grid>
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
