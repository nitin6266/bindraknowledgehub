"use client";

import { Users, BookOpen, Award, Star, Zap, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, title: "Interactive Learning", description: "Smart classrooms with digital boards and collaborative tools", icon: BookOpen, color: "bg-primary/10" },
  { id: 2, title: "Personalized Guidance", description: "One-on-one mentoring sessions for concept clarity", icon: Users, color: "bg-accent/10" },
  { id: 3, title: "Science Lab Sessions", description: "Hands-on experiments for experiential learning", icon: Zap, color: "bg-amber/10" },
  { id: 4, title: "Award Ceremony", description: "Celebrating academic excellence and milestones", icon: Award, color: "bg-yellow/10" },
  { id: 5, title: "Annual Day", description: "Cultural performances and student showcases", icon: Star, color: "bg-pink/10" },
  { id: 6, title: "Group Discussions", description: "Collaborative problem-solving sessions", icon: Users, color: "bg-green/10" },
];

export function Gallery() {
  return (
    <Section id="gallery" aria-labelledby="gallery-heading" className="bg-surface/40 py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <ImageIcon aria-hidden="true" className="size-3.5" />
            Campus Life
          </Badge>
          <Heading as="h2" id="gallery-heading" size="display" align="center" className="max-w-3xl">
            A Glimpse into Campus Life
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Explore the vibrant learning environment at Bindra Knowledge Hub through moments that define our community.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <Card key={item.id} className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="relative z-10 flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-primary mb-4`}>
                      <item.icon aria-hidden="true" className="size-7" />
                    </div>
                    <p className="text-body-sm text-muted-foreground max-w-xs mx-auto">
                      {item.description}
                    </p>
                  </div>
                  <div className="absolute top-6 left-6 size-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
                  <div className="absolute bottom-6 right-6 size-24 rounded-full bg-accent/10 blur-2xl" aria-hidden="true" />
                </div>
              </div>
              <CardContent className="p-4 flex flex-col gap-3">
                <Heading as="h3" size="md" className="text-foreground">
                  {item.title}
                </Heading>
                <p className="text-body-sm text-muted-foreground flex-1">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[52px]">
            <a href="/community">Explore Campus Life</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
