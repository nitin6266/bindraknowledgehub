import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "@/components/typography/quote";
import { HoverLift } from "@/components/animations/motion-primitives";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  className?: string;
}

/** Parent/student testimonial card. */
export function TestimonialCard({ quote, author, role, className }: TestimonialCardProps) {
  return (
    <HoverLift>
      <Card className={className}>
        <CardContent className="p-6">
          <Quote author={role ? `${author}, ${role}` : author}>{quote}</Quote>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
