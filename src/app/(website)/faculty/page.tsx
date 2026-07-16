import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Lightbulb,
  UserCheck,
  Users,
  ClipboardCheck,
  MessageSquare,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

import { buildMetadata, siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { facultyContent as c } from "@/content/faculty";

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
import { FeatureCard } from "@/cards/feature-card";

export const metadata: Metadata = buildMetadata({
  title: "Faculty",
  description: c.hero.subtitle,
  alternates: { canonical: "/faculty" },
  openGraph: {
    title: "Faculty | Bindra Knowledge Hub",
    description: c.hero.subtitle,
    type: "website",
  },
});

const apartIcons: Record<(typeof c.apart.items)[number]["icon"], LucideIcon> = {
  cap: GraduationCap,
  bulb: Lightbulb,
  user: UserCheck,
  users: Users,
  clipboard: ClipboardCheck,
  message: MessageSquare,
};

export default function FacultyPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Faculty" },
  ];

  const facultyStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: c.educators.members.map((member, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.designation,
        worksFor: {
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
              { name: "Faculty", url: "https://www.bindraknowledgehub.com/faculty" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(facultyStructuredData) }}
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
                src="/faculty/hero.svg"
                alt="The dedicated educators of Bindra Knowledge Hub"
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

      {/* 2. Teaching Philosophy */}
      <Section>
        <Container>
          <Surface
            tone="card"
            shadow="lg"
            radius="2xl"
            className="mx-auto max-w-4xl border-accent/30 p-8 sm:p-12"
          >
            <div className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent-foreground"
              >
                <HeartHandshake className="size-7" />
              </span>
              <SectionHeader
                eyebrow={c.philosophy.eyebrow}
                title={c.philosophy.title}
                align="center"
                className="mx-auto mb-6 max-w-2xl"
              />
              <Paragraph size="lg" className="mx-auto max-w-2xl text-balance">
                {c.philosophy.body}
              </Paragraph>
            </div>
          </Surface>
        </Container>
      </Section>

      {/* 3. Meet Our Educators */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.educators.eyebrow}
            title={c.educators.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.educators.members.map((member) => (
              <Card key={member.name} className="flex h-full flex-col overflow-hidden">
                <div
                  aria-hidden="true"
                  className="flex aspect-[4/5] items-center justify-center bg-gradient-to-b from-primary/10 to-accent/10 font-heading text-4xl font-bold text-primary"
                >
                  {member.initials}
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.designation}</CardDescription>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="accent">{member.qualification}</Badge>
                    <Badge variant="outline">{member.specialization}</Badge>
                    <Badge variant="outline">{member.experience}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Paragraph size="sm">{member.profile}</Paragraph>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/contact">
                      View Profile <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 4. Why Our Faculty Stands Apart */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.apart.eyebrow}
            title={c.apart.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={3} gap="lg" className="mx-auto max-w-5xl">
            {c.apart.items.map((item) => (
              <FeatureCard
                key={item.title}
                icon={apartIcons[item.icon]}
                title={item.title}
                description={item.description}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 5. Student-Centric Teaching */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.process.eyebrow}
            title={c.process.title}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <ol className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-0">
            {c.process.steps.map((step, i) => (
              <Fragment key={step.title}>
                <li className="flex-1">
                  <Surface
                    tone="card"
                    shadow="sm"
                    radius="xl"
                    className="flex h-full flex-col items-center gap-3 p-6 text-center"
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground font-heading text-heading-sm font-bold"
                    >
                      {i + 1}
                    </span>
                    <p className="font-heading text-heading-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-body-sm text-muted-foreground">{step.description}</p>
                  </Surface>
                </li>
                {i < c.process.steps.length - 1 ? (
                  <li aria-hidden="true" className="flex items-center justify-center lg:px-2">
                    <ChevronRight className="hidden size-5 text-primary lg:block" />
                    <ChevronDown className="size-5 text-primary lg:hidden" />
                  </li>
                ) : null}
              </Fragment>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 6. Final CTA */}
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
