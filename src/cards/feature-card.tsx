import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FeatureIcon } from "@/components/icons/feature-icon";
import { HoverLift } from "@/components/animations/motion-primitives";

export interface FeatureCardProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

/** Highlights a single value/feature with an icon, title and description. */
export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <HoverLift>
      <Card className={className}>
        <CardHeader>
          {Icon ? <FeatureIcon size="lg" variant="accent" icon={Icon} /> : null}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </HoverLift>
  );
}
