import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { AnimatedCounter } from "@/components/utility/animated-counter";
import { HoverLift } from "@/components/animations/motion-primitives";

export interface StatisticCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

/** Animated metric card (students taught, pass rate, years, etc.). */
export function StatisticCard({ value, suffix, prefix, label, icon: Icon, className }: StatisticCardProps) {
  return (
    <HoverLift>
      <Card className={className}>
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          {Icon ? (
            <IconWrapper size="md" variant="accent">
              <Icon className="size-5" />
            </IconWrapper>
          ) : null}
          <p className="font-heading text-display-md font-bold text-primary">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          </p>
          <p className="text-body-sm text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
