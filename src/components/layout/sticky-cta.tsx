import Link from "next/link";
import { Phone, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Mobile-first sticky bottom CTA (AGENTS.md: "Sticky bottom CTA").
 * Visible only on small screens; hidden on >= sm where the navbar CTA shows.
 * Contains three actions: Call, WhatsApp, Enquiry.
 */
export function StickyBottomCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-container items-center gap-2">
        <Button asChild variant="outline" size="lg" className="flex-1 flex items-center justify-center gap-2">
          <Link href="tel:+910000000000">
            <Phone aria-hidden="true" className="size-5" />
            Call
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1 flex items-center justify-center gap-2">
          <Link href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer">
            <MessageSquare aria-hidden="true" className="size-5" />
            WhatsApp
          </Link>
        </Button>
        <Button asChild size="lg" className="flex-1 flex items-center justify-center gap-2">
          <Link href="/admissions">
            Enquiry
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}