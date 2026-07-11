import Link from "next/link";
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { footerQuickLinks, socialLinks } from "@/data/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <Container className="py-section-y-sm">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand + contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground"
              >
                B
              </span>
              <span className="font-heading text-heading-sm font-bold">{siteConfig.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-body-sm text-muted-foreground">
              {siteConfig.tagline} A family-driven academy built on trust, care and results.
            </p>

            <ul className="mt-6 space-y-3 text-body-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-foreground">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          {footerQuickLinks.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-heading text-heading-sm font-semibold">{group.heading}</h2>
              <ul className="mt-4 space-y-2 text-body-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Newsletter placeholder */}
          <div>
            <h2 className="font-heading text-heading-sm font-semibold">Stay in touch</h2>
            <p className="mt-4 text-body-sm text-muted-foreground">
              Get updates on admissions, events and student stories.
            </p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              aria-label="Newsletter signup (coming soon)"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-body-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" size="md" className="shrink-0">
                <Send aria-hidden="true" className="size-4" />
                Subscribe
              </Button>
            </form>
            <p className="mt-2 text-body-xs text-muted-foreground">
              Newsletter integration arrives in an upcoming sprint.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-body-xs text-muted-foreground">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.platform];
              return (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
