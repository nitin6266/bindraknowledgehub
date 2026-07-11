"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryItem, GalleryCategory } from "@/content/community";

interface GalleryGridProps {
  items: readonly GalleryItem[];
  categories: readonly GalleryCategory[];
}

/**
 * Client-side, backend-free gallery with category filtering. Tiles use
 * lazy-loaded placeholder images; filter state is keyboard accessible via
 * aria-pressed buttons. New items are added through content, not code.
 */
export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [active, setActive] = React.useState<GalleryCategory | "All">("All");
  const filters: (GalleryCategory | "All")[] = ["All", ...categories];

  const visible = active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
        {filters.map((filter) => {
          const isActive = active === filter;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(filter)}
              className={cn(
                "rounded-full border px-4 py-2 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-foreground hover:bg-muted",
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((item, i) => (
          <li key={`${item.title}-${i}`} className="group relative overflow-hidden rounded-xl border border-border bg-muted">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/community/gallery.svg"
                alt={`${item.title} — ${item.category} at Bindra Knowledge Hub`}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-body-sm font-medium text-white">{item.title}</p>
              <p className="text-caption text-white/80">{item.category}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
