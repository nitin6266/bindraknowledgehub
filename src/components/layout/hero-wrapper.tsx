import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeroWrapperProps extends React.HTMLAttributes<HTMLElement> {
  /** Centers content and constrains width for hero readability. */
  align?: "left" | "center";
  /** Adds a subtle warm gradient backdrop. */
  muted?: boolean;
}

/**
 * Full-bleed hero region. Pairs with the transparent navbar (Navbar becomes
 * solid on scroll). Provides consistent top offset for the fixed header.
 */
export function HeroWrapper({ className, align = "center", muted = false, children, ...props }: HeroWrapperProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[68vh] items-center overflow-hidden pt-16",
        muted && "bg-gradient-to-b from-surface to-background",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-container px-6 sm:px-8 lg:px-10",
          align === "center" && "text-center",
        )}
      >
        {children}
      </div>
    </section>
  );
}
