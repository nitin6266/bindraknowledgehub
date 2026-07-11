import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverLift } from "@/components/animations/motion-primitives";

export interface ResultCardProps {
  exam: string;
  score: string;
  subtitle?: string;
  className?: string;
}

/** Celebrates a student/exam achievement with a prominent score. */
export function ResultCard({ exam, score, subtitle, className }: ResultCardProps) {
  return (
    <HoverLift>
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-body-sm font-medium uppercase tracking-wide text-muted-foreground">{exam}</p>
          <p className="mt-2 font-heading text-display-md font-bold text-primary">{score}</p>
          {subtitle ? <p className="mt-2 text-body-sm text-muted-foreground">{subtitle}</p> : null}
        </CardContent>
      </Card>
    </HoverLift>
  );
}
