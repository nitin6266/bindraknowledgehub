import * as React from "react";
import { cn } from "@/lib/utils";

export interface QuoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  cite?: string;
  author?: string;
}

/** Editorial pull-quote. Uses the fluid `quote` type token. */
export function Quote({ className, author, children, ...props }: QuoteProps) {
  return (
    <figure className={cn("border-l-2 border-accent pl-5", className)}>
      <blockquote
        className="font-heading text-quote text-foreground"
        {...props}
      >
        {children}
      </blockquote>
      {author ? (
        <figcaption className="mt-3 text-body-sm font-medium text-muted-foreground">
          — {author}
        </figcaption>
      ) : null}
    </figure>
  );
}
