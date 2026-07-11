import * as React from "react";
import { cn } from "@/lib/utils";

export interface SubheadingProps extends React.HTMLAttributes<HTMLParagraphElement> {
  align?: "left" | "center" | "right";
}

/** Lead/subtitle text under a heading. Calm, larger body. */
export function Subheading({ className, align = "left", ...props }: SubheadingProps) {
  return (
    <p
      className={cn(
        "text-balance text-body-lg text-muted-foreground",
        align === "center" && "mx-auto text-center",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    />
  );
}
