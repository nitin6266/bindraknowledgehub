import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverLift } from "@/components/animations/motion-primitives";
import { cn } from "@/lib/utils";

export interface FacultyCardProps {
  name: string;
  role: string;
  /** Optional photo URL; when absent a monogram placeholder is shown. */
  image?: string;
  initials?: string;
  className?: string;
}

/** Faculty profile card with photo/monogram and role. */
export function FacultyCard({ name, role, image, initials, className }: FacultyCardProps) {
  const monogram = initials ?? name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <HoverLift>
      <Card className={cn("overflow-hidden", className)}>
        <div className="aspect-[4/5] w-full bg-gradient-to-b from-primary/10 to-accent/10">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-heading text-3xl font-bold text-primary">
              {monogram}
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <p className="font-heading text-heading-sm font-semibold text-foreground">{name}</p>
          <p className="mt-1 text-body-sm text-muted-foreground">{role}</p>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
