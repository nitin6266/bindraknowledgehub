import * as React from "react";
import { cn } from "@/lib/utils";

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "base" | "lg";
}

/** Body paragraph primitive with the three body sizes. */
export function Paragraph({ className, size = "base", ...props }: ParagraphProps) {
  return (
    <p
      className={cn(
        size === "sm" && "text-body-sm text-muted-foreground",
        size === "base" && "text-body text-foreground",
        size === "lg" && "text-body-lg text-foreground",
        className,
      )}
      {...props}
    />
  );
}
