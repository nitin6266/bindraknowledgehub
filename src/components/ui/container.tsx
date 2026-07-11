import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Centered, max-width constrained wrapper. Uses the `--container-max`
 * token (1280px) and responsive horizontal padding from the design system.
 */
const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mx-auto w-full max-w-container px-6 sm:px-8 lg:px-10", className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";

export { Container };
