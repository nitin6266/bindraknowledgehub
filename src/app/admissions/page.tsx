import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  MapPin,
  Phone,
  Mail,
  CalendarCheck,
  Users,
  GraduationCap,
  BarChart3,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

import { buildMetadata } from "@/lib/site";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { admissionsContent as c } from "@/content/admissions";
import { AdmissionEnquiryForm } from "@/components/admissions/admission-enquiry-form";

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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = buildMetadata({
  title: "Admissions",
  description: c.hero.subtitle,
  alternates: { canonical: "/admissions" },
  openGraph: {
    title: "Admissions | Bindra Knowledge Hub",
    description: c.hero.subtitle,
    type: "website",
  },
});

export default function AdmissionsPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Admissions" },
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "https://www.bindraknowledgehub.com/" },
              { name: "Admissions", url: "https://www.bindraknowledgehub.com/admissions" },
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
                src="/admissions/hero.svg"
                alt="A welcoming doorway representing the start of a student’s journey at Bindra Knowledge Hub"
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

      {/* 2. Admission Journey */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.journey.eyebrow}
            title={c.journey.title}
            description={c.journey.intro}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.journey.steps.map((step, i) => (
              <Card key={step.title} className="flex h-full flex-col">
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-bold text-primary">
                    {i + 1}
                  </span>
                  <CardTitle className="mt-4 text-heading-sm">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 3. Book FREE Demo */}
      <Section>
        <Container>
          <Surface tone="card" shadow="sm" radius="xl" className="overflow-hidden">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-10">
              <div className="flex flex-col items-start">
                <Badge variant="accent" className="mb-4">
                  {c.demo.eyebrow}
                </Badge>
                <Heading as="h2" size="lg">
                  {c.demo.title}
                </Heading>
                <Paragraph className="mt-3 max-w-prose">{c.demo.description}</Paragraph>
                <Button asChild variant="cta" size="lg" className="mt-6">
                  <Link href={c.demo.ctaHref}>
                    <CalendarCheck aria-hidden="true" className="size-5" />
                    {c.demo.ctaLabel}
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center rounded-2xl bg-primary/5 p-8">
                <Check aria-hidden="true" className="size-20 text-accent" />
              </div>
            </div>
          </Surface>
        </Container>
      </Section>

      {/* 4. Free Academic Assessment */}
      <Section className="bg-surface/40">
        <Container>
          <Surface tone="card" shadow="sm" radius="xl" className="overflow-hidden">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-10">
              <div className="order-2 flex items-center justify-center rounded-2xl bg-primary/5 p-8 md:order-1">
                <Check aria-hidden="true" className="size-20 text-accent" />
              </div>
              <div className="order-1 flex flex-col items-start md:order-2">
                <Badge variant="accent" className="mb-4">
                  {c.assessment.eyebrow}
                </Badge>
                <Heading as="h2" size="lg">
                  {c.assessment.title}
                </Heading>
                <Paragraph className="mt-3 max-w-prose">{c.assessment.description}</Paragraph>
                <Button asChild variant="cta" size="lg" className="mt-6">
                  <Link href={c.assessment.ctaHref}>{c.assessment.ctaLabel}</Link>
                </Button>
              </div>
            </div>
          </Surface>
        </Container>
      </Section>

      {/* 5. Admission Enquiry Form */}
      <Section id="enquiry">
        <Container>
          <SectionHeader
            eyebrow={c.enquiry.eyebrow}
            title={c.enquiry.title}
            description={c.enquiry.description}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Surface tone="card" shadow="sm" radius="xl" className="mx-auto max-w-3xl p-6 sm:p-10">
            <AdmissionEnquiryForm />
          </Surface>
        </Container>
      </Section>

      {/* 6. Academy Information */}
      <Section className="bg-surface/40">
        <Container>
          <SectionHeader
            eyebrow={c.academy.eyebrow}
            title={c.academy.title}
            description={c.academy.intro}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Grid cols={4} gap="lg" className="mx-auto max-w-6xl">
            {c.academy.items.map((item, i) => (
              <FeatureCard
                key={item.title}
                icon={academyIcons[i]}
                title={item.title}
                description={item.description}
              />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* 7. Visit Us */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow={c.visit.eyebrow}
            title={c.visit.title}
            description={c.visit.description}
            align="center"
            className="mx-auto mb-12 max-w-2xl"
          />
          <Surface tone="card" shadow="sm" radius="xl" className="mx-auto max-w-3xl p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-3">
              <ContactItem
                icon={MapPin}
                label="Campus"
                value={siteConfig.contact.address}
              />
              <ContactItem
                icon={Phone}
                label="Phone"
                value={siteConfig.contact.phone}
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              />
              <ContactItem
                icon={Mail}
                label="Email"
                value={siteConfig.contact.email}
                href={`mailto:${siteConfig.contact.email}`}
              />
            </div>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="cta" size="lg">
                <Link href={c.finalCta.primaryHref}>Schedule a visit</Link>
              </Button>
            </div>
          </Surface>
        </Container>
      </Section>

      {/* 8. FAQ */}
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
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
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

const academyIcons: LucideIcon[] = [Users, GraduationCap, BarChart3, CalendarClock];

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon aria-hidden={true} className="size-6" />
      </span>
      <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">{label}</p>
      <p className="text-body-sm text-foreground">{value}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="rounded-lg transition-opacity hover:opacity-80">
        {content}
      </a>
    );
  }

  return content;
}
