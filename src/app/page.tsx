import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import { pages } from "@/content/pages";
import { Hero } from "@/components/layout/hero";
import { TrustBar } from "@/components/layout/trust-bar";
import { WhyChooseUs } from "@/components/layout/why-choose-us";
import { OurStory } from "@/components/layout/our-story";
import { MeetYourMentors } from "@/components/layout/meet-your-mentors";
import { Courses } from "@/components/layout/courses";
import { CanWeHelp } from "@/components/layout/can-we-help";
import { FreeAssessment } from "@/components/layout/free-assessment";
import { StudentJourney } from "@/components/layout/student-journey";
import { WallOfSuccess } from "@/components/layout/wall-of-success";
import { ParentTestimonials } from "@/components/layout/parent-testimonials";
import { Gallery } from "@/components/layout/gallery";
import { FAQ } from "@/components/layout/faq";
import { Contact } from "@/components/layout/contact";

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
      <OurStory />
      <MeetYourMentors />
      <Courses />
      <CanWeHelp />
      <FreeAssessment />
      <StudentJourney />
      <WallOfSuccess />
      <ParentTestimonials />
      <Gallery />
      <FAQ />
      <Contact />
    </>
  );
}