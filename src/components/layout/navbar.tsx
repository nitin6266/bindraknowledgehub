"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface NavbarProps {
  /** When true the bar is transparent until the user scrolls (hero pages). */
  transparentTop?: boolean;
}

/** Mapping from nav titles to homepage section IDs for smooth scrolling. */
const HOMEPAGE_ANCHORS: Record<string, string> = {
  Home: "#hero",
  About: "#our-story",
  Courses: "#courses",
  Faculty: "#meet-your-mentors",
  Results: "#wall-of-success",
  Testimonials: "#testimonials",
  Gallery: "#gallery",
  Admissions: "#free-assessment",
  Contact: "#contact",
};

export function Navbar({ transparentTop = true }: NavbarProps) {
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const solid = !transparentTop || scrolled;
  const isHome = pathname === "/";

  // Close mobile menu on route change.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-normal ease-soft-out",
        solid
          ? "border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-container items-center justify-between px-6 sm:px-8 lg:px-10"
      >
        <BrandMark />

        <DesktopNav pathname={pathname} isHome={isHome} />

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/admissions">Admissions</Link>
          </Button>

          <MobileToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
        </div>
      </nav>

      {mobileOpen && <MobileNav pathname={pathname} isHome={isHome} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function BrandMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md font-heading text-heading-sm font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        B
      </span>
      <span className="hidden sm:inline">{siteConfig.name}</span>
    </Link>
  );
}

function DesktopNav({ pathname, isHome }: { pathname: string; isHome: boolean }) {
  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {siteConfig.nav.map((item) => {
        const href = isHome ? (HOMEPAGE_ANCHORS[item.title] ?? item.href) : item.href;
        const active = isHome
          ? false // On homepage, we don't highlight active section (could be enhanced with IntersectionObserver)
          : item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-body-sm font-medium transition-colors duration-fast hover:bg-muted",
                active ? "text-primary" : "text-foreground/80",
              )}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
    >
      {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
    </button>
  );
}

function MobileNav({
  pathname,
  isHome,
  onClose,
}: {
  pathname: string;
  isHome: boolean;
  onClose: () => void;
}) {
  // Close on Escape for keyboard users.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="lg:hidden"
    >
      <div className="fixed inset-0 top-16 z-40 overflow-y-auto border-t border-border bg-background px-6 py-6 animate-enter-fade">
        <ul className="flex flex-col gap-1">
          {siteConfig.nav.map((item) => {
            const href = isHome ? (HOMEPAGE_ANCHORS[item.title] ?? item.href) : item.href;
            const active = isHome
              ? false
              : item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-4 py-3 text-body font-medium transition-colors hover:bg-muted",
                    active ? "bg-muted text-primary" : "text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/admissions" onClick={onClose}>
            Apply for Admissions
          </Link>
        </Button>
      </div>
    </div>
  );
}