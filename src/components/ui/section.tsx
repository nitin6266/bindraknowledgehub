import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Vertical rhythm wrapper for page sections. Applies consistent
 * top/bottom spacing using the section-y tokens (responsive).
 */
const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }
>(({ className, as: Comp = "section", ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn("py-section-y-sm lg:py-section-y", className)}
    {...props}
  />
));
Section.displayName = "Section";

export { Section };
