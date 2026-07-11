"use client";

import { Award, Monitor, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrustItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText?: string;
  badgeVariant?: "default" | "accent" | "outline" | "success";
}

/** Trust Bar configuration - matches the prompt specification exactly */
const trustItems: TrustItem[] = [
  { label: "20+ Years Teaching Legacy", icon: Award, badgeText: "Legacy", badgeVariant: "accent" },
  { label: "Offline & Online Classes", icon: Monitor, badgeText: "Flexible", badgeVariant: "default" },
  { label: "Personalized Attention", icon: Users, badgeText: "1:1 Focus", badgeVariant: "success" },
  { label: "Classes 3–12", icon: BookOpen, badgeText: "Complete", badgeVariant: "outline" },
] as const;

export function TrustBar() {
  return (
    <section
      id="trust-bar"
      aria-labelledby="trust-bar-heading"
      className="border-y border-border/50 bg-muted/30 py-10 lg:py-16"
    >
      <div className="mx-auto max-w-container px-6 sm:px-8 lg:px-10">
        <div className="sr-only" id="trust-bar-heading">
          Trust Indicators
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <Card
              key={index}
              className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="flex w-full flex-col items-center justify-center gap-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon aria-hidden="true" className="size-7" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-body font-medium text-foreground leading-snug">
                    {item.label}
                  </p>
                  {item.badgeText && (
                    <Badge variant={item.badgeVariant} className="w-fit">
                      {item.badgeText}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}