import * as React from "react";
import { Card } from "@/components/ui/card";
import { HoverLift } from "@/components/animations/motion-primitives";
import { cn } from "@/lib/utils";

export interface GalleryCardProps {
  /** Image URL. When absent, renders a branded placeholder tile. */
  src?: string;
  alt: string;
  title?: string;
  className?: string;
}

/** Gallery tile with image (or placeholder) and optional caption. */
export function GalleryCard({ src, alt, title, className }: GalleryCardProps) {
  return (
    <HoverLift>
      <Card className={cn("overflow-hidden", className)}>
        <div className="aspect-square w-full bg-gradient-to-br from-primary/15 via-surface to-accent/15">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-body-sm text-muted-foreground">
              {title ?? alt}
            </div>
          )}
        </div>
      </Card>
    </HoverLift>
  );
}
