import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverLift } from "@/components/animations/motion-primitives";

export interface TimelineCardProps {
  year: string;
  title: string;
  description: string;
  className?: string;
}

/** Milestone card for academy history / journey timelines. */
export function TimelineCard({ year, title, description, className }: TimelineCardProps) {
  return (
    <HoverLift>
      <Card className={className}>
        <CardContent className="p-6">
          <Badge variant="accent">{year}</Badge>
          <p className="mt-3 font-heading text-heading-sm font-semibold text-foreground">{title}</p>
          <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
