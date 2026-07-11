import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Reusable section intro: optional eyebrow badge + title + subtitle. */
export function SectionHeader({ eyebrow, title, description, align = "left", className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
      <Heading as="h2" size="xl" align={align}>
        {title}
      </Heading>
      {description ? <Subheading align={align}>{description}</Subheading> : null}
    </div>
  );
}
