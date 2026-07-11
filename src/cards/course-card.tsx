import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverLift } from "@/components/animations/motion-primitives";

export interface CourseCardProps {
  title: string;
  description: string;
  level?: string;
  duration?: string;
  href?: string;
  className?: string;
}

/** Course summary card with meta badges and a learn-more link. */
export function CourseCard({ title, description, level, duration, href, className }: CourseCardProps) {
  return (
    <HoverLift>
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {level ? <Badge variant="default">{level}</Badge> : null}
            {duration ? <Badge variant="outline">{duration}</Badge> : null}
          </div>
        </CardContent>
        {href ? (
          <CardFooter>
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-body-sm font-medium text-primary transition-colors hover:underline"
            >
              Learn more <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </CardFooter>
        ) : null}
      </Card>
    </HoverLift>
  );
}
