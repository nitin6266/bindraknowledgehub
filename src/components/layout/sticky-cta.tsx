import Link from "next/link";
import { Phone, MessageSquare, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Mobile-first sticky bottom CTA (AGENTS.md: "Sticky bottom CTA").
 * Visible only on small screens (< sm). Redesigned for BKH-MOBILE-001:
 * - Max 56px bar height with comfortable 44px touch targets.
 * - Three equal-width actions: Call, WhatsApp, Book Demo.
 * - Modern glass effect (blur + translucent background) and soft shadow.
 * - Respects the iPhone safe area via env(safe-area-inset-bottom).
 */
export function StickyBottomCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
      <div className="border-t border-border/60 bg-background/80 shadow-[0_-4px_24px_rgba(15,23,42,0.10)] backdrop-blur-md">
        <div className="mx-auto flex max-w-container items-center gap-2 px-3 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
          <Button
            asChild
            variant="outline"
            className="h-11 flex-1 items-center justify-center gap-1.5 px-2 text-body-sm"
          >
            <Link href="tel:+910000000000" aria-label="Call Bindra Knowledge Hub">
              <Phone aria-hidden="true" className="size-4" />
              Call
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 flex-1 items-center justify-center gap-1.5 px-2 text-body-sm"
          >
            <Link
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare aria-hidden="true" className="size-4" />
              WhatsApp
            </Link>
          </Button>
          <Button
            asChild
            className="h-11 flex-1 items-center justify-center gap-1.5 px-2 text-body-sm"
          >
            <Link href="/admissions" aria-label="Book a free demo class">
              <CalendarCheck aria-hidden="true" className="size-4" />
              Book Demo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
