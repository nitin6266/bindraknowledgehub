"use client";

import { Award, GraduationCap, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface Mentor {
  name: string;
  role: string;
  credentials: string[];
  shortProfile: string;
  badge: { text: string; variant: "default" | "accent" | "outline" | "success" };
  icon: React.ComponentType<{ className?: string }>;
}

const mentors: Mentor[] = [
  {
    name: "Mr. Mandeep Singh Bindra",
    role: "Director",
    credentials: ["M.Tech. Computer Science", "Former University Faculty"],
    shortProfile: "After completing his M.Tech. in Computer Science and serving as a university faculty member, he chose to continue his mother's dream of providing quality education through a student-focused academy.",
    badge: { text: "Leadership", variant: "accent" },
    icon: Award,
  },
  {
    name: "Mrs. Manroop Kaur",
    role: "Vice Principal",
    credentials: ["M.Sc Chemistry", "Gold Medalist", "Khalsa College Amritsar"],
    shortProfile: "An M.Sc. Chemistry Gold Medalist from Khalsa College Amritsar, Mrs. Manroop Kaur believes teaching is a passion and works wholeheartedly to inspire confidence and excellence in every student.",
    badge: { text: "Excellence", variant: "success" },
    icon: GraduationCap,
  },
  {
    name: "Mrs. Tejinder Kaur",
    role: "Founding Inspiration",
    credentials: ["20+ Years Teaching Experience"],
    shortProfile: "For more than two decades, Mrs. Tejinder Kaur dedicated her life to teaching and inspiring students with patience, discipline and care. Her legacy continues to guide our educational philosophy.",
    badge: { text: "Legacy", variant: "outline" },
    icon: Sparkles,
  },
] as const;

export function MeetYourMentors() {
  return (
    <Section id="meet-your-mentors" aria-labelledby="meet-your-mentors-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-6 inline-flex">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Meet Your Mentors
          </Badge>
          <Heading as="h2" id="meet-your-mentors-heading" size="display" align="center" className="max-w-3xl mx-auto">
            Learn from Passionate Educators
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Dedicated educators who combine academic excellence with a genuine passion for student success.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor, index) => (
            <Card
              key={index}
              className="flex h-full flex-col items-center p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="flex w-full flex-col items-center gap-4 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <mentor.icon aria-hidden="true" className="size-8" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Heading as="h3" size="lg" className="text-foreground">
                    {mentor.name}
                  </Heading>
                  <p className="text-body-sm text-primary font-medium">{mentor.role}</p>
                  <Badge variant={mentor.badge.variant} className="w-fit">
                    {mentor.badge.text}
                  </Badge>
                </div>

                <ul className="flex flex-col items-center gap-1 text-body-sm text-muted-foreground">
                  {mentor.credentials.map((cred, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <ChevronRight aria-hidden="true" className="size-3.5 opacity-50" />
                      {cred}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-body text-muted-foreground leading-relaxed text-center">
                  {mentor.shortProfile}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[52px]">
            <a href="/faculty">
              Meet Our Faculty
              <ChevronRight aria-hidden="true" className="size-4 ml-2" />
            </a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}