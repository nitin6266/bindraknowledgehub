"use client";

import { Users, BookOpen, Award, Star, Zap, Heart, Image} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface GalleryItem {
  id: number;
  category: "classroom" | "teaching" | "activities" | "achievements" | "celebrations";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const galleryItems : GalleryItem[] = [
  { id: 1, category: "classroom", title: "Interactive Learning", description: "Smart classrooms with digital boards and collaborative tools", icon: BookOpen, color: "bg-primary/10" },
  { id: 2, category: "teaching", title: "Personalized Guidance", description: "One-on-one mentoring sessions for concept clarity", icon: Users, color: "bg-accent/10" },
  { id: 3, category: "activities", title: "Science Lab Sessions", description: "Hands-on experiments for experiential learning", icon: Zap, color: "bg-amber/10" },
  { id: 4, category: "achievements", title: "Award Ceremony", description: "Celebrating academic excellence and milestones", icon: Award, color: "bg-yellow/10" },
  { id: 5, category: "celebrations", title: "Annual Day", description: "Cultural performances and student showcases", icon: Star, color: "bg-pink/10" },
  { id: 6, category: "classroom", title: "Group Discussions", description: "Collaborative problem-solving sessions", icon: Users, color: "bg-green/10" },
  { id: 7, category: "teaching", title: "Doubt Solving", description: "Dedicated sessions for individual query resolution", icon: BookOpen, color: "bg-blue/10" },
  { id: 8, category: "activities", title: "Olympiad Training", description: "Specialized preparation for competitive exams", icon: Zap, color: "bg-blue/10" },
  { id: 9, category: "achievements", title: "Result Declaration", description: "Celebrating board and competitive exam results", icon: Award, color: "bg-purple/10" },
  { id: 10, category: "celebrations", title: "Teacher's Day", description: "Students expressing gratitude to mentors", icon: Heart, color: "bg-red/10" },
  { id: 11, category: "activities", title: "Sports Day", description: "Physical education and team building", icon: Zap, color: "bg-orange/10" },
  { id: 12, category: "celebrations", title: "Graduation", description: "Celebrating academic journey completion", icon: Star, color: "bg-indigo/10" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "classroom", label: "Classroom" },
  { id: "teaching", label: "Teaching" },
  { id: "activities", label: "Activities" },
  { id: "achievements", label: "Achievements" },
  { id: "celebrations", label: "Celebrations" },
] as const;

export function Gallery() {
  return (
    <Section id="gallery" aria-labelledby="gallery-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <Image aria-hidden="true" className="size-3.5" />
            Gallery
          </Badge>
          <Heading as="h2" id="gallery-heading" size="display" align="center" className="max-w-3xl">
            A Glimpse into Campus Life
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Explore the vibrant learning environment at Bindra Knowledge Hub through moments that define our community.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 text-body-sm font-medium rounded-full transition-all ${
                cat.id === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galleryItems.map((item) => (
            <Card key={item.id} className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C9C9C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

                <div className="relative z-10 flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-primary mb-4`}>
                      <item.icon aria-hidden="true" className="size-7" />
                    </div>
                    <p className="text-body-sm text-muted-foreground max-w-xs mx-auto">
                      {item.description}
                    </p>
                  </div>

                  {/* Decorative accents */}
                  <div className="absolute top-6 left-6 size-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
                  <div className="absolute bottom-6 right-6 size-24 rounded-full bg-accent/10 blur-2xl" aria-hidden="true" />
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="text-body-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-body-xs">
                    {item.category}
                  </Badge>
                </div>
                <Heading as="h3" size="md" className="text-foreground">
                  {item.title}
                </Heading>
                <p className="text-body-sm text-muted-foreground line-clamp-2 flex-1">
                  {item.description}
                </p>
                <p className="text-body-xs text-muted-foreground mt-auto">
                  Placeholder — replace with actual photography in production
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 lg:mt-16 text-center">
          <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
            View Complete Gallery
          </Heading>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
            Browse all campus moments organized by category and academic year.
          </p>
          <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[52px]">
            <a href="/gallery">View Full Gallery</a>
          </Button>
          <p className="mt-8 text-center text-body-sm text-muted-foreground">
            This section uses placeholder content. Full gallery with real photography arrives in an upcoming sprint.
          </p>
        </div>
      </Container>
    </Section>
  );
}