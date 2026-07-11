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

export function Navbar({ transparentTop = true }: NavbarProps) {
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const solid = !transparentTop || scrolled;

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
        // Mobile/tablet (<=1024px): premium solid white branded header.
        "border-b border-border bg-background shadow-sm backdrop-blur",
        // Desktop (>1024px): restore scroll-based transparent -> solid behavior.
        solid
          ? "lg:border-b lg:border-border lg:bg-background/90 lg:backdrop-blur supports-[backdrop-filter]:lg:bg-background/75 lg:shadow-none"
          : "lg:border-b lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-container items-center justify-between px-6 sm:px-8 lg:px-10"
      >
        <BrandMark />

        <DesktopNav pathname={pathname} />

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="max-lg:h-11 max-lg:w-11" />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/admissions">Admissions</Link>
          </Button>

          <MobileToggle open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
        </div>
      </nav>

      {mobileOpen && <MobileNav pathname={pathname} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function BrandMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground lg:h-9 lg:w-9"
      >
        B
      </span>
      {/* Mobile/tablet: two-line branded wordmark (always visible) */}
      <span className="flex flex-col leading-none lg:hidden">
        <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
          Bindra
        </span>
        <span className="text-body-xs font-medium text-muted-foreground">Knowledge Hub</span>
      </span>
      {/* Desktop: single-line name */}
      <span className="hidden font-heading text-heading-sm font-bold tracking-tight text-foreground lg:inline">
        {siteConfig.name}
      </span>
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {siteConfig.nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
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
  onClose,
}: {
  pathname: string;
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
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
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